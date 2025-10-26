import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const WalletStatusIndicator = ({ compact = false }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for wallet connection changes
    const handleStorageChange = () => {
      checkWalletConnection();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkWalletConnection = () => {
    const connected = localStorage.getItem('wallet-connected') === 'true';
    const address = localStorage.getItem('wallet-address') || '';
    const walletBalance = localStorage.getItem('wallet-balance') || '0.00';
    
    setWalletConnected(connected);
    setWalletAddress(address);
    setBalance(walletBalance);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAddress = 'GDXNKJM7VWXYZ2K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7M2';
      const mockBalance = (Math.random() * 10000)?.toFixed(2);
      
      localStorage.setItem('wallet-connected', 'true');
      localStorage.setItem('wallet-address', mockAddress);
      localStorage.setItem('wallet-balance', mockBalance);
      
      setWalletConnected(true);
      setWalletAddress(mockAddress);
      setBalance(mockBalance);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('wallet-connected');
    localStorage.removeItem('wallet-address');
    localStorage.removeItem('wallet-balance');
    
    setWalletConnected(false);
    setWalletAddress('');
    setBalance('0.00');
    setShowDropdown(false);
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-success' : 'bg-warning'}`} />
        {walletConnected ? (
          <Link 
            to="/wallet-connection"
            className="text-sm font-mono text-muted-foreground hover:text-foreground transition-smooth"
          >
            {truncateAddress(walletAddress)}
          </Link>
        ) : (
          <Button 
            variant="ghost" 
            size="xs" 
            onClick={connectWallet}
            loading={isLoading}
            iconName="Wallet"
          >
            Connect
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {walletConnected ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-sm font-medium text-foreground">Connected</span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              iconName="MoreVertical"
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Address</span>
              <span className="text-xs font-mono text-foreground">{truncateAddress(walletAddress)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Balance</span>
              <span className="text-sm font-semibold text-success">{balance} XLM</span>
            </div>
          </div>
          
          <Link to="/wallet-connection">
            <Button variant="outline" size="sm" className="w-full" iconName="ExternalLink">
              View Wallet
            </Button>
          </Link>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-2 py-2 z-200">
              <button
                onClick={disconnectWallet}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-smooth"
              >
                <Icon name="LogOut" size={14} />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-sm font-medium text-muted-foreground">Not Connected</span>
          </div>
          
          <Button 
            variant="primary" 
            size="sm" 
            onClick={connectWallet}
            loading={isLoading}
            iconName="Wallet"
            className="w-full"
          >
            Connect Wallet
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Connect your Stellar wallet to start staking and earning rewards
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletStatusIndicator;