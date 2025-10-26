import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickSwapPresets = () => {
  const [presets, setPresets] = useState([]);
  const [favoriteTokens, setFavoriteTokens] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);

  useEffect(() => {
    // Simulate fetching user preferences
    const mockPresets = [
      {
        id: 1,
        name: 'XLM to CREATOR',
        fromToken: 'XLM',
        toToken: 'CREATOR',
        amount: 100,
        frequency: 'weekly',
        isActive: true,
        lastExecuted: new Date(Date.now() - 604800000),
        nextExecution: new Date(Date.now() + 86400000)
      },
      {
        id: 2,
        name: 'STAKE Rewards Swap',
        fromToken: 'STAKE',
        toToken: 'USDC',
        amount: 50,
        frequency: 'monthly',
        isActive: true,
        lastExecuted: new Date(Date.now() - 2592000000),
        nextExecution: new Date(Date.now() + 1728000000)
      },
      {
        id: 3,
        name: 'Creator Token DCA',
        fromToken: 'XLM',
        toToken: 'CREATOR',
        amount: 25,
        frequency: 'daily',
        isActive: false,
        lastExecuted: new Date(Date.now() - 172800000),
        nextExecution: null
      }
    ];

    const mockFavorites = [
      { pair: 'XLM/CREATOR', rate: 0.14, change24h: 2.5 },
      { pair: 'CREATOR/STAKE', rate: 0.74, change24h: -1.2 },
      { pair: 'STAKE/USDC', rate: 1.15, change24h: 0.8 }
    ];

    const mockAlerts = [
      {
        id: 1,
        pair: 'XLM/CREATOR',
        condition: 'above',
        targetPrice: 0.15,
        currentPrice: 0.14,
        isActive: true
      },
      {
        id: 2,
        pair: 'STAKE/USDC',
        condition: 'below',
        targetPrice: 1.10,
        currentPrice: 1.15,
        isActive: true
      }
    ];

    setPresets(mockPresets);
    setFavoriteTokens(mockFavorites);
    setPriceAlerts(mockAlerts);
  }, []);

  const executeQuickSwap = (preset) => {
    // Dispatch transaction event
    const event = new CustomEvent('transaction-start', {
      detail: {
        transactionId: `quick_swap_${Date.now()}`,
        type: 'swap',
        amount: `${preset.amount} ${preset.fromToken}`,
        recipient: `${preset.toToken} tokens`
      }
    });
    window.dispatchEvent(event);
  };

  const togglePreset = (presetId) => {
    setPresets(prev => prev?.map(preset => 
      preset?.id === presetId 
        ? { ...preset, isActive: !preset?.isActive }
        : preset
    ));
  };

  const formatDate = (date) => {
    return date ? date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Not scheduled';
  };

  return (
    <div className="space-y-6">
      {/* Quick Swap Presets */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Quick Swap Presets</h3>
            <p className="text-sm text-muted-foreground">Automated and favorite swap configurations</p>
          </div>
          <Button variant="outline" size="sm" iconName="Plus">
            Add Preset
          </Button>
        </div>

        <div className="space-y-3">
          {presets?.map((preset) => (
            <div key={preset?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  preset?.isActive ? 'bg-success' : 'bg-muted-foreground'
                }`} />
                <div>
                  <p className="font-medium text-card-foreground">{preset?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {preset?.amount} {preset?.fromToken} → {preset?.toToken} • {preset?.frequency}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right mr-4">
                  <p className="text-xs text-muted-foreground">Next execution</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {formatDate(preset?.nextExecution)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="xs"
                  iconName={preset?.isActive ? "Pause" : "Play"}
                  onClick={() => togglePreset(preset?.id)}
                />
                
                <Button
                  variant="primary"
                  size="xs"
                  iconName="Zap"
                  onClick={() => executeQuickSwap(preset)}
                >
                  Execute Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Favorite Token Pairs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Favorite Pairs</h3>
            <p className="text-sm text-muted-foreground">Quick access to your most traded pairs</p>
          </div>
          <Button variant="outline" size="sm" iconName="Star">
            Manage
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favoriteTokens?.map((token, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-card-foreground">{token?.pair}</span>
                <Icon name="Star" size={16} className="text-warning" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-card-foreground">
                  {token?.rate?.toFixed(4)}
                </span>
                <span className={`text-sm font-medium ${
                  token?.change24h >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {token?.change24h >= 0 ? '+' : ''}{token?.change24h}%
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRightLeft"
                className="w-full mt-3"
                onClick={() => {
                  // Navigate to swap with pre-filled tokens
                  const [from, to] = token?.pair?.split('/');
                  console.log(`Quick swap: ${from} to ${to}`);
                }}
              >
                Quick Swap
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Price Alerts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Price Alerts</h3>
            <p className="text-sm text-muted-foreground">Get notified when prices hit your targets</p>
          </div>
          <Button variant="outline" size="sm" iconName="Bell">
            Add Alert
          </Button>
        </div>

        <div className="space-y-3">
          {priceAlerts?.map((alert) => (
            <div key={alert?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  alert?.isActive ? 'bg-warning animate-pulse-gentle' : 'bg-muted-foreground'
                }`} />
                <div>
                  <p className="font-medium text-card-foreground">{alert?.pair}</p>
                  <p className="text-sm text-muted-foreground">
                    Alert when {alert?.condition} {alert?.targetPrice?.toFixed(4)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="font-medium text-card-foreground">
                    {alert?.currentPrice?.toFixed(4)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Edit"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Trash2"
                    className="text-error hover:text-error"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickSwapPresets;