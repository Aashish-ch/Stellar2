import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import StakingPanel from './components/StakingPanel';
import VideoMetadata from './components/VideoMetadata';
import CommentsSection from './components/CommentsSection';
import RelatedVideos from './components/RelatedVideos';
import TransactionProgressOverlay from '../../components/ui/TransactionProgressOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VideoWatchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);

  const videoId = searchParams?.get('id') || '1';

  // Mock video data
  const video = {
    id: videoId,
    title: "Complete Guide to DeFi Yield Farming: Maximize Your Crypto Returns",
    description: `In this comprehensive tutorial, I'll walk you through everything you need to know about DeFi yield farming to maximize your cryptocurrency returns safely and effectively.\n\nWhat you'll learn:\n• Understanding liquidity pools and automated market makers\n• Risk assessment strategies for different protocols\n• Step-by-step guide to providing liquidity on major DEXs\n• Advanced strategies for maximizing yields while minimizing impermanent loss\n• Security best practices and red flags to avoid\n\nThis video covers practical examples using Uniswap, SushiSwap, Compound, and Aave. I'll show you real transactions and explain the math behind yield calculations.\n\nTimestamps:\n0:00 Introduction to Yield Farming\n3:45 Understanding Liquidity Pools\n8:20 Risk Assessment Framework\n15:30 Hands-on Tutorial: Uniswap V3\n25:10 Advanced Strategies\n35:45 Security Considerations\n42:15 Tax Implications\n48:30 Conclusion and Resources`,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1568092715422-fff34eabbe84",
    thumbnailAlt: "Computer screen displaying DeFi yield farming dashboard with colorful charts and cryptocurrency trading interface",
    duration: "52:15",
    views: 127500,
    likes: 8420,
    uploadDate: new Date(Date.now() - 86400000 * 3),
    tags: ["DeFi", "YieldFarming", "Cryptocurrency", "Tutorial", "Blockchain", "Investment"],

    // Staking data
    currentSharePrice: 0.0825,
    baseSharePrice: 0.0500,
    stakingDeadline: Date.now() + 86400000 * 16, // 16 days from now
    totalShares: 50000,
    totalStaked: 4125.75,
    investorCount: 142,
    revenueShare: 65,
    projectedRevenuePerShare: 0.15
  };

  const creator = {
    id: "crypto-educator-pro",
    name: "CryptoEducator Pro",
    avatar: "https://images.unsplash.com/photo-1710652666897-a3966c2f0be6",
    avatarAlt: "Professional headshot of cryptocurrency educator in business attire with confident smile",
    subscribers: "248K",
    isVerified: true,
    totalVideos: 156,
    totalRevenue: 125000.50
  };

  useEffect(() => {
    // Check wallet connection
    const connected = localStorage.getItem('wallet-connected') === 'true';
    setWalletConnected(connected);

    // Update page title
    document.title = `${video?.title} - CreatorStake`;

    return () => {
      document.title = 'CreatorStake';
    };
  }, [video?.title]);

  const handleStake = async (stakeData) => {
    if (!walletConnected) {
      navigate('/wallet-connection');
      return;
    }

    // Dispatch transaction start event
    const transactionId = `stake_${Date.now()}`;
    const event = new CustomEvent('transaction-start', {
      detail: {
        transactionId,
        type: 'stake',
        amount: stakeData.amount,
        recipient: creator.name
      }
    });
    window.dispatchEvent(event);

    // Simulate staking process
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          resolve(stakeData);
        } else {
          reject(new Error('Staking transaction failed'));
        }
      }, 2000);
    });
  };

  const handleFullscreen = (fullscreen) => {
    setIsFullscreen(fullscreen);
  };

  const connectWallet = () => {
    navigate('/wallet-connection');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-16 transition-layout ${
      isFullscreen ? '' : sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'} pb-20 lg:pb-0`
      }>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {!walletConnected &&
          <div className="mb-6 bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                  <div>
                    <p className="font-medium text-warning">Wallet Not Connected</p>
                    <p className="text-sm text-warning/80">Connect your wallet to stake in videos and earn returns</p>
                  </div>
                </div>
                <Button variant="warning" onClick={connectWallet} iconName="Wallet">
                  Connect Wallet
                </Button>
              </div>
            </div>
          }

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Video Player */}
              <VideoPlayer
                video={video}
                onFullscreen={handleFullscreen} />


              {/* Mobile Staking Panel */}
              <div className="xl:hidden">
                <StakingPanel
                  video={video}
                  onStake={handleStake} />

              </div>

              {/* Video Metadata */}
              <VideoMetadata
                video={video}
                creator={creator} />


              {/* Comments Section */}
              <CommentsSection videoId={video?.id} />
            </div>

            {/* Sidebar Content */}
            <div className="xl:col-span-1 space-y-6">
              {/* Desktop Staking Panel */}
              <div className="hidden xl:block">
                <StakingPanel
                  video={video}
                  onStake={handleStake} />

              </div>

              {/* Related Videos */}
              <RelatedVideos currentVideoId={video?.id} />
            </div>
          </div>
        </div>
      </main>
      <TransactionProgressOverlay />
    </div>);

};

export default VideoWatchPage;