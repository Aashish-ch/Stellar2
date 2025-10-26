import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VideoManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [selectedVideos, setSelectedVideos] = useState([]);

  const statusOptions = [
  { value: 'all', label: 'All Videos' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'processing', label: 'Processing' },
  { value: 'staking', label: 'Staking Active' },
  { value: 'completed', label: 'Staking Completed' }];


  const sortOptions = [
  { value: 'uploadDate', label: 'Upload Date' },
  { value: 'views', label: 'Views' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'stakes', label: 'Stakes' },
  { value: 'title', label: 'Title' }];


  const mockVideos = [
  {
    id: 1,
    title: 'Building DeFi Apps with Stellar SDK',
    thumbnail: "https://images.unsplash.com/photo-1518933165971-611dbc9c412d",
    thumbnailAlt: 'Computer screen showing code editor with blockchain development interface and colorful syntax highlighting',
    status: 'published',
    uploadDate: '2024-10-20',
    views: 45670,
    revenue: 2340.50,
    stakes: 156,
    stakingDeadline: '2024-10-27',
    duration: '28:45',
    category: 'Technology'
  },
  {
    id: 2,
    title: 'Crypto Trading Strategies for 2024',
    thumbnail: "https://images.unsplash.com/photo-1583373325529-501e03a3a8e7",
    thumbnailAlt: 'Financial trading charts and graphs displayed on multiple computer monitors showing cryptocurrency market data',
    status: 'staking',
    uploadDate: '2024-10-22',
    views: 38920,
    revenue: 1890.25,
    stakes: 134,
    stakingDeadline: '2024-10-29',
    duration: '35:12',
    category: 'Finance'
  },
  {
    id: 3,
    title: 'Smart Contract Development Tutorial',
    thumbnail: "https://images.unsplash.com/photo-1649682892309-e10e0b7cd40b",
    thumbnailAlt: 'Abstract digital blockchain network visualization with glowing nodes and connecting lines on dark background',
    status: 'processing',
    uploadDate: '2024-10-24',
    views: 0,
    revenue: 0,
    stakes: 0,
    stakingDeadline: '2024-10-31',
    duration: '42:18',
    category: 'Technology'
  },
  {
    id: 4,
    title: 'Understanding Blockchain Fundamentals',
    thumbnail: "https://images.unsplash.com/photo-1642413598020-7cbd6c54b4b9",
    thumbnailAlt: 'Modern office workspace with laptop displaying blockchain diagrams and cryptocurrency symbols on screen',
    status: 'completed',
    uploadDate: '2024-10-15',
    views: 67890,
    revenue: 3456.75,
    stakes: 234,
    stakingDeadline: '2024-10-22',
    duration: '31:27',
    category: 'Education'
  },
  {
    id: 5,
    title: 'DeFi Yield Farming Explained',
    thumbnail: "https://images.unsplash.com/photo-1643101808449-a99552e364d8",
    thumbnailAlt: 'Cryptocurrency coins and tokens arranged on desk with financial charts and DeFi protocol logos visible',
    status: 'draft',
    uploadDate: '2024-10-25',
    views: 0,
    revenue: 0,
    stakes: 0,
    stakingDeadline: null,
    duration: '25:33',
    category: 'Finance'
  }];


  const filteredVideos = mockVideos?.filter((video) => {
    const matchesSearch = video?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video?.status === filterStatus;
    return matchesSearch && matchesStatus;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'uploadDate':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'views':
        return b?.views - a?.views;
      case 'revenue':
        return b?.revenue - a?.revenue;
      case 'stakes':
        return b?.stakes - a?.stakes;
      case 'title':
        return a?.title?.localeCompare(b?.title);
      default:
        return 0;
    }
  });

  const handleSelectVideo = (videoId) => {
    setSelectedVideos((prev) =>
    prev?.includes(videoId) ?
    prev?.filter((id) => id !== videoId) :
    [...prev, videoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVideos?.length === filteredVideos?.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos?.map((video) => video?.id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':return 'text-success';
      case 'staking':return 'text-primary';
      case 'processing':return 'text-warning';
      case 'completed':return 'text-muted-foreground';
      case 'draft':return 'text-secondary';
      default:return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'published':return 'bg-success/20';
      case 'staking':return 'bg-primary/20';
      case 'processing':return 'bg-warning/20';
      case 'completed':return 'bg-muted';
      case 'draft':return 'bg-secondary/20';
      default:return 'bg-muted';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000)?.toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'K';
    }
    return num?.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Video Management</h3>
        <Button variant="primary" iconName="Plus">
          Upload New Video
        </Button>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)} />

          </div>
          
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-full sm:w-48" />

          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="w-full sm:w-48" />

        </div>

        {selectedVideos?.length > 0 &&
        <div className="flex gap-2">
            <Button variant="outline" size="sm" iconName="Edit">
              Edit Selected ({selectedVideos?.length})
            </Button>
            <Button variant="destructive" size="sm" iconName="Trash2">
              Delete
            </Button>
          </div>
        }
      </div>
      {/* Video Grid */}
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
          <input
            type="checkbox"
            checked={selectedVideos?.length === filteredVideos?.length && filteredVideos?.length > 0}
            onChange={handleSelectAll}
            className="rounded border-border" />

          <span className="text-sm font-medium text-foreground">
            Select All ({filteredVideos?.length} videos)
          </span>
        </div>

        {/* Video List */}
        <div className="space-y-3">
          {filteredVideos?.map((video) =>
          <div key={video?.id} className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start space-x-4">
                <input
                type="checkbox"
                checked={selectedVideos?.includes(video?.id)}
                onChange={() => handleSelectVideo(video?.id)}
                className="mt-2 rounded border-border" />

                
                <div className="relative flex-shrink-0">
                  <img
                  src={video?.thumbnail}
                  alt={video?.thumbnailAlt}
                  className="w-32 h-20 object-cover rounded-lg" />

                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {video?.duration}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{video?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {video?.category} • Uploaded {formatDate(video?.uploadDate)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(video?.status)} ${getStatusColor(video?.status)}`}>
                        {video?.status?.charAt(0)?.toUpperCase() + video?.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="font-medium text-foreground">{formatNumber(video?.views)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-medium text-success">{video?.revenue?.toLocaleString()} XLM</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stakes</p>
                      <p className="font-medium text-foreground">{video?.stakes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {video?.status === 'staking' ? 'Deadline' : 'Status'}
                      </p>
                      <p className="font-medium text-foreground">
                        {video?.stakingDeadline ? formatDate(video?.stakingDeadline) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" size="xs" iconName="Eye" />
                  <Button variant="ghost" size="xs" iconName="Edit" />
                  <Button variant="ghost" size="xs" iconName="BarChart3" />
                  <Button variant="ghost" size="xs" iconName="MoreVertical" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {filteredVideos?.length === 0 &&
      <div className="text-center py-12">
          <Icon name="Video" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">No videos found</p>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filter criteria' : 'Upload your first video to get started'
          }
          </p>
          <Button variant="primary" iconName="Plus">
            Upload Video
          </Button>
        </div>
      }
    </div>);

};

export default VideoManagementTab;