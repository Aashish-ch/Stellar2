import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CountdownTimer = ({ targetTime, onExpire, isUrgent = false }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, targetTime - now);
      
      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
      
      setTimeRemaining(remaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire, isExpired]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${seconds?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes?.toString()?.padStart(2, '0')}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const getUrgencyLevel = () => {
    const minutes = Math.floor(timeRemaining / 60000);
    if (minutes <= 2) return 'critical';
    if (minutes <= 5) return 'urgent';
    if (minutes <= 15) return 'warning';
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  const getTimerStyles = () => {
    switch (urgencyLevel) {
      case 'critical':
        return 'bg-error text-error-foreground animate-pulse';
      case 'urgent':
        return 'bg-warning text-warning-foreground';
      case 'warning':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getProgressPercentage = () => {
    const totalDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    const elapsed = totalDuration - timeRemaining;
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  if (isExpired) {
    return (
      <div className="bg-muted border border-border rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Clock" size={20} />
          <span className="font-medium">Staking Period Ended</span>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          New investments are no longer available for this stream
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Timer Display */}
      <div className={`${getTimerStyles()} rounded-lg p-4 text-center transition-all duration-300`}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Clock" size={20} />
          <span className="text-sm font-medium">
            {urgencyLevel === 'critical' ? 'LAST CHANCE' : 'Staking Ends In'}
          </span>
        </div>
        <div className="text-3xl font-bold font-mono">
          {formatTime(timeRemaining)}
        </div>
        <p className="text-sm opacity-90 mt-1">
          Stream starts when timer reaches zero
        </p>
      </div>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Staking Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              urgencyLevel === 'critical' ? 'bg-error' :
              urgencyLevel === 'urgent' ? 'bg-warning' :
              urgencyLevel === 'warning' ? 'bg-accent' : 'bg-primary'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>
      {/* Urgency Messages */}
      {urgencyLevel === 'critical' && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-error">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm font-medium">Final minutes to stake!</span>
          </div>
        </div>
      )}
      {urgencyLevel === 'urgent' && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-warning">
            <Icon name="Zap" size={16} />
            <span className="text-sm font-medium">Hurry! Prices increasing rapidly</span>
          </div>
        </div>
      )}
      {/* Stream Start Info */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stream starts at:</span>
          <span className="font-medium text-foreground">
            {new Date(targetTime)?.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;