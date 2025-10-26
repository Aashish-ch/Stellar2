import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MobileStakingControls = ({ stream, timeRemaining, onStake, isVisible, onToggle }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(stream?.basePrice * 1.5);

  const handleQuickStake = async (amount) => {
    setIsStaking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const shares = Math.floor(amount / currentPrice);
      
      // Dispatch transaction event
      const event = new CustomEvent('transaction-start', {
        detail: {
          transactionId: `mobile_stake_${Date.now()}`,
          type: 'stake',
          amount: amount,
          recipient: stream.creator
        }
      });
      window.dispatchEvent(event);
      
      onStake?.(amount, shares);
      
    } catch (error) {
      console.error('Mobile staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleCustomStake = async () => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount))) return;
    
    const amount = parseFloat(stakeAmount);
    await handleQuickStake(amount);
    setStakeAmount('');
  };

  const isStakingDisabled = timeRemaining <= 0;

  if (!isVisible) {
    return (
      <div className="lg:hidden fixed bottom-20 right-4 z-300">
        <Button
          variant="primary"
          size="lg"
          iconName="TrendingUp"
          onClick={onToggle}
          className="rounded-full w-14 h-14 shadow-elevation-3"
          disabled={isStakingDisabled}
        />
      </div>
    );
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-300 bg-card border-t border-border">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <div>
              <p className="font-semibold text-card-foreground">Quick Stake</p>
              <p className="text-xs text-muted-foreground">
                {currentPrice?.toFixed(2)} XLM per share
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onToggle}
          />
        </div>

        {/* Time Warning */}
        {timeRemaining > 0 && timeRemaining < 300000 && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="Clock" size={16} />
              <span className="text-sm font-medium">
                Only {Math.floor(timeRemaining / 60000)} minutes left!
              </span>
            </div>
          </div>
        )}

        {/* Quick Stake Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {[50, 100, 250]?.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleQuickStake(amount)}
              loading={isStaking}
              disabled={isStakingDisabled}
              className="flex flex-col items-center py-3 h-auto"
            >
              <span className="text-lg font-bold">{amount}</span>
              <span className="text-xs text-muted-foreground">XLM</span>
              <span className="text-xs text-success">
                {Math.floor(amount / currentPrice)} shares
              </span>
            </Button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Custom amount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e?.target?.value)}
              disabled={isStakingDisabled}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleCustomStake}
              loading={isStaking}
              disabled={isStakingDisabled || !stakeAmount}
              iconName="Send"
            >
              Stake
            </Button>
          </div>

          {stakeAmount && !isNaN(parseFloat(stakeAmount)) && (
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You'll receive:</span>
                <span className="font-medium text-foreground">
                  {Math.floor(parseFloat(stakeAmount) / currentPrice)} shares
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-sm font-semibold text-foreground">
              {(stream?.totalShares - stream?.stakedShares)?.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Staked</p>
            <p className="text-sm font-semibold text-success">
              {stream?.totalStaked?.toFixed(0)} XLM
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Revenue Share</p>
            <p className="text-sm font-semibold text-warning">
              {100 - stream?.creatorSharePercentage}%
            </p>
          </div>
        </div>

        {isStakingDisabled && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 text-error">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">Staking period has ended</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileStakingControls;