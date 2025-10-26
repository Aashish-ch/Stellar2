import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LiveVideoPlayer from './components/LiveVideoPlayer';
import CountdownTimer from './components/CountdownTimer';
import LiveChat from './components/LiveChat';
import StakingPanel from './components/StakingPanel';
import StreamInfo from './components/StreamInfo';
import LiveNotifications from './components/LiveNotifications';
import MobileStakingControls from './components/MobileStakingControls';

const LiveStreamWatch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const streamId = searchParams?.get('stream') || '1';

  const [stream, setStream] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isMobileStakingVisible, setIsMobileStakingVisible] = useState(false);
  const [userStakes, setUserStakes] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mock stream data
  const mockStream = {
    id: streamId,
    title: "Building DeFi Applications: Live Coding Session with Smart Contract Integration",
    creator: "TechGuru_2024",
    creatorId: "techguru2024",
    creatorAvatar: "https://images.unsplash.com/photo-1723189520204-0716614de54a",
    creatorAvatarAlt: "Professional headshot of young man with short brown hair wearing navy blue shirt",
    isVerified: true,
    subscribers: 45200,
    creatorJoinDate: "March 2023",
    totalVideos: 127,
    totalRevenue: 89500,
    category: "Technology",
    description: `Join me for an intensive live coding session where we'll build a complete DeFi application from scratch. We'll cover smart contract development, frontend integration, and real-world deployment strategies.\n\nWhat we'll build:\n• Liquidity pool smart contracts\n• Token swapping mechanisms\n• Yield farming protocols\n• Frontend dashboard with Web3 integration\n\nThis stream is perfect for developers looking to understand DeFi architecture and implementation. We'll be using Solidity, React, and various DeFi protocols.\n\nBring your questions and let's build the future of finance together!`,
    tags: ["DeFi", "Blockchain", "Solidity", "React", "Web3", "SmartContracts"],
    scheduledTime: Date.now() + 900000, // 15 minutes from now
    expectedViewers: 2500,
    viewerCount: 1847,
    likes: 892,
    basePrice: 8.50,
    totalShares: 10000,
    stakedShares: 6750,
    totalStaked: 57375.50,
    creatorSharePercentage: 70,
    projectedRevenue: 125000,
    isFollowing: false
  };

  useEffect(() => {
    setStream(mockStream);
    setTimeRemaining(mockStream?.scheduledTime - Date.now());

    // Update time remaining every second
    const interval = setInterval(() => {
      const remaining = Math.max(0, mockStream?.scheduledTime - Date.now());
      setTimeRemaining(remaining);

      // Stream goes live when countdown reaches zero
      if (remaining === 0 && !isLive) {
        setIsLive(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [streamId, isLive]);

  const handleStake = (amount, shares) => {
    const newStake = {
      id: Date.now(),
      amount,
      shares,
      price: amount / shares,
      timestamp: Date.now()
    };

    setUserStakes((prev) => [...prev, newStake]);

    // Update stream data
    setStream((prev) => ({
      ...prev,
      stakedShares: prev?.stakedShares + shares,
      totalStaked: prev?.totalStaked + amount
    }));
  };

  const handleFollow = (following) => {
    setStream((prev) => ({ ...prev, isFollowing: following }));
  };

  const handleShare = (platform) => {
    const url = window.location?.href;
    const text = `Check out this live stream: ${stream?.title}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard?.writeText(url);
        break;
    }
  };

  const handleNotify = (enabled) => {
    // Handle notification preferences
    console.log('Notifications', enabled ? 'enabled' : 'disabled');
  };

  const handleQualityChange = (quality) => {
    console.log('Quality changed to:', quality);
  };

  const handleCountdownExpire = () => {
    setIsLive(true);
  };

  if (!stream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Icon name="Radio" size={32} className="text-primary" />
          </div>
          <p className="text-lg font-medium text-foreground">Loading stream...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowLeft"
            onClick={() => navigate('/home-dashboard')}>

            Back
          </Button>
          <div className="flex items-center space-x-2">
            {isLive &&
            <div className="flex items-center space-x-1 bg-error px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-medium">LIVE</span>
              </div>
            }
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Users" size={14} />
              <span className="text-sm">{stream?.viewerCount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <LiveVideoPlayer
              stream={stream}
              isLive={isLive}
              onQualityChange={handleQualityChange} />


            {/* Stream Info - Desktop */}
            <div className="hidden lg:block">
              <StreamInfo
                stream={stream}
                onFollow={handleFollow}
                onShare={handleShare}
                onNotify={handleNotify} />

            </div>

            {/* Mobile Chat Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                iconName="MessageCircle"
                onClick={() => setIsChatCollapsed(!isChatCollapsed)}
                className="w-full">

                {isChatCollapsed ? 'Show Chat' : 'Hide Chat'} ({stream?.viewerCount} viewers)
              </Button>
            </div>

            {/* Mobile Chat */}
            <div className="lg:hidden">
              <LiveChat
                streamId={stream?.id}
                isCollapsed={isChatCollapsed}
                onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)} />

            </div>

            {/* Stream Info - Mobile */}
            <div className="lg:hidden">
              <StreamInfo
                stream={stream}
                onFollow={handleFollow}
                onShare={handleShare}
                onNotify={handleNotify} />

            </div>
          </div>

          {/* Right Column - Countdown, Staking & Chat */}
          <div className="space-y-6">
            {/* Countdown Timer */}
            <CountdownTimer
              targetTime={stream?.scheduledTime}
              onExpire={handleCountdownExpire}
              isUrgent={timeRemaining < 600000} />


            {/* Staking Panel - Desktop */}
            <div className="hidden lg:block">
              <StakingPanel
                stream={stream}
                timeRemaining={timeRemaining}
                onStake={handleStake} />

            </div>

            {/* Desktop Chat */}
            <div className="hidden lg:block">
              <LiveChat
                streamId={stream?.id}
                isCollapsed={false}
                onToggleCollapse={() => {}} />

            </div>

            {/* User Stakes Summary */}
            {userStakes?.length > 0 &&
            <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium text-card-foreground mb-3">Your Stakes</h4>
                <div className="space-y-2">
                  {userStakes?.map((stake) =>
                <div key={stake?.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {stake?.shares} shares
                      </span>
                      <span className="font-medium text-success">
                        {stake?.amount} XLM
                      </span>
                    </div>
                )}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-card-foreground">Total</span>
                      <span className="text-success">
                        {userStakes?.reduce((sum, stake) => sum + stake?.amount, 0)} XLM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      {/* Live Notifications */}
      <LiveNotifications />
      {/* Mobile Staking Controls */}
      <MobileStakingControls
        stream={stream}
        timeRemaining={timeRemaining}
        onStake={handleStake}
        isVisible={isMobileStakingVisible}
        onToggle={() => setIsMobileStakingVisible(!isMobileStakingVisible)} />

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-20" />
    </div>);

};

export default LiveStreamWatch;