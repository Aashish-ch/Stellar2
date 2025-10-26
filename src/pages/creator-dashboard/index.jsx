import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import WalletStatusIndicator from '../../components/ui/WalletStatusIndicator';
import LiveStreamNotificationBadge from '../../components/ui/LiveStreamNotificationBadge';
import TransactionProgressOverlay from '../../components/ui/TransactionProgressOverlay';
import CreatorModeToggle from '../../components/ui/CreatorModeToggle';

// Import tab components
import VideoUploadTab from './components/VideoUploadTab';
import InvestorManagementTab from './components/InvestorManagementTab';
import AnalyticsTab from './components/AnalyticsTab';
import LiveStreamTab from './components/LiveStreamTab';
import VideoManagementTab from './components/VideoManagementTab';

const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCreatorVerified, setIsCreatorVerified] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalViews: 0,
    activeStakes: 0,
    subscribers: 0
  });

  useEffect(() => {
    // Check creator verification status
    const verified = localStorage.getItem('creator-verified') === 'true';
    setIsCreatorVerified(verified);

    // Load dashboard stats
    setDashboardStats({
      totalRevenue: 15847.50,
      totalViews: 234560,
      activeStakes: 1456,
      subscribers: 12400
    });

    // Set creator mode if verified
    if (verified) {
      localStorage.setItem('creator-mode', 'true');
    }
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'upload', label: 'Upload Video', icon: 'Upload' },
    { id: 'videos', label: 'My Videos', icon: 'Video' },
    { id: 'live', label: 'Live Stream', icon: 'Radio' },
    { id: 'investors', label: 'Investors', icon: 'Users' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000)?.toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'K';
    }
    return num?.toString();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <VideoUploadTab />;
      case 'videos':
        return <VideoManagementTab />;
      case 'live':
        return <LiveStreamTab />;
      case 'investors':
        return <InvestorManagementTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome to Creator Studio
                  </h2>
                  <p className="text-muted-foreground">
                    Manage your content, track performance, and engage with your investor community.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Icon name="Video" size={64} className="text-primary opacity-50" />
                </div>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardStats?.totalRevenue?.toLocaleString()} XLM</p>
                  </div>
                  <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" size={24} className="text-success" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                  <span className="text-sm text-success">+23.5%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold text-foreground">{formatNumber(dashboardStats?.totalViews)}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Eye" size={24} className="text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                  <span className="text-sm text-success">+18.7%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Stakes</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardStats?.activeStakes}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-warning" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                  <span className="text-sm text-success">+45.2%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                    <p className="text-2xl font-bold text-foreground">{formatNumber(dashboardStats?.subscribers)}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-secondary" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                  <span className="text-sm text-success">+12.3%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Upload" size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Upload Content</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Upload new videos and configure staking parameters for your audience.
                </p>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setActiveTab('upload')}
                  iconName="Plus"
                >
                  Upload Video
                </Button>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
                    <Icon name="Radio" size={20} className="text-error" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Go Live</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Start a live stream and engage with your community in real-time.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => setActiveTab('live')}
                  iconName="Radio"
                >
                  Start Stream
                </Button>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                    <Icon name="BarChart3" size={20} className="text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">View Analytics</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Track your performance and understand your audience engagement.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('analytics')}
                  iconName="TrendingUp"
                >
                  View Analytics
                </Button>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <Button variant="ghost" size="sm" iconName="ExternalLink">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">New stake received</p>
                    <p className="text-sm text-muted-foreground">CryptoInvestor123 staked 500 XLM on "DeFi Tutorial"</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 min ago</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Video" size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Video published</p>
                    <p className="text-sm text-muted-foreground">"Smart Contract Development" is now live</p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" size={16} className="text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Payout processed</p>
                    <p className="text-sm text-muted-foreground">Monthly revenue share distributed: 2,847.50 XLM</p>
                  </div>
                  <span className="text-sm text-muted-foreground">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isCreatorVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
            <div className="p-6 max-w-4xl mx-auto">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Shield" size={48} className="text-warning" />
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Creator Verification Required
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  To access the Creator Dashboard and start monetizing your content, you need to complete the creator verification process.
                </p>
                
                <div className="bg-card border border-border rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Verification Benefits</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-muted-foreground">Monetize your content</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-muted-foreground">Access creator analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-muted-foreground">Enable fan staking</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-muted-foreground">Live streaming tools</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CreatorModeToggle />
                  <Link to="/home-dashboard">
                    <Button variant="outline">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        <TransactionProgressOverlay />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
          <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Creator Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your content and track your creator journey
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <WalletStatusIndicator compact />
                <LiveStreamNotificationBadge />
                <Button variant="primary" iconName="Plus">
                  Create Content
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border mb-6">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="pb-20 lg:pb-6">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
      <TransactionProgressOverlay />
    </div>
  );
};

export default CreatorDashboard;