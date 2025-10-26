import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletBalanceCard = () => {
  const [balances, setBalances] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [priceChange24h, setPriceChange24h] = useState(0);

  useEffect(() => {
    // Simulate fetching wallet balances
    const fetchBalances = () => {
      const mockBalances = [
        {
          symbol: 'XLM',
          name: 'Stellar Lumens',
          balance: 1250.50,
          usdValue: 0.12,
          change24h: 2.5,
          icon: 'Star'
        },
        {
          symbol: 'CREATOR',
          name: 'Creator Token',
          balance: 850.25,
          usdValue: 0.85,
          change24h: -1.2,
          icon: 'Video'
        },
        {
          symbol: 'STAKE',
          name: 'Stake Rewards',
          balance: 425.75,
          usdValue: 1.15,
          change24h: 5.8,
          icon: 'TrendingUp'
        }
      ];

      setBalances(mockBalances);
      
      const total = mockBalances?.reduce((sum, token) => 
        sum + (token?.balance * token?.usdValue), 0
      );
      setTotalValue(total);
      setPriceChange24h(3.2);
      setIsLoading(false);
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Portfolio Balance</h2>
          <p className="text-sm text-muted-foreground">Real-time token balances</p>
        </div>
        <Button variant="outline" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-card-foreground">
            ${totalValue?.toFixed(2)}
          </span>
          <span className={`text-sm font-medium ${
            priceChange24h >= 0 ? 'text-success' : 'text-error'
          }`}>
            {priceChange24h >= 0 ? '+' : ''}{priceChange24h}%
          </span>
        </div>
        <p className="text-sm text-muted-foreground">24h change</p>
      </div>
      <div className="space-y-4">
        {balances?.map((token) => (
          <div key={token?.symbol} className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Icon name={token?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">{token?.symbol}</p>
                <p className="text-sm text-muted-foreground">{token?.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-card-foreground">
                {token?.balance?.toFixed(2)} {token?.symbol}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  ${(token?.balance * token?.usdValue)?.toFixed(2)}
                </p>
                <span className={`text-xs ${
                  token?.change24h >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {token?.change24h >= 0 ? '+' : ''}{token?.change24h}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" iconName="ArrowUpDown" className="w-full">
            Quick Swap
          </Button>
          <Button variant="outline" iconName="Plus" className="w-full">
            Add Funds
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;