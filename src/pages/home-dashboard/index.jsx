import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import TransactionProgressOverlay from '../../components/ui/TransactionProgressOverlay';
import HeroBanner from './components/HeroBanner';
import SearchAndFilters from './components/SearchAndFilters';
import TrendingVideos from './components/TrendingVideos';
import LiveStreamsSection from './components/LiveStreamsSection';
import QuickActions from './components/QuickActions';

const HomeDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Check for new content notifications
    const checkNotifications = () => {
      const mockNotifications = [
        {
          id: 1,
          type: 'new_video',
          title: 'New video from TechGuru_2024',
          message: 'Advanced Blockchain Development just uploaded',
          timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
          read: false
        },
        {
          id: 2,
          type: 'price_alert',
          title: 'Price Alert',
          message: 'React Performance video price increased to 15.50 XLM',
          timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
          read: false
        }
      ];
      
      setNotifications(mockNotifications);
    };

    checkNotifications();
    
    // Check for notifications every 30 seconds
    const interval = setInterval(checkNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      <Helmet>
        <title>Home Dashboard - CreatorStake</title>
        <meta name="description" content="Discover trending videos, live streams, and investment opportunities on CreatorStake. Stake in your favorite creators and earn revenue shares." />
        <meta name="keywords" content="creator staking, video investment, blockchain, stellar, content monetization" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />

        {/* Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
        />

        {/* Main Content */}
        <main className={`transition-layout ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        } pt-16 pb-20 lg:pb-8`}>
          <div className="container mx-auto px-4 lg:px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Welcome to CreatorStake
                  </h1>
                  <p className="text-muted-foreground">
                    Discover amazing content and invest in your favorite creators
                  </p>
                </div>

                {/* Notifications */}
                {notifications?.length > 0 && (
                  <div className="mt-4 lg:mt-0">
                    <div className="bg-card border border-border rounded-lg p-4 max-w-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-card-foreground">
                          Recent Updates
                        </span>
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {notifications?.filter(n => !n?.read)?.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {notifications?.slice(0, 2)?.map(notification => (
                          <div key={notification?.id} className="text-sm">
                            <p className="font-medium text-card-foreground">
                              {notification?.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {notification?.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Banner */}
            <HeroBanner />

            {/* Search and Filters */}
            <SearchAndFilters />

            {/* Quick Actions */}
            <QuickActions />

            {/* Live Streams Section */}
            <LiveStreamsSection />

            {/* Trending Videos */}
            <TrendingVideos />

            {/* Platform Stats */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  CreatorStake Platform Stats
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of creators and investors building the future of content
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">2.4K+</div>
                  <div className="text-sm text-muted-foreground">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-1">15.8M</div>
                  <div className="text-sm text-muted-foreground">XLM Staked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">89K+</div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">156K+</div>
                  <div className="text-sm text-muted-foreground">Investors</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Transaction Progress Overlay */}
        <TransactionProgressOverlay />
      </div>
    </>
  );
};

export default HomeDashboard;