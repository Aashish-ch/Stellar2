import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import WalletStatusIndicator from '../../components/ui/WalletStatusIndicator';
import LiveStreamNotificationBadge from '../../components/ui/LiveStreamNotificationBadge';
import TransactionProgressOverlay from '../../components/ui/TransactionProgressOverlay';
import CreatorModeToggle from '../../components/ui/CreatorModeToggle';
import WalletBalanceCard from './components/WalletBalanceCard';
import TokenSwapInterface from './components/TokenSwapInterface';
import RedemptionSection from './components/RedemptionSection';
import TransactionHistory from './components/TransactionHistory';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import QuickSwapPresets from './components/QuickSwapPresets';

import Button from '../../components/ui/Button';

const TokenShop = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'swap', label: 'Token Swap', icon: 'ArrowRightLeft' },
    { id: 'rewards', label: 'Rewards', icon: 'Gift' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Token Shop - CreatorStake</title>
          <meta name="description" content="Manage your cryptocurrency portfolio through token swaps, redemptions, and transaction monitoring" />
        </Helmet>
        
        <Header />
        <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
        
        <main className={`transition-layout ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-96 bg-muted rounded-lg"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-80 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Token Shop - CreatorStake</title>
        <meta name="description" content="Manage your cryptocurrency portfolio through token swaps, redemptions, and transaction monitoring within the creator economy ecosystem" />
        <meta name="keywords" content="token swap, cryptocurrency, portfolio, rewards, blockchain, stellar" />
      </Helmet>
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      <TransactionProgressOverlay />
      <main className={`transition-layout ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16 pb-20 lg:pb-6`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">Token Shop</h1>
              <p className="text-muted-foreground">
                Manage your cryptocurrency portfolio and redeem exclusive rewards
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <WalletStatusIndicator compact />
              <LiveStreamNotificationBadge />
              <CreatorModeToggle compact />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? "primary" : "ghost"}
                size="sm"
                iconName={tab?.icon}
                onClick={() => setActiveTab(tab?.id)}
                className="mb-2"
              >
                {tab?.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <WalletBalanceCard />
                <PortfolioAnalytics />
              </div>
              
              {/* Sidebar Content */}
              <div className="space-y-6">
                <TokenSwapInterface />
                <QuickSwapPresets />
              </div>
            </div>
          )}

          {activeTab === 'swap' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenSwapInterface />
              <div className="space-y-6">
                <WalletBalanceCard />
                <QuickSwapPresets />
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <RedemptionSection />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <PortfolioAnalytics />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WalletBalanceCard />
                <QuickSwapPresets />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <TransactionHistory />
          )}

          {/* Quick Actions (Mobile) */}
          <div className="lg:hidden fixed bottom-20 right-4 space-y-2">
            <Button
              variant="primary"
              size="icon"
              iconName="ArrowRightLeft"
              className="rounded-full shadow-elevation-3"
              onClick={() => setActiveTab('swap')}
            />
            <Button
              variant="secondary"
              size="icon"
              iconName="Gift"
              className="rounded-full shadow-elevation-3"
              onClick={() => setActiveTab('rewards')}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TokenShop;