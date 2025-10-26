import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [liveStreamCount, setLiveStreamCount] = useState(0);
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Home', 
      path: '/home-dashboard', 
      icon: 'Home',
      badge: liveStreamCount > 0 ? liveStreamCount : null
    },
    { 
      label: 'Watch', 
      path: '/video-watch-page', 
      icon: 'Play',
      children: [
        { label: 'Videos', path: '/video-watch-page', icon: 'Video' },
        { label: 'Live Streams', path: '/live-stream-watch', icon: 'Radio' }
      ]
    },
    { 
      label: 'Portfolio', 
      path: '/token-shop', 
      icon: 'Wallet',
      children: [
        { label: 'Token Shop', path: '/token-shop', icon: 'ShoppingCart' },
        { label: 'Wallet', path: '/wallet-connection', icon: 'CreditCard' }
      ]
    },
  ];

  const creatorItems = [
    { 
      label: 'Creator Studio', 
      path: '/creator-dashboard', 
      icon: 'Video',
      requiresCreator: true
    }
  ];

  useEffect(() => {
    // Simulate wallet connection check
    const checkWalletConnection = () => {
      const connected = localStorage.getItem('wallet-connected') === 'true';
      setWalletConnected(connected);
    };

    // Simulate live stream notifications
    const updateLiveStreams = () => {
      setLiveStreamCount(Math.floor(Math.random() * 5));
    };

    checkWalletConnection();
    updateLiveStreams();

    const interval = setInterval(updateLiveStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const isParentActive = (item) => {
    if (item?.children) {
      return item?.children?.some(child => isActivePath(child?.path));
    }
    return isActivePath(item?.path);
  };

  const toggleCreatorMode = () => {
    setIsCreatorMode(!isCreatorMode);
  };

  const connectWallet = () => {
    setWalletConnected(true);
    localStorage.setItem('wallet-connected', 'true');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    localStorage.removeItem('wallet-connected');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 lg:flex-col bg-card border-r border-border transition-layout ${
        isCollapsed ? 'lg:w-16' : 'lg:w-60'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center h-16 px-4 border-b border-border">
          {!isCollapsed ? (
            <Link to="/home-dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-card-foreground">CreatorStake</span>
            </Link>
          ) : (
            <Link to="/home-dashboard" className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Zap" size={20} color="white" />
              </div>
            </Link>
          )}
        </div>

        {/* Wallet Status */}
        <div className="px-4 py-4 border-b border-border">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">Wallet Status</span>
                <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-success' : 'bg-warning'}`} />
              </div>
              {walletConnected ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-mono">GDXN...K7M2</p>
                  <p className="text-xs text-success">1,250.50 XLM</p>
                  <Button 
                    variant="ghost" 
                    size="xs" 
                    onClick={disconnectWallet}
                    className="w-full justify-start"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={connectWallet}
                  iconName="Wallet"
                  className="w-full"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                walletConnected ? 'bg-success/20' : 'bg-warning/20'
              }`}>
                <Icon 
                  name="Wallet" 
                  size={16} 
                  color={walletConnected ? 'var(--color-success)' : 'var(--color-warning)'} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigationItems?.map((item) => (
            <div key={item?.path}>
              <Link
                to={item?.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-smooth group ${
                  isParentActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 font-medium">{item?.label}</span>
                    {item?.badge && (
                      <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                        {item?.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
              
              {/* Sub-navigation */}
              {!isCollapsed && item?.children && isParentActive(item) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item?.children?.map((child) => (
                    <Link
                      key={child?.path}
                      to={child?.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-smooth ${
                        isActivePath(child?.path)
                          ? 'bg-primary/20 text-primary' :'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name={child?.icon} size={16} />
                      <span className="ml-2">{child?.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Creator Studio (when in creator mode) */}
          {isCreatorMode && creatorItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center px-3 py-2 rounded-lg transition-smooth ${
                isActivePath(item?.path)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={20} />
              {!isCollapsed && <span className="ml-3 font-medium">{item?.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Creator Mode Toggle */}
        <div className="px-4 py-4 border-t border-border">
          {!isCollapsed ? (
            <Button
              variant={isCreatorMode ? "secondary" : "outline"}
              size="sm"
              onClick={toggleCreatorMode}
              iconName={isCreatorMode ? "VideoOff" : "Video"}
              className="w-full"
            >
              {isCreatorMode ? "Exit Creator" : "Creator Mode"}
            </Button>
          ) : (
            <div className="flex justify-center">
              <Button
                variant={isCreatorMode ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleCreatorMode}
                iconName={isCreatorMode ? "VideoOff" : "Video"}
              />
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <div className="px-4 py-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              className={isCollapsed ? "w-full" : "w-full justify-start"}
            >
              {!isCollapsed && "Collapse"}
            </Button>
          </div>
        )}
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-smooth ${
                isParentActive(item)
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon name={item?.icon} size={20} />
                {item?.badge && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium mt-1">{item?.label}</span>
            </Link>
          ))}
          
          {isCreatorMode && (
            <Link
              to="/creator-dashboard"
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-smooth ${
                isActivePath('/creator-dashboard')
                  ? 'text-secondary' :'text-muted-foreground'
              }`}
            >
              <Icon name="Video" size={20} />
              <span className="text-xs font-medium mt-1">Studio</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;