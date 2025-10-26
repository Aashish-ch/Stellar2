import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveStreamsSection = () => {
  const [timeRemaining, setTimeRemaining] = useState({});

  const liveStreams = [
  {
    id: 'live_1',
    title: "Live Coding: Building a DeFi Protocol from Scratch",
    creator: "DevMaster_Live",
    creatorAvatar: "https://images.unsplash.com/photo-1573879029680-ef2d3b800dbd",
    creatorAvatarAlt: "Professional developer with brown hair wearing navy shirt in modern office setting",
    thumbnail: "https://images.unsplash.com/photo-1621926442743-11916d40c022",
    thumbnailAlt: "Live coding session with multiple monitors showing DeFi smart contract development",
    currentPrice: 8.50,
    totalStaked: 3420.75,
    stakingDeadline: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
    viewerCount: 1247,
    isLive: true,
    category: "Development",
    startTime: new Date(Date.now() - 30 * 60 * 1000) // Started 30 minutes ago
  },
  {
    id: 'live_2',
    title: "Crypto Market Analysis & Trading Strategies",
    creator: "TradingPro_Live",
    creatorAvatar: "https://images.unsplash.com/photo-1598979181437-56e72c30ed4d",
    creatorAvatarAlt: "Professional female trader with blonde hair in business attire at trading desk",
    thumbnail: "https://images.unsplash.com/photo-1621264448270-9ef00e88a935",
    thumbnailAlt: "Live trading session with cryptocurrency charts and market analysis on multiple screens",
    currentPrice: 12.25,
    totalStaked: 8750.50,
    stakingDeadline: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes
    viewerCount: 2156,
    isLive: true,
    category: "Trading",
    startTime: new Date(Date.now() - 15 * 60 * 1000) // Started 15 minutes ago
  },
  {
    id: 'live_3',
    title: "Game Development Workshop: Unity 3D Basics",
    creator: "GameDev_Academy",
    creatorAvatar: "https://images.unsplash.com/photo-1661394206142-5e6fe28a23bd",
    creatorAvatarAlt: "Young game developer with short dark hair wearing casual black t-shirt",
    thumbnail: "https://images.unsplash.com/photo-1724166551426-77aa7328d053",
    thumbnailAlt: "Live game development session showing Unity 3D interface with 3D models and code editor",
    currentPrice: 15.00,
    totalStaked: 6890.25,
    stakingDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    viewerCount: 892,
    isLive: false,
    category: "Gaming",
    startTime: new Date(Date.now() + 10 * 60 * 1000) // Starts in 10 minutes
  },
  {
    id: 'live_4',
    title: "AI & Machine Learning: Real-time Model Training",
    creator: "AI_Researcher_Live",
    creatorAvatar: "https://images.unsplash.com/photo-1713946598186-8e28275719b9",
    creatorAvatarAlt: "AI researcher with beard and glasses wearing professional dark suit jacket",
    thumbnail: "https://images.unsplash.com/photo-1733222765056-b0790217baa9",
    thumbnailAlt: "Live AI research session with neural network visualizations and machine learning code",
    currentPrice: 20.75,
    totalStaked: 12450.00,
    stakingDeadline: new Date(Date.now() + 90 * 60 * 1000), // 1.5 hours
    viewerCount: 1834,
    isLive: true,
    category: "AI/ML",
    startTime: new Date(Date.now() - 45 * 60 * 1000) // Started 45 minutes ago
  }];


  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      liveStreams?.forEach((stream) => {
        const remaining = stream?.stakingDeadline - Date.now();
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor(remaining % (1000 * 60 * 60) / (1000 * 60));
          const seconds = Math.floor(remaining % (1000 * 60) / 1000);
          newTimeRemaining[stream.id] = { hours, minutes, seconds };
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    // Initial calculation
    const initialTimeRemaining = {};
    liveStreams?.forEach((stream) => {
      const remaining = stream?.stakingDeadline - Date.now();
      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor(remaining % (1000 * 60 * 60) / (1000 * 60));
        const seconds = Math.floor(remaining % (1000 * 60) / 1000);
        initialTimeRemaining[stream.id] = { hours, minutes, seconds };
      }
    });
    setTimeRemaining(initialTimeRemaining);

    return () => clearInterval(timer);
  }, []);

  const handleQuickStake = (stream, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const event = new CustomEvent('transaction-start', {
      detail: {
        transactionId: `stake_live_${stream.id}_${Date.now()}`,
        type: 'stake',
        amount: stream.currentPrice,
        recipient: stream.creator
      }
    });
    window.dispatchEvent(event);
  };

  const getUrgencyLevel = (deadline) => {
    const remaining = deadline - Date.now();
    if (remaining < 30 * 60 * 1000) return 'critical'; // Less than 30 minutes
    if (remaining < 60 * 60 * 1000) return 'urgent'; // Less than 1 hour
    return 'normal';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':return 'text-error';
      case 'urgent':return 'text-warning';
      default:return 'text-success';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">Live Streams</h2>
          </div>
          <span className="bg-error/20 text-error px-2 py-1 rounded-full text-sm font-medium">
            {liveStreams?.filter((s) => s?.isLive)?.length} Live
          </span>
        </div>

        <Link to="/live-stream-watch">
          <Button variant="outline" iconName="Radio">
            View All Streams
          </Button>
        </Link>
      </div>
      {/* Live Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStreams?.map((stream) => {
          const time = timeRemaining?.[stream?.id];
          const urgency = getUrgencyLevel(stream?.stakingDeadline);

          return (
            <Link
              key={stream?.id}
              to={`/live-stream-watch?id=${stream?.id}`}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-1">

              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={stream?.thumbnail}
                  alt={stream?.thumbnailAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                
                {/* Live Indicator */}
                {stream?.isLive ?
                <div className="absolute top-2 left-2 bg-error text-error-foreground text-xs px-2 py-1 rounded flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>LIVE</span>
                  </div> :

                <div className="absolute top-2 left-2 bg-warning text-warning-foreground text-xs px-2 py-1 rounded">
                    Starting Soon
                  </div>
                }

                {/* Viewer Count */}
                <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <Icon name="Users" size={10} />
                  <span>{stream?.viewerCount?.toLocaleString()}</span>
                </div>

                {/* Category */}
                <div className="absolute bottom-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
                  {stream?.category}
                </div>
              </div>
              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
                  {stream?.title}
                </h3>

                {/* Creator Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <Image
                    src={stream?.creatorAvatar}
                    alt={stream?.creatorAvatarAlt}
                    className="w-8 h-8 rounded-full object-cover" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{stream?.creator}</p>
                    <p className="text-xs text-muted-foreground">
                      {stream?.isLive ? 'Live now' : 'Starting soon'}
                    </p>
                  </div>
                </div>

                {/* Staking Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Stake Price</p>
                      <p className="font-bold text-success">{stream?.currentPrice} XLM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Staking Ends</p>
                      {time &&
                      <p className={`text-xs font-semibold ${getUrgencyColor(urgency)}`}>
                          {time?.hours > 0 ? `${time?.hours}h ` : ''}{time?.minutes}m {time?.seconds}s
                        </p>
                      }
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Staked</p>
                      <p className="text-sm font-semibold text-foreground">
                        {stream?.totalStaked?.toLocaleString()} XLM
                      </p>
                    </div>
                    {urgency === 'critical' &&
                    <div className="flex items-center space-x-1">
                        <Icon name="AlertTriangle" size={12} className="text-error" />
                        <span className="text-xs text-error font-medium">Urgent!</span>
                      </div>
                    }
                  </div>

                  {/* Action Button */}
                  {stream?.isLive ?
                  <Button
                    variant="primary"
                    size="sm"
                    iconName="Play"
                    className="w-full">

                      Join Live Stream
                    </Button> :

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleQuickStake(stream, e)}
                    iconName="Clock"
                    className="w-full">

                      Stake Before Start
                    </Button>
                  }
                </div>
              </div>
            </Link>);

        })}
      </div>
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Radio" size={16} className="text-error" />
            <span className="text-2xl font-bold text-foreground">
              {liveStreams?.filter((s) => s?.isLive)?.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Live Now</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-2xl font-bold text-foreground">
              {liveStreams?.reduce((sum, s) => sum + s?.viewerCount, 0)?.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Total Viewers</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-2xl font-bold text-foreground">
              {liveStreams?.reduce((sum, s) => sum + s?.totalStaked, 0)?.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">XLM Staked</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-2xl font-bold text-foreground">
              {liveStreams?.filter((s) => !s?.isLive)?.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Starting Soon</p>
        </div>
      </div>
    </div>);

};

export default LiveStreamsSection;