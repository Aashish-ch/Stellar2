import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountBalanceOverview = ({ walletConnected }) => {
  const [balances, setBalances] = useState({
    xlm: '0.00',
    tokens: [],
    totalValue: '0.00'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchBalances = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to fetch balances
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBalances = {
        xlm: (Math.random() * 5000 + 1000)?.toFixed(2),
        tokens: [
          {
            code: 'CREATOR1',
            issuer: 'GDXN...K7M2',
            balance: (Math.random() * 1000)?.toFixed(2),
            value: (Math.random() * 500)?.toFixed(2),
            name: 'TechGuru Token'
          },
          {
            code: 'CREATOR2',
            issuer: 'GBXY...L8N3',
            balance: (Math.random() * 2000)?.toFixed(2),
            value: (Math.random() * 800)?.toFixed(2),
            name: 'CryptoQueen Token'
          },
          {
            code: 'CREATOR3',
            issuer: 'GCAB...M9O4',
            balance: (Math.random() * 500)?.toFixed(2),
            value: (Math.random() * 300)?.toFixed(2),
            name: 'GameDev Token'
          }
        ],
        totalValue: '0.00'
      };

      // Calculate total value
      const xlmValue = parseFloat(mockBalances?.xlm);
      const tokensValue = mockBalances?.tokens?.reduce((sum, token) => sum + parseFloat(token?.value), 0);
      mockBalances.totalValue = (xlmValue + tokensValue)?.toFixed(2);

      setBalances(mockBalances);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletConnected) {
      fetchBalances();
      const interval = setInterval(fetchBalances, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [walletConnected]);

  if (!walletConnected) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center space-y-4">
          <Icon name="Wallet" size={48} className="text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Account Balance</h3>
            <p className="text-muted-foreground">Connect your wallet to view balances</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Account Balance</h3>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated?.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={fetchBalances}
            loading={isLoading}
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Total Portfolio Value */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-primary">{balances?.totalValue} XLM</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        {/* XLM Balance */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-card-foreground">Native Balance</h4>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Icon name="Star" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">Stellar Lumens</p>
                  <p className="text-xs text-muted-foreground">XLM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-card-foreground">{balances?.xlm}</p>
                <p className="text-xs text-muted-foreground">≈ ${(parseFloat(balances?.xlm) * 0.12)?.toFixed(2)} USD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Tokens */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-card-foreground">Creator Tokens</h4>
            <Link to="/token-shop">
              <Button variant="ghost" size="xs" iconName="ShoppingCart">
                Shop
              </Button>
            </Link>
          </div>
          
          {balances?.tokens?.length > 0 ? (
            <div className="space-y-2">
              {balances?.tokens?.map((token, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <Icon name="Coins" size={16} className="text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{token?.name}</p>
                        <p className="text-xs text-muted-foreground">{token?.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-card-foreground">{token?.balance}</p>
                      <p className="text-xs text-success">≈ {token?.value} XLM</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg text-center">
              <Icon name="Coins" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No creator tokens yet</p>
              <Link to="/token-shop" className="mt-2 inline-block">
                <Button variant="outline" size="xs">
                  Browse Tokens
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/token-shop">
              <Button variant="outline" size="sm" iconName="ShoppingCart" className="w-full">
                Buy Tokens
              </Button>
            </Link>
            <Button variant="outline" size="sm" iconName="Send" className="w-full">
              Send XLM
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceOverview;