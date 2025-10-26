import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LiveChat = ({ streamId, isCollapsed, onToggleCollapse }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const mockMessages = [
    {
      id: 1,
      user: 'CryptoTrader_99',
      message: 'This stream is amazing! Already staked 500 XLM 🚀',
      timestamp: Date.now() - 120000,
      isVerified: true,
      isCreator: false,
      stakingAmount: 500
    },
    {
      id: 2,
      user: 'TechGuru_2024',
      message: 'Welcome everyone! Get ready for some exciting DeFi insights',
      timestamp: Date.now() - 90000,
      isVerified: true,
      isCreator: true,
      stakingAmount: 0
    },
    {
      id: 3,
      user: 'BlockchainBabe',
      message: 'Just joined! What is the minimum stake amount?',
      timestamp: Date.now() - 60000,
      isVerified: false,
      isCreator: false,
      stakingAmount: 0
    },
    {
      id: 4,
      user: 'DeFiMaster',
      message: 'Price is going up fast! Better stake now 📈',
      timestamp: Date.now() - 30000,
      isVerified: true,
      isCreator: false,
      stakingAmount: 1200
    },
    {
      id: 5,
      user: 'NewInvestor_2024',
      message: 'How do I connect my Freighter wallet?',
      timestamp: Date.now() - 15000,
      isVerified: false,
      isCreator: false,
      stakingAmount: 0
    }
  ];

  const emojis = ['🚀', '💎', '🔥', '📈', '💰', '⭐', '👍', '❤️', '😍', '🎉'];

  useEffect(() => {
    setMessages(mockMessages);
    
    // Simulate new messages
    const interval = setInterval(() => {
      const randomMessages = [
        'Great analysis! 📊',
        'Staking more now! 💰',
        'This is the future of content! 🚀',
        'Amazing stream quality 🔥',
        'When is the next stream? ⏰',
        'Love the community here! ❤️'
      ];
      
      const newMsg = {
        id: Date.now(),
        user: `User_${Math.floor(Math.random() * 1000)}`,
        message: randomMessages?.[Math.floor(Math.random() * randomMessages?.length)],
        timestamp: Date.now(),
        isVerified: Math.random() > 0.7,
        isCreator: false,
        stakingAmount: Math.random() > 0.8 ? Math.floor(Math.random() * 1000) + 100 : 0
      };
      
      setMessages(prev => [...prev, newMsg]?.slice(-50)); // Keep last 50 messages
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage?.trim()) return;

    const message = {
      id: Date.now(),
      user: 'You',
      message: newMessage,
      timestamp: Date.now(),
      isVerified: true,
      isCreator: false,
      stakingAmount: 0
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    chatInputRef?.current?.focus();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserBadge = (message) => {
    if (message?.isCreator) {
      return (
        <div className="flex items-center space-x-1">
          <Icon name="Crown" size={12} className="text-secondary" />
          <span className="text-xs text-secondary font-medium">Creator</span>
        </div>
      );
    }
    
    if (message?.stakingAmount > 0) {
      return (
        <div className="flex items-center space-x-1">
          <Icon name="TrendingUp" size={12} className="text-success" />
          <span className="text-xs text-success font-medium">Staker</span>
        </div>
      );
    }
    
    if (message?.isVerified) {
      return (
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={12} className="text-primary" />
          <span className="text-xs text-primary font-medium">Verified</span>
        </div>
      );
    }
    
    return null;
  };

  if (isCollapsed) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="MessageCircle" size={20} />
            <span className="font-medium text-card-foreground">Chat</span>
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {messages?.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Maximize2"
            onClick={onToggleCollapse}
          >
            Expand
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {messages?.slice(-2)?.map((message) => (
            <div key={message?.id} className="text-sm">
              <span className="font-medium text-foreground">{message?.user}:</span>
              <span className="text-muted-foreground ml-1">{message?.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg flex flex-col h-96">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={20} />
          <span className="font-medium text-card-foreground">Live Chat</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{messages?.length} messages</span>
          <Button
            variant="ghost"
            size="sm"
            iconName="Minimize2"
            onClick={onToggleCollapse}
          />
        </div>
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((message) => (
          <div key={message?.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${
                  message?.isCreator ? 'text-secondary' : 
                  message?.user === 'You' ? 'text-primary' : 'text-foreground'
                }`}>
                  {message?.user}
                </span>
                {getUserBadge(message)}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message?.timestamp)}
              </span>
            </div>
            <p className="text-sm text-card-foreground break-words">
              {message?.message}
            </p>
            {message?.stakingAmount > 0 && (
              <div className="flex items-center space-x-1 text-xs text-success">
                <Icon name="TrendingUp" size={12} />
                <span>Staked {message?.stakingAmount} XLM</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={chatInputRef}
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e?.target?.value)}
                className="pr-10"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  iconName="Smile"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              iconName="Send"
              disabled={!newMessage?.trim()}
            >
              Send
            </Button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="bg-popover border border-border rounded-lg p-3">
              <div className="grid grid-cols-5 gap-2">
                {emojis?.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-lg hover:bg-muted rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Chat Rules */}
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Be respectful • No spam • Verified wallets only</p>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;