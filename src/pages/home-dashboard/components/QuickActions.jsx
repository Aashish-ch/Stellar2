import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [walletConnected, setWalletConnected] = useState(
    localStorage.getItem('wallet-connected') === 'true'
  );
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'explore',
      title: 'Explore Videos',
      description: 'Discover trending content and investment opportunities',
      icon: 'Search',
      color: 'bg-primary/20 text-primary',
      action: () => navigate('/video-watch-page'),
      available: true
    },
    {
      id: 'stake',
      title: 'Quick Stake',
      description: 'Invest in your favorite creators instantly',
      icon: 'TrendingUp',
      color: 'bg-success/20 text-success',
      action: () => {
        if (walletConnected) {
          // Find a random trending video to stake on
          navigate('/video-watch-page?quickStake=true');
        } else {
          navigate('/wallet-connection');
        }
      },
      available: walletConnected
    },
    {
      id: 'create',
      title: 'Start Creating',
      description: 'Upload content and earn from your audience',
      icon: 'Video',
      color: 'bg-secondary/20 text-secondary',
      action: () => navigate('/creator-dashboard'),
      available: true
    },
    {
      id: 'portfolio',
      title: 'View Portfolio',
      description: 'Check your investments and earnings',
      icon: 'Wallet',
      color: 'bg-accent/20 text-accent',
      action: () => navigate('/token-shop'),
      available: walletConnected
    },
    {
      id: 'live',
      title: 'Go Live',
      description: 'Start a live stream and engage with fans',
      icon: 'Radio',
      color: 'bg-error/20 text-error',
      action: () => navigate('/creator-dashboard?tab=live'),
      available: true
    },
    {
      id: 'wallet',
      title: walletConnected ? 'Wallet Connected' : 'Connect Wallet',
      description: walletConnected 
        ? 'Manage your XLM and tokens' :'Connect to start investing and earning',
      icon: walletConnected ? 'CheckCircle' : 'Wallet',
      color: walletConnected 
        ? 'bg-success/20 text-success' :'bg-warning/20 text-warning',
      action: () => navigate('/wallet-connection'),
      available: true
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'stake',
      title: 'Staked in "DeFi Protocol Tutorial"',
      creator: 'TechGuru_2024',
      amount: 25.50,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'confirmed'
    },
    {
      id: 2,
      type: 'earning',
      title: 'Revenue share received',
      creator: 'CodeMaster_Pro',
      amount: 8.75,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'confirmed'
    },
    {
      id: 3,
      type: 'unstake',
      title: 'Unstaked from "React Performance"',
      creator: 'DevExpert_JS',
      amount: 15.25,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'pending'
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'stake': return 'TrendingUp';
      case 'unstake': return 'TrendingDown';
      case 'earning': return 'DollarSign';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type, status) => {
    if (status === 'pending') return 'text-warning';
    
    switch (type) {
      case 'stake': return 'text-primary';
      case 'unstake': return 'text-muted-foreground';
      case 'earning': return 'text-success';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Quick Actions */}
      <div className="lg:col-span-2">
        <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={action?.action}
              disabled={!action?.available}
              className={`p-4 bg-card border border-border rounded-xl text-left transition-all duration-300 hover:shadow-elevation-1 hover:-translate-y-0.5 ${
                action?.available 
                  ? 'hover:border-primary/50 cursor-pointer' :'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${action?.color}`}>
                <Icon name={action?.icon} size={24} />
              </div>
              <h4 className="font-semibold text-card-foreground mb-1">{action?.title}</h4>
              <p className="text-sm text-muted-foreground">{action?.description}</p>
              
              {!action?.available && action?.id !== 'wallet' && (
                <div className="flex items-center space-x-1 mt-2">
                  <Icon name="Lock" size={12} className="text-warning" />
                  <span className="text-xs text-warning">Wallet required</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Recent Activity</h3>
          <Link to="/token-shop?tab=history">
            <Button variant="ghost" size="sm" iconName="ExternalLink">
              View All
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {walletConnected ? (
            recentActivity?.map((activity) => (
              <div key={activity?.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity?.status === 'pending' ? 'bg-warning/20' : 'bg-success/20'
                  }`}>
                    <Icon 
                      name={getActivityIcon(activity?.type)} 
                      size={16} 
                      className={getActivityColor(activity?.type, activity?.status)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {activity?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {activity?.creator}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-sm font-semibold ${
                        activity?.type === 'earning' ? 'text-success' : 'text-foreground'
                      }`}>
                        {activity?.type === 'earning' ? '+' : activity?.type === 'unstake' ? '+' : '-'}
                        {activity?.amount} XLM
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity?.timestamp)}
                      </span>
                    </div>
                    
                    {activity?.status === 'pending' && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                        <span className="text-xs text-warning">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="Wallet" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your wallet to see recent activity
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => navigate('/wallet-connection')}
                iconName="Wallet"
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;