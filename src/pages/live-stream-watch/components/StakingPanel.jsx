import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StakingPanel = ({ stream, timeRemaining, onStake }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(stream?.basePrice);
  const [availableShares, setAvailableShares] = useState(stream?.totalShares - stream?.stakedShares);
  const [projectedReturns, setProjectedReturns] = useState(0);

  useEffect(() => {
    // Calculate dynamic price based on time remaining
    const calculatePrice = () => {
      const minutesRemaining = Math.floor(timeRemaining / 60000);
      const priceMultiplier = Math.max(1, (30 - minutesRemaining) / 30 * 2 + 1);
      const newPrice = stream?.basePrice * priceMultiplier;
      setCurrentPrice(newPrice);
    };

    calculatePrice();
    const interval = setInterval(calculatePrice, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [timeRemaining, stream?.basePrice]);

  useEffect(() => {
    // Calculate projected returns
    if (stakeAmount && !isNaN(parseFloat(stakeAmount))) {
      const amount = parseFloat(stakeAmount);
      const shares = Math.floor(amount / currentPrice);
      const expectedRevenue = stream?.projectedRevenue;
      const creatorShare = stream?.creatorSharePercentage / 100;
      const investorPool = expectedRevenue * (1 - creatorShare);
      const userShare = shares / stream?.totalShares;
      const returns = investorPool * userShare;
      setProjectedReturns(returns);
    } else {
      setProjectedReturns(0);
    }
  }, [stakeAmount, currentPrice, stream]);

  const handleStake = async () => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount))) return;
    
    setIsStaking(true);
    
    try {
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const amount = parseFloat(stakeAmount);
      const shares = Math.floor(amount / currentPrice);
      
      // Dispatch transaction event
      const event = new CustomEvent('transaction-start', {
        detail: {
          transactionId: `stake_${Date.now()}`,
          type: 'stake',
          amount: amount,
          recipient: stream.creator
        }
      });
      window.dispatchEvent(event);
      
      onStake?.(amount, shares);
      setStakeAmount('');
      setAvailableShares(prev => prev - shares);
      
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const getSharesForAmount = (amount) => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    return Math.floor(parseFloat(amount) / currentPrice);
  };

  const quickStakeAmounts = [50, 100, 250, 500];

  const isStakingDisabled = timeRemaining <= 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Stake in Stream</h3>
          <div className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Live Pricing</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Invest now to earn revenue shares when the stream generates income
        </p>
      </div>
      {/* Current Price & Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Share Price</span>
            <Icon name="TrendingUp" size={14} className="text-success" />
          </div>
          <p className="text-lg font-bold text-foreground">{currentPrice?.toFixed(2)} XLM</p>
          <p className="text-xs text-success">
            +{((currentPrice / stream?.basePrice - 1) * 100)?.toFixed(1)}% from base
          </p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <span className="text-sm text-muted-foreground">Available</span>
          <p className="text-lg font-bold text-foreground">{availableShares?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">shares remaining</p>
        </div>
      </div>
      {/* Staking Input */}
      <div className="space-y-4">
        <div>
          <Input
            label="Stake Amount (XLM)"
            type="number"
            placeholder="Enter amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e?.target?.value)}
            disabled={isStakingDisabled}
            description={`You will receive ${getSharesForAmount(stakeAmount)} shares`}
          />
        </div>

        {/* Quick Stake Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {quickStakeAmounts?.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => setStakeAmount(amount?.toString())}
              disabled={isStakingDisabled}
            >
              {amount} XLM
            </Button>
          ))}
        </div>

        {/* Projected Returns */}
        {projectedReturns > 0 && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">Projected Returns</p>
                <p className="text-xs text-muted-foreground">Based on revenue estimates</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-success">+{projectedReturns?.toFixed(2)} XLM</p>
                <p className="text-xs text-success">
                  {((projectedReturns / parseFloat(stakeAmount || 1)) * 100)?.toFixed(1)}% ROI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stake Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleStake}
          loading={isStaking}
          disabled={isStakingDisabled || !stakeAmount || parseFloat(stakeAmount) <= 0}
          iconName="TrendingUp"
          className="w-full"
        >
          {isStakingDisabled ? 'Staking Closed' : 'Stake Now'}
        </Button>

        {isStakingDisabled && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">Staking period has ended</span>
            </div>
          </div>
        )}
      </div>
      {/* Revenue Distribution */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-card-foreground">Revenue Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Creator Share</span>
            <span className="font-medium text-foreground">{stream?.creatorSharePercentage}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Investor Pool</span>
            <span className="font-medium text-foreground">{100 - stream?.creatorSharePercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-l-full"
              style={{ width: `${stream?.creatorSharePercentage}%` }}
            />
          </div>
        </div>
      </div>
      {/* Investment Info */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-card-foreground">Investment Details</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Revenue sharing begins after stream completion</li>
          <li>• Payouts distributed within 24-48 hours</li>
          <li>• All transactions secured on Stellar blockchain</li>
          <li>• Share prices increase as deadline approaches</li>
        </ul>
      </div>
    </div>
  );
};

export default StakingPanel;
