import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate live notifications
    const notificationTypes = [
      {
        type: 'new_stake',
        icon: 'TrendingUp',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20'
      },
      {
        type: 'price_increase',
        icon: 'ArrowUp',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20'
      },
      {
        type: 'new_viewer',
        icon: 'Users',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20'
      },
      {
        type: 'creator_message',
        icon: 'MessageSquare',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/20'
      }
    ];

    const generateNotification = () => {
      const type = notificationTypes?.[Math.floor(Math.random() * notificationTypes?.length)];
      const messages = {
        new_stake: [
          'CryptoTrader_99 staked 500 XLM',
          'BlockchainBabe invested 250 XLM',
          'DeFiMaster added 1,000 XLM stake',
          'NewInvestor_2024 staked 100 XLM'
        ],
        price_increase: [
          'Share price increased to 12.50 XLM',
          'Price surge: +15% in last 5 minutes',
          'Share value now 14.75 XLM',
          'Rapid price increase detected'
        ],
        new_viewer: [
          '50 new viewers joined',
          'Viewer count reached 2,500',
          '100+ viewers in last minute',
          'Audience growing rapidly'
        ],
        creator_message: [
          'Creator: "Thanks for the amazing support!"',
          'Creator: "Big announcement coming up!"',
          'Creator: "Price will increase soon!"',
          'Creator: "Welcome new investors!"'
        ]
      };

      const notification = {
        id: Date.now() + Math.random(),
        type: type?.type,
        message: messages?.[type?.type]?.[Math.floor(Math.random() * messages?.[type?.type]?.length)],
        timestamp: Date.now(),
        ...type
      };

      setNotifications(prev => [notification, ...prev?.slice(0, 4)]); // Keep last 5 notifications
    };

    // Generate initial notifications
    setTimeout(() => generateNotification(), 1000);
    setTimeout(() => generateNotification(), 3000);
    setTimeout(() => generateNotification(), 5000);

    // Continue generating notifications
    const interval = setInterval(generateNotification, 8000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (!isVisible || notifications?.length === 0) {
    return (
      <div className="fixed top-20 right-6 z-200">
        <Button
          variant="outline"
          size="sm"
          iconName="Bell"
          onClick={() => setIsVisible(true)}
          className="bg-card shadow-elevation-2"
        >
          Notifications ({notifications?.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-6 z-200 w-80 space-y-2">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={16} />
            <span className="text-sm font-medium text-card-foreground">Live Updates</span>
          </div>
          <div className="flex items-center space-x-1">
            {notifications?.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                iconName="Trash2"
                onClick={clearAllNotifications}
              />
            )}
            <Button
              variant="ghost"
              size="xs"
              iconName="X"
              onClick={() => setIsVisible(false)}
            />
          </div>
        </div>
      </div>
      {/* Notifications */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications?.map((notification) => (
          <div
            key={notification?.id}
            className={`${notification?.bgColor} ${notification?.borderColor} border rounded-lg p-3 shadow-elevation-1 animate-in slide-in-from-right duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <Icon 
                  name={notification?.icon} 
                  size={16} 
                  className={notification?.color}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground break-words">
                    {notification?.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp)?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="xs"
                iconName="X"
                onClick={() => removeNotification(notification?.id)}
                className="opacity-50 hover:opacity-100"
              />
            </div>

            {/* Special actions for certain notification types */}
            {notification?.type === 'new_stake' && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="xs"
                  iconName="TrendingUp"
                  className="w-full"
                >
                  Stake Now
                </Button>
              </div>
            )}

            {notification?.type === 'price_increase' && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Current Price:</span>
                  <span className="font-semibold text-warning">
                    {(12 + Math.random() * 5)?.toFixed(2)} XLM
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Notification Settings</span>
            <Button variant="ghost" size="xs" iconName="Settings" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="xs"
              iconName="TrendingUp"
              className="text-xs"
            >
              Stakes
            </Button>
            <Button
              variant="outline"
              size="xs"
              iconName="ArrowUp"
              className="text-xs"
            >
              Prices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNotifications;