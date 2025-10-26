import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchAndFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    priceRange: 'all',
    timeRemaining: 'all',
    contentType: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const searchSuggestions = [
    {
      type: 'trending',
      title: 'DeFi Protocol Development',
      creator: 'TechGuru_2024',
      category: 'Blockchain'
    },
    {
      type: 'trending',
      title: 'React Performance Optimization',
      creator: 'CodeMaster_Pro',
      category: 'Programming'
    },
    {
      type: 'creator',
      title: 'CryptoQueen',
      subscribers: '12.4K',
      category: 'Finance'
    },
    {
      type: 'category',
      title: 'Machine Learning',
      videoCount: 156
    },
    {
      type: 'live',
      title: 'Live: Building Smart Contracts',
      creator: 'BlockchainDev_Pro',
      viewers: 1247
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'programming', label: 'Programming' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'finance', label: 'Finance' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-10', label: '0 - 10 XLM' },
    { value: '10-25', label: '10 - 25 XLM' },
    { value: '25-50', label: '25 - 50 XLM' },
    { value: '50+', label: '50+ XLM' }
  ];

  const timeRemainingOptions = [
    { value: 'all', label: 'Any Time' },
    { value: '1h', label: 'Less than 1 hour' },
    { value: '24h', label: 'Less than 24 hours' },
    { value: '7d', label: 'Less than 7 days' },
    { value: '30d', label: 'Less than 30 days' }
  ];

  const contentTypes = [
    { value: 'all', label: 'All Content' },
    { value: 'videos', label: 'Videos Only' },
    { value: 'live', label: 'Live Streams' },
    { value: 'upcoming', label: 'Upcoming Streams' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      navigate(`/video-watch-page?search=${encodeURIComponent(query?.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion?.type === 'creator') {
      navigate(`/creator-profile?creator=${suggestion?.title}`);
    } else if (suggestion?.type === 'category') {
      navigate(`/video-watch-page?category=${suggestion?.title?.toLowerCase()}`);
    } else if (suggestion?.type === 'live') {
      navigate('/live-stream-watch');
    } else {
      setSearchQuery(suggestion?.title);
      handleSearch(suggestion?.title);
    }
    setShowSuggestions(false);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(selectedFilters)?.forEach(([key, value]) => {
      if (value !== 'all') {
        params?.append(key, value);
      }
    });

    if (searchQuery?.trim()) {
      params?.append('search', searchQuery?.trim());
    }

    navigate(`/video-watch-page?${params?.toString()}`);
    setShowAdvancedFilters(false);
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: 'all',
      priceRange: 'all',
      timeRemaining: 'all',
      contentType: 'all'
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(selectedFilters)?.some(value => value !== 'all') || searchQuery?.trim();

  const filteredSuggestions = searchSuggestions?.filter(suggestion =>
    suggestion?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    (suggestion?.creator && suggestion?.creator?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
  );

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search videos, creators, or topics..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e?.target?.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={(e) => {
              if (e?.key === 'Enter') {
                handleSearch();
              }
            }}
            className="pl-12 pr-20"
          />
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="SlidersHorizontal"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={hasActiveFilters ? 'text-primary' : ''}
            >
              Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconName="Search"
              onClick={() => handleSearch()}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-2 z-200 max-h-80 overflow-y-auto">
            {filteredSuggestions?.length > 0 ? (
              <div className="py-2">
                {filteredSuggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-smooth flex items-center space-x-3"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      suggestion?.type === 'trending' ? 'bg-primary/20' :
                      suggestion?.type === 'creator' ? 'bg-secondary/20' :
                      suggestion?.type === 'category'? 'bg-accent/20' : 'bg-error/20'
                    }`}>
                      <Icon 
                        name={
                          suggestion?.type === 'trending' ? 'TrendingUp' :
                          suggestion?.type === 'creator' ? 'User' :
                          suggestion?.type === 'category'? 'Folder' : 'Radio'
                        } 
                        size={16} 
                        className={
                          suggestion?.type === 'trending' ? 'text-primary' :
                          suggestion?.type === 'creator' ? 'text-secondary' :
                          suggestion?.type === 'category'? 'text-accent' : 'text-error'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-popover-foreground truncate">
                        {suggestion?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion?.type === 'trending' && `by ${suggestion?.creator} • ${suggestion?.category}`}
                        {suggestion?.type === 'creator' && `${suggestion?.subscribers} subscribers • ${suggestion?.category}`}
                        {suggestion?.type === 'category' && `${suggestion?.videoCount} videos`}
                        {suggestion?.type === 'live' && `${suggestion?.viewers} viewers • Live now`}
                      </p>
                    </div>
                    {suggestion?.type === 'live' && (
                      <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No suggestions found</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 bg-card border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
              <select
                value={selectedFilters?.category}
                onChange={(e) => handleFilterChange('category', e?.target?.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories?.map(category => (
                  <option key={category?.value} value={category?.value}>
                    {category?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Price Range</label>
              <select
                value={selectedFilters?.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e?.target?.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {priceRanges?.map(range => (
                  <option key={range?.value} value={range?.value}>
                    {range?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Remaining Filter */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Time Remaining</label>
              <select
                value={selectedFilters?.timeRemaining}
                onChange={(e) => handleFilterChange('timeRemaining', e?.target?.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {timeRemainingOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Content Type</label>
              <select
                value={selectedFilters?.contentType}
                onChange={(e) => handleFilterChange('contentType', e?.target?.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {contentTypes?.map(type => (
                  <option key={type?.value} value={type?.value}>
                    {type?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <span className="text-sm text-muted-foreground">
                  {Object.values(selectedFilters)?.filter(v => v !== 'all')?.length + (searchQuery?.trim() ? 1 : 0)} filters active
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={clearFilters}>
                Clear All
              </Button>
              <Button variant="primary" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Active Filters Display */}
      {hasActiveFilters && !showAdvancedFilters && (
        <div className="mt-4 flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(selectedFilters)?.map(([key, value]) => {
            if (value === 'all') return null;
            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 bg-primary/20 text-primary px-2 py-1 rounded text-sm"
              >
                <span>{value}</span>
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  className="hover:bg-primary/30 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            );
          })}
          {searchQuery?.trim() && (
            <span className="inline-flex items-center space-x-1 bg-secondary/20 text-secondary px-2 py-1 rounded text-sm">
              <span>"{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-secondary/30 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;