import { useCallback, useEffect, useState } from 'react';
import { authenticatedFetch } from './useAuth';
import { useWallet } from '../contexts/WalletContext';
import { TransactionManager } from '../utils/TransactionManager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useWatchRewards() {
  const { publicKey, isWalletConnected } = useWallet();
  const [balance, setBalance] = useState('0');
  const [watchHistory, setWatchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize transaction manager
  const transactionManager = new TransactionManager(
    process.env.NEXT_PUBLIC_HORIZON_URL
  );

  // Fetch user's token balance
  const fetchBalance = useCallback(async () => {
    if (!isWalletConnected || !publicKey) return;

    try {
      const response = await authenticatedFetch(`${API_URL}/watch/balance`);
      if (!response.ok) throw new Error('Failed to fetch balance');

      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Balance fetch error:', error);
      setError(error.message);
    }
  }, [isWalletConnected, publicKey]);

  // Fetch watch history
  const fetchHistory = useCallback(async () => {
    if (!isWalletConnected || !publicKey) return;

    try {
      const response = await authenticatedFetch(`${API_URL}/watch/history`);
      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setWatchHistory(data.watches);
    } catch (error) {
      console.error('History fetch error:', error);
      setError(error.message);
    }
  }, [isWalletConnected, publicKey]);

  // Record watch event
  const recordWatch = async (videoId, duration) => {
    if (!isWalletConnected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(`${API_URL}/watch/watch-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          duration
        })
      });

      if (!response.ok) throw new Error('Failed to record watch event');

      const data = await response.json();
      await fetchBalance(); // Update balance after receiving rewards
      return data;
    } catch (error) {
      console.error('Watch event error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get swap rates
  const getSwapRates = async () => {
    try {
      const response = await fetch(`${API_URL}/watch/swap-rates`);
      if (!response.ok) throw new Error('Failed to fetch swap rates');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Swap rates error:', error);
      throw error;
    }
  };

  // Swap tokens
  const swapTokens = async (amount, isBuy) => {
    if (!isWalletConnected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const rates = await getSwapRates();
      const price = isBuy ? rates.asks[0].price : rates.bids[0].price;
      
      // Create the swap transaction
      const operation = isBuy
        ? transactionManager.createPaymentOperation(publicKey, amount)
        : transactionManager.createPaymentOperation(publicKey, amount * price);

      const result = await transactionManager.executeTransaction(publicKey, [operation]);
      await fetchBalance(); // Update balance after swap
      return result;
    } catch (error) {
      console.error('Token swap error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (isWalletConnected && publicKey) {
      fetchBalance();
      fetchHistory();
    }
  }, [isWalletConnected, publicKey, fetchBalance, fetchHistory]);

  return {
    balance,
    watchHistory,
    isLoading,
    error,
    recordWatch,
    getSwapRates,
    swapTokens,
    refreshBalance: fetchBalance,
    refreshHistory: fetchHistory
  };
}
