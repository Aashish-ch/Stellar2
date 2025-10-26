import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityIndicators = ({ walletConnected }) => {
  const [securityStatus, setSecurityStatus] = useState({
    walletLocked: false,
    networkSecure: true,
    permissionsGranted: false,
    backupReminder: true
  });
  const [showNetworkSwitcher, setShowNetworkSwitcher] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('TESTNET');

  useEffect(() => {
    if (walletConnected) {
      checkSecurityStatus();
    }
  }, [walletConnected]);

  const checkSecurityStatus = () => {
    // Simulate security checks
    setSecurityStatus({
      walletLocked: false,
      networkSecure: true,
      permissionsGranted: true,
      backupReminder: Math.random() > 0.7 // 30% chance to show backup reminder
    });
  };

  const switchNetwork = (network) => {
    setCurrentNetwork(network);
    setShowNetworkSwitcher(false);
    
    // In a real app, this would trigger actual network switching
    console.log(`Switching to ${network}`);
  };

  const dismissBackupReminder = () => {
    setSecurityStatus(prev => ({ ...prev, backupReminder: false }));
  };

  if (!walletConnected) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center space-y-4">
          <Icon name="Shield" size={48} className="text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Security Status</h3>
            <p className="text-muted-foreground">Connect your wallet to view security information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Security Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Security Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm text-success">Secure</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={securityStatus?.walletLocked ? "Lock" : "Unlock"} 
                size={20} 
                className={securityStatus?.walletLocked ? "text-error" : "text-success"}
              />
              <div>
                <p className="text-sm font-medium text-card-foreground">Wallet Connection</p>
                <p className="text-xs text-muted-foreground">
                  {securityStatus?.walletLocked ? 'Wallet is locked' : 'Connected and unlocked'}
                </p>
              </div>
            </div>
            <Icon 
              name="CheckCircle" 
              size={16} 
              className={securityStatus?.walletLocked ? "text-error" : "text-success"}
            />
          </div>

          {/* Network Security */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name="Globe" 
                size={20} 
                className={securityStatus?.networkSecure ? "text-success" : "text-error"}
              />
              <div>
                <p className="text-sm font-medium text-card-foreground">Network Security</p>
                <p className="text-xs text-muted-foreground">
                  Connected to {currentNetwork}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowNetworkSwitcher(!showNetworkSwitcher)}
              iconName="Settings"
            />
          </div>

          {/* Permissions */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name="Key" 
                size={20} 
                className={securityStatus?.permissionsGranted ? "text-success" : "text-warning"}
              />
              <div>
                <p className="text-sm font-medium text-card-foreground">Permissions</p>
                <p className="text-xs text-muted-foreground">
                  {securityStatus?.permissionsGranted ? 'All permissions granted' : 'Limited permissions'}
                </p>
              </div>
            </div>
            <Icon 
              name="CheckCircle" 
              size={16} 
              className={securityStatus?.permissionsGranted ? "text-success" : "text-warning"}
            />
          </div>
        </div>

        {/* Network Switcher */}
        {showNetworkSwitcher && (
          <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
            <h4 className="text-sm font-medium text-card-foreground mb-3">Switch Network</h4>
            <div className="space-y-2">
              {['TESTNET', 'MAINNET']?.map((network) => (
                <button
                  key={network}
                  onClick={() => switchNetwork(network)}
                  className={`w-full flex items-center justify-between p-3 rounded-md transition-smooth ${
                    currentNetwork === network
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted-foreground/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={network === 'TESTNET' ? 'TestTube' : 'Globe'} 
                      size={16} 
                    />
                    <span className="text-sm font-medium">{network}</span>
                  </div>
                  {currentNetwork === network && (
                    <Icon name="Check" size={16} />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ⚠️ Switching networks will require reconnecting your wallet
            </p>
          </div>
        )}
      </div>
      {/* Backup Reminder */}
      {securityStatus?.backupReminder && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-card-foreground mb-1">Backup Your Wallet</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Make sure you have securely backed up your wallet's secret phrase. This is the only way to recover your funds if you lose access to your device.
              </p>
              <div className="flex space-x-2">
                <Button variant="warning" size="xs">
                  View Backup Guide
                </Button>
                <Button 
                  variant="ghost" 
                  size="xs" 
                  onClick={dismissBackupReminder}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Security Tips */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Security Best Practices</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-success mt-1" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Keep Your Wallet Secure</p>
              <p className="text-xs text-muted-foreground">Never share your secret phrase or private keys with anyone</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Eye" size={16} className="text-success mt-1" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Verify Transactions</p>
              <p className="text-xs text-muted-foreground">Always review transaction details before signing</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Globe" size={16} className="text-success mt-1" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Use Secure Networks</p>
              <p className="text-xs text-muted-foreground">Avoid public WiFi for wallet transactions</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Download" size={16} className="text-success mt-1" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Regular Backups</p>
              <p className="text-xs text-muted-foreground">Keep multiple secure copies of your wallet backup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicators;