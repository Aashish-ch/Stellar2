import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionCard = ({ onConnectionChange }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = () => {
    const connected = localStorage.getItem('wallet-connected') === 'true';
    const address = localStorage.getItem('wallet-address') || '';
    
    setWalletConnected(connected);
    setWalletAddress(address);
    
    if (onConnectionChange) {
      onConnectionChange(connected, address);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setConnectionError('');

    try {
      // Simulate Freighter wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockAddress = 'GDXNKJM7VWXYZ2K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7M2';
      
      localStorage.setItem('wallet-connected', 'true');
      localStorage.setItem('wallet-address', mockAddress);
      localStorage.setItem('wallet-balance', '1,250.50');
      
      setWalletConnected(true);
      setWalletAddress(mockAddress);
      
      if (onConnectionChange) {
        onConnectionChange(true, mockAddress);
      }
    } catch (error) {
      setConnectionError('Failed to connect wallet. Please ensure Freighter is installed and unlocked.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('wallet-connected');
    localStorage.removeItem('wallet-address');
    localStorage.removeItem('wallet-balance');
    
    setWalletConnected(false);
    setWalletAddress('');
    
    if (onConnectionChange) {
      onConnectionChange(false, '');
    }
  };

  if (walletConnected) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Wallet Connected</h3>
              <p className="text-sm text-muted-foreground">Freighter wallet successfully connected</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            iconName="LogOut"
          >
            Disconnect
          </Button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Wallet Address</span>
              <Button
                variant="ghost"
                size="xs"
                iconName="Copy"
                onClick={() => navigator.clipboard?.writeText(walletAddress)}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs font-mono text-muted-foreground break-all">
              {walletAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Globe" size={14} className="text-warning" />
                <span className="text-xs font-medium text-foreground">Network</span>
              </div>
              <p className="text-sm font-semibold text-warning">TESTNET</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Shield" size={14} className="text-success" />
                <span className="text-xs font-medium text-foreground">Status</span>
              </div>
              <p className="text-sm font-semibold text-success">Verified</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
          <Icon name="Wallet" size={32} className="text-primary" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Connect your Freighter wallet to start staking in creators and earning rewards
          </p>
        </div>

        {connectionError && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
              <p className="text-sm text-error">{connectionError}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={connectWallet}
            loading={isConnecting}
            iconName="Wallet"
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}
          </Button>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Don't have Freighter wallet?</p>
            <Button
              variant="outline"
              size="sm"
              iconName="ExternalLink"
              onClick={() => window.open('https://freighter.app/', '_blank')}
              className="w-full"
            >
              Install Freighter
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Security Features</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={12} className="text-success" />
                <span>Your keys remain in your wallet</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={12} className="text-success" />
                <span>Stellar blockchain security</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Check" size={12} className="text-success" />
                <span>Transaction signing required</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionCard;