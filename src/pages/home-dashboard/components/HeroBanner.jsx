import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({});

  const featuredVideos = [
  {
    id: 1,
    title: "Building the Future of DeFi: Smart Contract Architecture Deep Dive",
    creator: "TechGuru_2024",
    creatorAvatar: "https://images.unsplash.com/photo-1723189520204-0716614de54a",
    creatorAvatarAlt: "Professional headshot of young man with brown hair wearing navy blue shirt",
    thumbnail: "https://images.unsplash.com/photo-1651990892631-723da6447d7d",
    thumbnailAlt: "Modern computer setup with multiple monitors displaying code and blockchain data visualizations",
    currentPrice: 12.50,
    totalStaked: 8450.75,
    stakingDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    viewCount: 15420,
    duration: "45:32",
    category: "Technology"
  },
  {
    id: 2,
    title: "Mastering React Performance: Advanced Optimization Techniques",
    creator: "CodeMaster_Pro",
    creatorAvatar: "https://images.unsplash.com/photo-1706565029882-6f25f1d9af65",
    creatorAvatarAlt: "Professional woman with long dark hair smiling at camera wearing white blazer",
    thumbnail: "https://images.unsplash.com/photo-1542546068979-b6affb46ea8f",
    thumbnailAlt: "Clean workspace with laptop displaying React code editor and performance monitoring tools",
    currentPrice: 8.75,
    totalStaked: 5230.25,
    stakingDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    viewCount: 9876,
    duration: "38:15",
    category: "Programming"
  },
  {
    id: 3,
    title: "Cryptocurrency Market Analysis: Q4 2024 Predictions & Strategies",
    creator: "CryptoQueen",
    creatorAvatar: "https://images.unsplash.com/photo-1636393913936-187da0a372e3",
    creatorAvatarAlt: "Confident businesswoman with blonde hair in professional attire against modern office background",
    thumbnail: "https://images.unsplash.com/photo-1674104151229-e70d2a0724b0",
    thumbnailAlt: "Financial trading desk with multiple screens showing cryptocurrency charts and market data",
    currentPrice: 15.25,
    totalStaked: 12750.50,
    stakingDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    viewCount: 23456,
    duration: "52:18",
    category: "Finance"
  }];


  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      featuredVideos?.forEach((video) => {
        const remaining = video?.stakingDeadline - Date.now();
        if (remaining > 0) {
          const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor(remaining % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          const minutes = Math.floor(remaining % (1000 * 60 * 60) / (1000 * 60));
          newTimeRemaining[video.id] = { days, hours, minutes };
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 60000);

    // Initial calculation
    const initialTimeRemaining = {};
    featuredVideos?.forEach((video) => {
      const remaining = video?.stakingDeadline - Date.now();
      if (remaining > 0) {
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(remaining % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor(remaining % (1000 * 60 * 60) / (1000 * 60));
        initialTimeRemaining[video.id] = { days, hours, minutes };
      }
    });
    setTimeRemaining(initialTimeRemaining);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredVideos?.length);
    }, 8000);

    return () => clearInterval(slideTimer);
  }, [featuredVideos?.length]);

  const currentVideo = featuredVideos?.[currentSlide];
  const time = timeRemaining?.[currentVideo?.id];

  const handleQuickStake = (videoId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    // Dispatch transaction event
    const event = new CustomEvent('transaction-start', {
      detail: {
        transactionId: `stake_${videoId}_${Date.now()}`,
        type: 'stake',
        amount: currentVideo.currentPrice,
        recipient: currentVideo.creator
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl overflow-hidden mb-8">
      <div className="relative h-96 lg:h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={currentVideo?.thumbnail}
            alt={currentVideo?.thumbnailAlt}
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              {/* Category Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                <Icon name="Star" size={14} className="mr-1" />
                Featured • {currentVideo?.category}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {currentVideo?.title}
              </h1>

              {/* Creator Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={currentVideo?.creatorAvatar}
                    alt={currentVideo?.creatorAvatarAlt}
                    className="w-12 h-12 rounded-full object-cover" />

                  <div>
                    <p className="font-semibold text-foreground">{currentVideo?.creator}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Icon name="Eye" size={14} className="mr-1" />
                        {currentVideo?.viewCount?.toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        <Icon name="Clock" size={14} className="mr-1" />
                        {currentVideo?.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staking Info */}
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-xl font-bold text-success">{currentVideo?.currentPrice} XLM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Staked</p>
                    <p className="text-lg font-semibold text-foreground">{currentVideo?.totalStaked?.toLocaleString()} XLM</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Staking Ends In</p>
                    {time &&
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-warning">
                          {time?.days}d {time?.hours}h {time?.minutes}m
                        </span>
                        <Icon name="Clock" size={16} className="text-warning" />
                      </div>
                    }
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/video-watch-page?id=${currentVideo?.id}`} className="flex-1">
                    <Button variant="primary" className="w-full" iconName="Play">
                      Watch & Stake
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={(e) => handleQuickStake(currentVideo?.id, e)}
                    iconName="TrendingUp"
                    className="sm:w-auto">

                    Quick Stake {currentVideo?.currentPrice} XLM
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-6 flex space-x-2">
          {featuredVideos?.map((_, index) =>
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentSlide ? 'bg-primary' : 'bg-white/30'}`
            } />

          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredVideos?.length) % featuredVideos?.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background border border-border rounded-full flex items-center justify-center transition-smooth">

          <Icon name="ChevronLeft" size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredVideos?.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background border border-border rounded-full flex items-center justify-center transition-smooth">

          <Icon name="ChevronRight" size={20} />
        </button>
      </div>
    </div>);

};

export default HeroBanner;