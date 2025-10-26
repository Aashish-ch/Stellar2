import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RelatedVideos = ({ currentVideoId }) => {
  const relatedVideos = [
  {
    id: 2,
    title: "Advanced Smart Contract Security Patterns",
    creator: "BlockchainDev Pro",
    thumbnail: "https://images.unsplash.com/photo-1649443992089-8bf1fc3c42f4",
    thumbnailAlt: "Computer screen showing code with blockchain development interface and security patterns",
    duration: "18:45",
    views: 45200,
    uploadDate: new Date(Date.now() - 86400000 * 2),
    currentSharePrice: 0.0875,
    stakingDeadline: Date.now() + 86400000 * 15,
    totalStaked: 3250.75,
    investorCount: 89,
    revenueShare: 65
  },
  {
    id: 3,
    title: "NFT Marketplace Development Tutorial",
    creator: "CryptoBuilder",
    thumbnail: "https://images.unsplash.com/photo-1617331099789-743fe4394b2f",
    thumbnailAlt: "Digital art gallery interface showing NFT marketplace with colorful digital artwork displays",
    duration: "32:12",
    views: 78900,
    uploadDate: new Date(Date.now() - 86400000 * 5),
    currentSharePrice: 0.1250,
    stakingDeadline: Date.now() + 86400000 * 12,
    totalStaked: 5680.25,
    investorCount: 156,
    revenueShare: 70
  },
  {
    id: 4,
    title: "Yield Farming Strategies Explained",
    creator: "DeFi Master",
    thumbnail: "https://images.unsplash.com/photo-1724833256463-26b199dc1b69",
    thumbnailAlt: "Financial dashboard showing DeFi yield farming statistics with green growth charts and cryptocurrency symbols",
    duration: "25:30",
    views: 62100,
    uploadDate: new Date(Date.now() - 86400000 * 3),
    currentSharePrice: 0.0950,
    stakingDeadline: Date.now() + 86400000 * 18,
    totalStaked: 4125.50,
    investorCount: 112,
    revenueShare: 60
  },
  {
    id: 5,
    title: "Cross-Chain Bridge Implementation",
    creator: "Web3 Architect",
    thumbnail: "https://images.unsplash.com/photo-1631864032976-cef7f00fea43",
    thumbnailAlt: "Network diagram showing interconnected blockchain nodes with bridge connections and data flow visualization",
    duration: "41:18",
    views: 34800,
    uploadDate: new Date(Date.now() - 86400000 * 1),
    currentSharePrice: 0.1150,
    stakingDeadline: Date.now() + 86400000 * 22,
    totalStaked: 2890.75,
    investorCount: 67,
    revenueShare: 75
  },
  {
    id: 6,
    title: "Layer 2 Scaling Solutions Deep Dive",
    creator: "Ethereum Expert",
    thumbnail: "https://images.unsplash.com/photo-1572982408141-5444f29ca3ca",
    thumbnailAlt: "Technical diagram showing Ethereum Layer 2 scaling architecture with transaction flow and network layers",
    duration: "28:55",
    views: 91200,
    uploadDate: new Date(Date.now() - 86400000 * 4),
    currentSharePrice: 0.1080,
    stakingDeadline: Date.now() + 86400000 * 8,
    totalStaked: 7250.00,
    investorCount: 203,
    revenueShare: 55
  }];


  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000)?.toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000)?.toFixed(1)}K`;
    }
    return views?.toString();
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    }
  };

  const getTimeRemaining = (deadline) => {
    const remaining = deadline - Date.now();
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(remaining % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return 'Closing soon';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Related Videos</h3>
      <div className="space-y-4">
        {relatedVideos?.map((video) =>
        <Link
          key={video?.id}
          to={`/video-watch-page?id=${video?.id}`}
          className="flex space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth group">

            <div className="relative flex-shrink-0">
              <Image
              src={video?.thumbnail}
              alt={video?.thumbnailAlt}
              className="w-40 h-24 object-cover rounded-lg" />

              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {video?.duration}
              </div>
              <div className="absolute top-1 left-1 bg-primary/90 text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                Stakeable
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth line-clamp-2">
                {video?.title}
              </h4>
              
              <p className="text-sm text-muted-foreground">{video?.creator}</p>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{formatViews(video?.views)} views</span>
                <span>•</span>
                <span>{formatTimeAgo(video?.uploadDate)}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Share Price:</span>
                  <span className="font-medium text-primary">{video?.currentSharePrice?.toFixed(4)} XLM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Staking ends:</span>
                  <span className="font-medium text-warning">{getTimeRemaining(video?.stakingDeadline)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total staked:</span>
                  <span className="font-medium text-success">{video?.totalStaked?.toFixed(0)} XLM</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span className="text-muted-foreground">{video?.investorCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Percent" size={12} />
                  <span className="text-success">{video?.revenueShare}%</span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
      <div className="text-center pt-4">
        <Link
          to="/home-dashboard"
          className="text-sm text-primary hover:text-primary/80 transition-smooth">

          View more videos →
        </Link>
      </div>
    </div>);

};

export default RelatedVideos;