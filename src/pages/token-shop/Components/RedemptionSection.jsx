import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RedemptionSection = () => {
  const [rewards, setRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userTokens, setUserTokens] = useState({});

  const categories = [
  { id: 'all', label: 'All Rewards', icon: 'Gift' },
  { id: 'merchandise', label: 'Merchandise', icon: 'ShoppingBag' },
  { id: 'experiences', label: 'Experiences', icon: 'Calendar' },
  { id: 'digital', label: 'Digital Content', icon: 'Download' },
  { id: 'exclusive', label: 'Exclusive Access', icon: 'Crown' }];


  useEffect(() => {
    // Simulate fetching redemption rewards
    const mockRewards = [
    {
      id: 1,
      title: 'TechGuru Signed Mousepad',
      creator: 'TechGuru_2024',
      category: 'merchandise',
      cost: 500,
      currency: 'CREATOR',
      available: 25,
      total: 50,
      image: "https://images.unsplash.com/photo-1670496623837-b5535483519f",
      imageAlt: 'Black gaming mousepad with TechGuru signature and logo design',
      description: 'Limited edition mousepad signed by TechGuru with exclusive artwork',
      estimatedDelivery: '2-3 weeks'
    },
    {
      id: 2,
      title: 'Private Coding Session',
      creator: 'CodeMaster_Pro',
      category: 'experiences',
      cost: 2000,
      currency: 'STAKE',
      available: 3,
      total: 5,
      image: "https://images.unsplash.com/photo-1635114332743-719b5e0702b9",
      imageAlt: 'Professional developer working on laptop in modern office setup with multiple monitors',
      description: '1-hour private coding mentorship session with CodeMaster',
      estimatedDelivery: 'Schedule within 1 week'
    },
    {
      id: 3,
      title: 'Exclusive Course Bundle',
      creator: 'LearnWithSarah',
      category: 'digital',
      cost: 750,
      currency: 'CREATOR',
      available: 100,
      total: 100,
      image: "https://images.unsplash.com/photo-1727790496627-1a595b86e318",
      imageAlt: 'Stack of educational books and laptop showing online course interface',
      description: 'Complete web development course bundle with bonus materials',
      estimatedDelivery: 'Instant access'
    },
    {
      id: 4,
      title: 'VIP Discord Access',
      creator: 'GameDev_Master',
      category: 'exclusive',
      cost: 300,
      currency: 'STAKE',
      available: 50,
      total: 50,
      image: "https://images.unsplash.com/photo-1669643470668-19d6fb1d3f21",
      imageAlt: 'Discord app interface showing VIP gaming community channels and member list',
      description: 'Lifetime access to exclusive VIP Discord community',
      estimatedDelivery: 'Instant access'
    },
    {
      id: 5,
      title: 'Custom Logo Design',
      creator: 'DesignPro_Alex',
      category: 'digital',
      cost: 1200,
      currency: 'CREATOR',
      available: 10,
      total: 15,
      image: "https://images.unsplash.com/photo-1581094798398-153528d38b8f",
      imageAlt: 'Designer working on custom logo concepts with sketches and digital tablet',
      description: 'Professional custom logo design with 3 revisions included',
      estimatedDelivery: '5-7 business days'
    },
    {
      id: 6,
      title: 'Gaming Setup Tour',
      creator: 'StreamerKing',
      category: 'experiences',
      cost: 800,
      currency: 'STAKE',
      available: 1,
      total: 2,
      image: "https://images.unsplash.com/photo-1708102965216-e7358fb3353b",
      imageAlt: 'Professional gaming setup with RGB lighting, multiple monitors, and streaming equipment',
      description: 'Virtual tour of professional streaming setup with Q&A session',
      estimatedDelivery: 'Schedule within 2 weeks'
    }];


    setRewards(mockRewards);

    // Simulate user token balances
    setUserTokens({
      CREATOR: 850.25,
      STAKE: 425.75,
      XLM: 1250.50
    });
  }, []);

  const filteredRewards = selectedCategory === 'all' ?
  rewards :
  rewards?.filter((reward) => reward?.category === selectedCategory);

  const canAfford = (reward) => {
    return userTokens?.[reward?.currency] >= reward?.cost;
  };

  const handleRedeem = async (reward) => {
    if (!canAfford(reward)) return;

    try {
      // Simulate redemption transaction
      const event = new CustomEvent('transaction-start', {
        detail: {
          transactionId: `redeem_${Date.now()}`,
          type: 'purchase',
          amount: `${reward.cost} ${reward.currency}`,
          recipient: reward.title
        }
      });
      window.dispatchEvent(event);

      // Update available quantity
      setRewards((prev) => prev?.map((r) =>
      r?.id === reward?.id ?
      { ...r, available: r?.available - 1 } :
      r
      ));

      // Update user balance
      setUserTokens((prev) => ({
        ...prev,
        [reward?.currency]: prev?.[reward?.currency] - reward?.cost
      }));
    } catch (error) {
      console.error('Redemption failed:', error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Reward Redemption</h2>
          <p className="text-sm text-muted-foreground">Redeem tokens for exclusive rewards</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={16} className="text-accent" />
          <span className="text-sm text-muted-foreground">New rewards weekly</span>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) =>
        <Button
          key={category?.id}
          variant={selectedCategory === category?.id ? "primary" : "outline"}
          size="sm"
          iconName={category?.icon}
          onClick={() => setSelectedCategory(category?.id)}>

            {category?.label}
          </Button>
        )}
      </div>
      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards?.map((reward) =>
        <div key={reward?.id} className="bg-muted rounded-lg overflow-hidden border border-border">
            <div className="relative h-48 overflow-hidden">
              <Image
              src={reward?.image}
              alt={reward?.imageAlt}
              className="w-full h-full object-cover" />

              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-foreground">
                  {reward?.available}/{reward?.total}
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-card-foreground">{reward?.title}</h3>
                <p className="text-sm text-muted-foreground">by {reward?.creator}</p>
              </div>
              
              <p className="text-sm text-card-foreground">{reward?.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {reward?.cost}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {reward?.currency}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Delivery</p>
                  <p className="text-xs font-medium text-card-foreground">
                    {reward?.estimatedDelivery}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-border rounded-full h-2">
                  <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${reward?.available / reward?.total * 100}%` }} />

                </div>
                <p className="text-xs text-muted-foreground">
                  {reward?.available} of {reward?.total} available
                </p>
              </div>
              
              <Button
              variant={canAfford(reward) ? "primary" : "outline"}
              size="sm"
              onClick={() => handleRedeem(reward)}
              disabled={!canAfford(reward) || reward?.available === 0}
              iconName={canAfford(reward) ? "ShoppingCart" : "Lock"}
              className="w-full">

                {reward?.available === 0 ?
              'Sold Out' :
              canAfford(reward) ?
              'Redeem Now' : 'Insufficient Tokens'
              }
              </Button>
              
              {!canAfford(reward) && reward?.available > 0 &&
            <p className="text-xs text-error text-center">
                  Need {reward?.cost - userTokens?.[reward?.currency]} more {reward?.currency}
                </p>
            }
            </div>
          </div>
        )}
      </div>
      {filteredRewards?.length === 0 &&
      <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No rewards found</h3>
          <p className="text-muted-foreground">
            Check back later for new rewards in this category
          </p>
        </div>
      }
    </div>);

};

export default RedemptionSection;