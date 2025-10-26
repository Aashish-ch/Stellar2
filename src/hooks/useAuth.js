import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { signTransaction } from '@stellar/freighter-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useAuth() {
  const { isWalletConnected, publicKey } = useWallet();
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isWalletConnected || !publicKey) {
      setToken(null);
      localStorage.removeItem('auth_token');
    }
  }, [isWalletConnected, publicKey]);

  const authenticate = async () => {
    if (!isWalletConnected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get challenge from server
      const challengeResponse = await fetch(`${API_URL}/auth/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey })
      });

      if (!challengeResponse.ok) {
        throw new Error('Failed to get challenge');
      }

      const { challenge } = await challengeResponse.json();

      // Sign the challenge using Freighter
      const signature = await signTransaction(challenge, {
        publicKey
      });

      // Verify signature with server
      const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          signature
        })
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify signature');
      }

      const { token: newToken } = await verifyResponse.json();
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);

      return newToken;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return {
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    authenticate,
    logout
  };
}

// Helper to make authenticated API calls
export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    throw new Error('Authentication expired');
  }

  return response;
}
