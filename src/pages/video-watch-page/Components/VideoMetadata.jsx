import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VideoMetadata = ({ video, creator }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likes, setLikes] = useState(video?.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000)?.toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000)?.toFixed(1)}K`;
    }
    return views?.toString();
  };

  return (
    <div className="space-y-6">
      {/* Video Title and Stats */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {video?.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{formatViews(video?.views)} views</span>
            <span>•</span>
            <span>{formatDate(video?.uploadDate)}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{video?.investorCount} investors</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              iconName="ThumbsUp"
              iconPosition="left"
            >
              {likes}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
            >
              Share
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      {/* Creator Info */}
      <div className="flex items-start justify-between p-4 bg-card border border-border rounded-lg">
        <div className="flex items-start space-x-4">
          <Link to={`/creator/${creator?.id}`}>
            <Image
              src={creator?.avatar}
              alt={creator?.avatarAlt}
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>
          
          <div className="space-y-1">
            <Link 
              to={`/creator/${creator?.id}`}
              className="font-semibold text-card-foreground hover:text-primary transition-smooth"
            >
              {creator?.name}
            </Link>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{creator?.subscribers} subscribers</span>
              {creator?.isVerified && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={14} className="text-primary" />
                    <span>Verified Creator</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-muted-foreground">Revenue Share:</span>
              <span className="font-medium text-success">{video?.revenueShare}%</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Total Raised:</span>
              <span className="font-medium text-primary">{video?.totalStaked?.toFixed(0)} XLM</span>
            </div>
          </div>
        </div>
        
        <Button
          variant={isSubscribed ? "outline" : "primary"}
          onClick={handleSubscribe}
          iconName={isSubscribed ? "Check" : "Plus"}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </div>
      {/* Video Description */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Description</h3>
        <div className="bg-muted rounded-lg p-4">
          <div className={`text-sm text-foreground leading-relaxed ${
            !isDescriptionExpanded ? 'line-clamp-3' : ''
          }`}>
            {video?.description}
          </div>
          
          {video?.description?.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 p-0 h-auto text-primary"
            >
              {isDescriptionExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>
      </div>
      {/* Tags */}
      {video?.tags && video?.tags?.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {video?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Investment Stats */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-card-foreground mb-3">Investment Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-success">{video?.totalStaked?.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">XLM Raised</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{video?.investorCount}</div>
            <div className="text-xs text-muted-foreground">Investors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-warning">{video?.revenueShare}%</div>
            <div className="text-xs text-muted-foreground">Revenue Share</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{video?.totalShares}</div>
            <div className="text-xs text-muted-foreground">Total Shares</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMetadata;