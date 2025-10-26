import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const StreamInfo = ({ stream, onFollow, onShare, onNotify }) => {
  const [isFollowing, setIsFollowing] = useState(stream?.isFollowing || false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(!isFollowing);
  };

  const handleNotify = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    onNotify?.(!isNotificationEnabled);
  };

  const handleShare = (platform) => {
    onShare?.(platform);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000)?.toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'K';
    }
    return num?.toString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Creator Info */}
      <div className="flex items-start space-x-4">
        <Link to={`/creator/${stream?.creatorId}`}>
          <Image
            src={stream?.creatorAvatar}
            alt={stream?.creatorAvatarAlt}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to={`/creator/${stream?.creatorId}`}
                className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors"
              >
                {stream?.creator}
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                {stream?.isVerified && (
                  <Icon name="CheckCircle" size={16} className="text-primary" />
                )}
                <span className="text-sm text-muted-foreground">
                  {formatNumber(stream?.subscribers)} subscribers
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                onClick={handleFollow}
                iconName={isFollowing ? "UserCheck" : "UserPlus"}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              
              <Button
                variant={isNotificationEnabled ? "secondary" : "outline"}
                size="sm"
                onClick={handleNotify}
                iconName={isNotificationEnabled ? "BellRing" : "Bell"}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Joined {stream?.creatorJoinDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Video" size={14} />
              <span>{stream?.totalVideos} videos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={14} />
              <span>{formatNumber(stream?.totalRevenue)} XLM earned</span>
            </div>
          </div>
        </div>
      </div>
      {/* Stream Details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-2">{stream?.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Tag" size={14} />
              <span>{stream?.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>Scheduled for {new Date(stream.scheduledTime)?.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{formatNumber(stream?.expectedViewers)} expected viewers</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm text-card-foreground leading-relaxed">
            {showFullDescription ? stream?.description : `${stream?.description?.slice(0, 200)}...`}
          </p>
          {stream?.description?.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {stream?.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {/* Stream Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Icon name="Eye" size={20} className="text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">{formatNumber(stream?.viewerCount)}</p>
          <p className="text-xs text-muted-foreground">Current Viewers</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Icon name="TrendingUp" size={20} className="text-success mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">{stream?.stakedShares}</p>
          <p className="text-xs text-muted-foreground">Shares Staked</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Icon name="DollarSign" size={20} className="text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-card-foreground">{stream?.totalStaked?.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">XLM Staked</p>
        </div>
      </div>
      {/* Social Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            iconName="ThumbsUp"
            className="text-muted-foreground hover:text-success"
          >
            {formatNumber(stream?.likes)}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageCircle"
            className="text-muted-foreground hover:text-primary"
          >
            Chat
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Bookmark"
            className="text-muted-foreground hover:text-warning"
          >
            Save
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Share2"
            onClick={() => handleShare('copy')}
          >
            Share
          </Button>
          
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
            />
            <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-lg shadow-elevation-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Twitter" size={14} />
                <span>Share on Twitter</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Facebook" size={14} />
                <span>Share on Facebook</span>
              </button>
              <button
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Flag" size={14} />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamInfo;