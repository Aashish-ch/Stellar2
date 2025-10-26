import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendingVideos = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  const trendingVideos = [
  {
    id: 4,
    title: "Advanced Machine Learning with Python: Neural Networks Explained",
    creator: "AI_Researcher",
    creatorAvatar: "https://images.unsplash.com/photo-1713946598186-8e28275719b9",
    creatorAvatarAlt: "Professional man with beard wearing glasses and dark suit jacket",
    thumbnail: "https://images.unsplash.com/photo-1721525746389-fac9b1f423c5",
    thumbnailAlt: "Computer screen displaying neural network diagrams and Python code with data visualization charts",
    currentPrice: 18.75,
    priceChange: 2.50,
    totalStaked: 15420.25,
    stakingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    viewCount: 34567,
    duration: "1:12:45",
    category: "AI/ML",
    trendingScore: 95,
    isHot: true
  },
  {
    id: 5,
    title: "Web3 Gaming Revolution: Building Play-to-Earn Games",
    creator: "GameDev_Master",
    creatorAvatar: "https://images.unsplash.com/photo-1715005881129-266ccdd75e43",
    creatorAvatarAlt: "Young creative professional with short dark hair wearing casual black t-shirt",
    thumbnail: "https://images.unsplash.com/photo-1618605294697-51a28266f019",
    thumbnailAlt: "Gaming setup with RGB lighting showing blockchain game interface and NFT marketplace",
    currentPrice: 22.00,
    priceChange: 4.25,
    totalStaked: 28750.50,
    stakingDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    viewCount: 45123,
    duration: "58:30",
    category: "Gaming",
    trendingScore: 92,
    isHot: true
  },
  {
    id: 6,
    title: "Sustainable Energy Solutions: Solar Panel Installation Guide",
    creator: "EcoTech_Solutions",
    creatorAvatar: "https://images.unsplash.com/photo-1618243739687-332d16d56291",
    creatorAvatarAlt: "Professional woman with curly hair wearing green sustainable fashion top",
    thumbnail: "https://images.unsplash.com/photo-1513125627237-5f988ee276dd",
    thumbnailAlt: "Solar panels being installed on residential rooftop with blue sky and green landscape background",
    currentPrice: 14.50,
    priceChange: 1.75,
    totalStaked: 9875.75,
    stakingDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    viewCount: 18934,
    duration: "42:18",
    category: "Sustainability",
    trendingScore: 88,
    isHot: false
  },
  {
    id: 7,
    title: "Digital Marketing Mastery: SEO & Content Strategy 2024",
    creator: "Marketing_Guru",
    creatorAvatar: "https://images.unsplash.com/photo-1703668355895-a19da66c4a58",
    creatorAvatarAlt: "Confident businessman with short brown hair in navy blue business suit",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
    thumbnailAlt: "Modern office desk with laptop displaying SEO analytics dashboard and marketing strategy documents",
    currentPrice: 11.25,
    priceChange: 0.85,
    totalStaked: 6420.00,
    stakingDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    viewCount: 12456,
    duration: "35:42",
    category: "Marketing",
    trendingScore: 85,
    isHot: false
  },
  {
    id: 8,
    title: "Blockchain Development: Smart Contract Security Best Practices",
    creator: "BlockchainDev_Pro",
    creatorAvatar: "https://images.unsplash.com/photo-1573879029680-ef2d3b800dbd",
    creatorAvatarAlt: "Tech professional with glasses and beard wearing casual blue shirt in modern office",
    thumbnail: "https://images.unsplash.com/photo-1715830924994-97fc4b9e0f8d",
    thumbnailAlt: "Computer screen showing Solidity smart contract code with blockchain network visualization",
    currentPrice: 25.75,
    priceChange: 3.50,
    totalStaked: 32150.25,
    stakingDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    viewCount: 28765,
    duration: "1:05:20",
    category: "Blockchain",
    trendingScore: 98,
    isHot: true
  },
  {
    id: 9,
    title: "Photography Masterclass: Portrait Lighting Techniques",
    creator: "PhotoArtist_Studio",
    creatorAvatar: "https://images.unsplash.com/photo-1663855473130-44fcfba68ec5",
    creatorAvatarAlt: "Creative photographer woman with long dark hair holding professional camera",
    thumbnail: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c",
    thumbnailAlt: "Professional photography studio setup with lighting equipment and model posing for portrait session",
    currentPrice: 16.00,
    priceChange: 2.25,
    totalStaked: 11340.50,
    stakingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    viewCount: 15678,
    duration: "48:15",
    category: "Photography",
    trendingScore: 82,
    isHot: false
  }];


  const categories = ['all', 'AI/ML', 'Gaming', 'Blockchain', 'Marketing', 'Photography', 'Sustainability'];
  const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'deadline', label: 'Ending Soon' },
  { value: 'staked', label: 'Most Staked' }];


  const filteredAndSortedVideos = trendingVideos?.filter((video) => filter === 'all' || video?.category === filter)?.sort((a, b) => {
    switch (sortBy) {
      case 'price_high':
        return b?.currentPrice - a?.currentPrice;
      case 'price_low':
        return a?.currentPrice - b?.currentPrice;
      case 'deadline':
        return a?.stakingDeadline - b?.stakingDeadline;
      case 'staked':
        return b?.totalStaked - a?.totalStaked;
      case 'trending':
      default:
        return b?.trendingScore - a?.trendingScore;
    }
  });

  const formatTimeRemaining = (deadline) => {
    const remaining = deadline - Date.now();
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(remaining % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  const handleQuickStake = (video, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const event = new CustomEvent('transaction-start', {
      detail: {
        transactionId: `stake_${video.id}_${Date.now()}`,
        type: 'stake',
        amount: video.currentPrice,
        recipient: video.creator
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Trending Videos</h2>
          <p className="text-muted-foreground">Discover the most popular investment opportunities</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">

              {categories?.map((category) =>
              <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              )}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">

              {sortOptions?.map((option) =>
              <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedVideos?.map((video) =>
        <Link
          key={video?.id}
          to={`/video-watch-page?id=${video?.id}`}
          className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-1">

            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <Image
              src={video?.thumbnail}
              alt={video?.thumbnailAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

              
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video?.duration}
              </div>

              {/* Hot Badge */}
              {video?.isHot &&
            <div className="absolute top-2 left-2 bg-error text-error-foreground text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Icon name="Flame" size={12} />
                  <span>Hot</span>
                </div>
            }

              {/* Category */}
              <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
                {video?.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
                {video?.title}
              </h3>

              {/* Creator Info */}
              <div className="flex items-center space-x-2 mb-3">
                <Image
                src={video?.creatorAvatar}
                alt={video?.creatorAvatarAlt}
                className="w-8 h-8 rounded-full object-cover" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{video?.creator}</p>
                  <p className="text-xs text-muted-foreground">{video?.viewCount?.toLocaleString()} views</p>
                </div>
              </div>

              {/* Staking Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-success">{video?.currentPrice} XLM</span>
                      <span className="text-xs text-success flex items-center">
                        <Icon name="TrendingUp" size={10} className="mr-0.5" />
                        +{video?.priceChange}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Ends In</p>
                    <p className="text-sm font-semibold text-warning">
                      {formatTimeRemaining(video?.stakingDeadline)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Staked</p>
                    <p className="text-sm font-semibold text-foreground">
                      {video?.totalStaked?.toLocaleString()} XLM
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="TrendingUp" size={12} className="text-success" />
                    <span className="text-xs text-success">{video?.trendingScore}% trending</span>
                  </div>
                </div>

                {/* Quick Stake Button */}
                <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleQuickStake(video, e)}
                iconName="Zap"
                className="w-full">

                  Quick Stake {video?.currentPrice} XLM
                </Button>
              </div>
            </div>
          </Link>
        )}
      </div>
      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" iconName="MoreHorizontal">
          Load More Videos
        </Button>
      </div>
    </div>);

};

export default TrendingVideos;