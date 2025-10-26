import React, { createContext, useContext, useState, useEffect } from 'react';
import { isConnected, getUserPublicKey } from '@stellar/freighter-api';
import * as StellarSdk from 'stellar-sdk';

const WalletContext = createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }) {
  const [walletState, setWalletState] = useState({
    isWalletConnected: false,
    publicKey: null,
    balance: null,
    error: null
  });

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const connected = await isConnected();
      if (connected) {
        const publicKey = await getUserPublicKey();
        await fetchAccountBalance(publicKey);
      }
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const fetchAccountBalance = async (publicKey) => {
    try {
      const server = new StellarSdk.Server(process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org');
      const account = await server.loadAccount(publicKey);
      
      const xlmBalance = account.balances.find(
        balance => balance.asset_type === 'native'
      );

      setWalletState({
        isWalletConnected: true,
        publicKey,
        balance: xlmBalance ? xlmBalance.balance : '0',
        error: null
      });
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Balance fetch failed'
      }));
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet not installed');
      }
      const publicKey = await getUserPublicKey();
      await fetchAccountBalance(publicKey);
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Wallet connection failed'
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      isWalletConnected: false,
      publicKey: null,
      balance: null,
      error: null
    });
    localStorage.removeItem('wallet-connected');
    localStorage.removeItem('wallet-address');
    localStorage.removeItem('wallet-balance');
  };

  const value = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    checkWalletConnection
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
