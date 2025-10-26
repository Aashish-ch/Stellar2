import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LiveStreamTab = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamData, setStreamData] = useState({
    title: '',
    description: '',
    category: '',
    revenueShare: 70,
    stakingDeadline: 30,
    scheduledTime: '',
    maxViewers: 1000
  });
  const [viewers, setViewers] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [streamStats, setStreamStats] = useState({
    totalStakes: 0,
    currentRevenue: 0,
    peakViewers: 0,
    duration: 0
  });

  const categoryOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance & Crypto' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'music', label: 'Music' }
  ];

  const mockChatMessages = [
    {
      id: 1,
      username: 'CryptoFan123',
      message: 'Great explanation of DeFi protocols!',
      timestamp: Date.now() - 120000,
      isStaker: true
    },
    {
      id: 2,
      username: 'BlockchainDev',
      message: 'Can you explain more about smart contracts?',
      timestamp: Date.now() - 90000,
      isStaker: false
    },
    {
      id: 3,
      username: 'InvestorPro',
      message: 'Just staked 500 XLM! 🚀',
      timestamp: Date.now() - 60000,
      isStaker: true
    },
    {
      id: 4,
      username: 'TechLearner',
      message: 'This is exactly what I needed to understand',
      timestamp: Date.now() - 30000,
      isStaker: false
    }
  ];

  useEffect(() => {
    if (isLive) {
      // Simulate live stream data updates
      const interval = setInterval(() => {
        setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 20) - 10));
        setStreamStats(prev => ({
          ...prev,
          duration: prev?.duration + 1,
          currentRevenue: prev?.currentRevenue + Math.random() * 10,
          totalStakes: prev?.totalStakes + Math.floor(Math.random() * 3)
        }));
      }, 5000);

      setChatMessages(mockChatMessages);
      setViewers(Math.floor(Math.random() * 500) + 100);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleStartStream = () => {
    if (!streamData?.title || !streamData?.category) return;
    
    setIsLive(true);
    setStreamStats({
      totalStakes: Math.floor(Math.random() * 50) + 10,
      currentRevenue: Math.random() * 1000 + 200,
      peakViewers: Math.floor(Math.random() * 300) + 150,
      duration: 0
    });
  };

  const handleEndStream = () => {
    setIsLive(false);
    setViewers(0);
    setChatMessages([]);
  };

  const handleInputChange = (field, value) => {
    setStreamData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendMessage = () => {
    if (!newMessage?.trim()) return;
    
    const message = {
      id: Date.now(),
      username: 'You (Creator)',
      message: newMessage,
      timestamp: Date.now(),
      isCreator: true
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {!isLive ? (
        /* Stream Setup */
        (<div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Live Stream Setup</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Offline</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Stream Title"
                type="text"
                placeholder="Enter stream title"
                value={streamData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Describe your live stream..."
                  value={streamData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                />
              </div>

              <Select
                label="Category"
                options={categoryOptions}
                value={streamData?.category}
                onChange={(value) => handleInputChange('category', value)}
                placeholder="Select category"
                required
              />

              <Input
                label="Scheduled Time (Optional)"
                type="datetime-local"
                value={streamData?.scheduledTime}
                onChange={(e) => handleInputChange('scheduledTime', e?.target?.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Investor Revenue Share: {streamData?.revenueShare}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={streamData?.revenueShare}
                  onChange={(e) => handleInputChange('revenueShare', parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10% (Min)</span>
                  <span>90% (Max)</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Staking Deadline: {streamData?.stakingDeadline} minutes before start
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={streamData?.stakingDeadline}
                  onChange={(e) => handleInputChange('stakingDeadline', parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <Input
                label="Max Viewers"
                type="number"
                placeholder="1000"
                value={streamData?.maxViewers}
                onChange={(e) => handleInputChange('maxViewers', parseInt(e?.target?.value))}
              />

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-foreground">Stream Key</h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-background px-3 py-2 rounded text-sm font-mono">
                    live_sk_abc123xyz789def456
                  </code>
                  <Button variant="ghost" size="xs" iconName="Copy" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this key in your streaming software (OBS, Streamlabs, etc.)
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline">
              Schedule Stream
            </Button>
            <Button 
              variant="primary"
              onClick={handleStartStream}
              disabled={!streamData?.title || !streamData?.category}
              iconName="Radio"
            >
              Go Live
            </Button>
          </div>
        </div>)
      ) : (
        /* Live Stream Control Panel */
        (<div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
                <span className="text-lg font-semibold text-foreground">LIVE</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground">{streamData?.title}</span>
            </div>
            <Button variant="destructive" onClick={handleEndStream} iconName="Square">
              End Stream
            </Button>
          </div>
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Viewers</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{viewers}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-muted-foreground">Stakes</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{streamStats?.totalStakes}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-warning" />
                <span className="text-sm font-medium text-muted-foreground">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{streamStats?.currentRevenue?.toFixed(0)} XLM</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-secondary" />
                <span className="text-sm font-medium text-muted-foreground">Duration</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{formatDuration(streamStats?.duration)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream Preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon name="Video" size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-medium">Live Stream Preview</p>
                  <p className="text-sm opacity-75">Connect your streaming software to see preview</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" iconName="Settings">
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" iconName="Share">
                    Share
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Peak: {streamStats?.peakViewers} viewers
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-card border border-border rounded-lg flex flex-col h-96">
              <div className="p-4 border-b border-border">
                <h4 className="font-medium text-foreground">Live Chat</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages?.map((msg) => (
                  <div key={msg?.id} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        msg?.isCreator ? 'text-primary' : msg?.isStaker ? 'text-success' : 'text-foreground'
                      }`}>
                        {msg?.username}
                      </span>
                      {msg?.isStaker && (
                        <Icon name="Star" size={12} className="text-warning" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{msg?.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e?.target?.value)}
                    onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleSendMessage}
                    iconName="Send"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>)
      )}
    </div>
  );
};

export default LiveStreamTab;