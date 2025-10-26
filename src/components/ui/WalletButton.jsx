import React from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';
import Icon from '../AppIcon';

export function WalletButton() {
  const { isWalletConnected, publicKey, balance, error, connectWallet, disconnectWallet } = useWallet();
  const { isAuthenticated, authenticate, logout, isLoading } = useAuth();

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
      await authenticate();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    logout();
  };

  if (!window.freighterApi) {
    return (
      <Button
        variant="outline"
        size="sm"
        iconName="ExternalLink"
        onClick={() => window.open('https://freighter.app/', '_blank')}
      >
        Install Freighter
      </Button>
    );
  }

  if (!isWalletConnected || !isAuthenticated) {
    return (
      <Button
        variant="primary"
        size="sm"
        iconName="Wallet"
        onClick={handleConnect}
        loading={isLoading}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col items-end mr-2">
        <span className="text-sm font-medium">{shortenAddress(publicKey)}</span>
        <span className="text-xs text-muted-foreground">{balance} XLM</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDisconnect}
        className="hover:bg-error/10 hover:text-error"
      >
        <Icon name="LogOut" size={16} />
      </Button>
    </div>
  );
}
