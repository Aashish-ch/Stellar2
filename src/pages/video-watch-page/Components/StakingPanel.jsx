import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const StakingPanel = ({ video, onStake }) => {
  const [sharePrice, setSharePrice] = useState(video?.currentSharePrice);
  const [stakeAmount, setStakeAmount] = useState('');
  const [sharesCount, setSharesCount] = useState(0);
  const [projectedReturn, setProjectedReturn] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(video?.stakingDeadline - Date.now());
  const [isStaking, setIsStaking] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    // Simulate real-time price updates
    const priceInterval = setInterval(() => {
      const timeLeft = video?.stakingDeadline - Date.now();
      if (timeLeft > 0) {
        // Price increases as deadline approaches
        const timeProgress = 1 - (timeLeft / (24 * 60 * 60 * 1000)); // 24 hours
        const newPrice = video?.baseSharePrice * (1 + timeProgress * 0.5); // Up to 50% increase
        setSharePrice(newPrice);
        
        setPriceHistory(prev => [...prev?.slice(-20), {
          time: Date.now(),
          price: newPrice
        }]);
      }
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      const remaining = video?.stakingDeadline - Date.now();
      setTimeRemaining(Math.max(0, remaining));
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(countdownInterval);
    };
  }, [video]);

  useEffect(() => {
    if (stakeAmount && !isNaN(stakeAmount)) {
      const amount = parseFloat(stakeAmount);
      const shares = amount / sharePrice;
      setSharesCount(shares);
      setProjectedReturn(shares * video?.projectedRevenuePerShare);
    } else {
      setSharesCount(0);
      setProjectedReturn(0);
    }
  }, [stakeAmount, sharePrice, video?.projectedRevenuePerShare]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    setIsStaking(true);
    try {
      await onStake({
        amount: parseFloat(stakeAmount),
        shares: sharesCount,
        pricePerShare: sharePrice
      });
      setStakeAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const isDeadlinePassed = timeRemaining <= 0;
  const isUrgent = timeRemaining < 3600000; // Less than 1 hour

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Stake in Video</h3>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-success" />
          <span className="text-sm text-success">Live Price</span>
        </div>
      </div>
      {/* Current Price */}
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold text-card-foreground">
          {sharePrice?.toFixed(4)} XLM
        </div>
        <div className="text-sm text-muted-foreground">per share</div>
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Clock" size={14} className={isUrgent ? "text-error" : "text-warning"} />
          <span className={`text-sm font-medium ${isUrgent ? "text-error" : "text-warning"}`}>
            {isDeadlinePassed ? "Staking Closed" : formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      {/* Price Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">Price History</span>
          <span className="text-xs text-success">+{((sharePrice / video?.baseSharePrice - 1) * 100)?.toFixed(1)}%</span>
        </div>
        <div className="h-20 bg-muted rounded-lg flex items-end justify-between px-2 py-2">
          {priceHistory?.slice(-10)?.map((point, index) => (
            <div
              key={index}
              className="bg-primary rounded-sm w-2"
              style={{
                height: `${Math.max(10, (point?.price / Math.max(...priceHistory?.map(p => p?.price))) * 100)}%`
              }}
            />
          ))}
        </div>
      </div>
      {/* Staking Form */}
      {!isDeadlinePassed && (
        <div className="space-y-4">
          <Input
            label="Stake Amount (XLM)"
            type="number"
            placeholder="Enter amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e?.target?.value)}
            min="0"
            step="0.01"
          />

          {stakeAmount && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shares to receive:</span>
                <span className="font-medium text-card-foreground">{sharesCount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per share:</span>
                <span className="font-medium text-card-foreground">{sharePrice?.toFixed(4)} XLM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projected return:</span>
                <span className="font-medium text-success">{projectedReturn?.toFixed(2)} XLM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Potential ROI:</span>
                <span className="font-medium text-success">
                  {stakeAmount ? ((projectedReturn / parseFloat(stakeAmount) - 1) * 100)?.toFixed(1) : 0}%
                </span>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleStake}
            loading={isStaking}
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
            iconName="TrendingUp"
            className="w-full"
          >
            Stake Now
          </Button>
        </div>
      )}
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-card-foreground">{video?.totalShares}</div>
          <div className="text-xs text-muted-foreground">Total Shares</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-card-foreground">{video?.investorCount}</div>
          <div className="text-xs text-muted-foreground">Investors</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-success">{video?.totalStaked?.toFixed(0)} XLM</div>
          <div className="text-xs text-muted-foreground">Total Staked</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-warning">{video?.revenueShare}%</div>
          <div className="text-xs text-muted-foreground">Revenue Share</div>
        </div>
      </div>
      {/* Risk Warning */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div className="text-xs text-warning">
            <p className="font-medium">Investment Risk</p>
            <p>Returns are projected based on estimated revenue. Actual returns may vary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPanel;