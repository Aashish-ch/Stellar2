import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'views', label: 'Views' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'stakes', label: 'Stakes' }
  ];

  // Mock analytics data
  const revenueData = [
    { date: '10/19', revenue: 1250, stakes: 45, views: 2340 },
    { date: '10/20', revenue: 1890, stakes: 67, views: 3120 },
    { date: '10/21', revenue: 2340, stakes: 89, views: 4560 },
    { date: '10/22', revenue: 1780, stakes: 56, views: 3890 },
    { date: '10/23', revenue: 2890, stakes: 123, views: 5670 },
    { date: '10/24', revenue: 3450, stakes: 145, views: 6780 },
    { date: '10/25', revenue: 2670, stakes: 98, views: 4320 }
  ];

  const engagementData = [
    { name: 'Likes', value: 12450, color: '#6366F1' },
    { name: 'Comments', value: 3240, color: '#8B5CF6' },
    { name: 'Shares', value: 1890, color: '#10B981' },
    { name: 'Stakes', value: 890, color: '#F59E0B' }
  ];

  const topVideos = [
    {
      id: 1,
      title: 'Building DeFi Apps with Stellar',
      views: 45670,
      revenue: 2340.50,
      stakes: 156,
      engagement: 89.5
    },
    {
      id: 2,
      title: 'Crypto Trading Strategies 2024',
      views: 38920,
      revenue: 1890.25,
      stakes: 134,
      engagement: 76.8
    },
    {
      id: 3,
      title: 'Smart Contract Development',
      views: 32450,
      revenue: 1567.75,
      stakes: 98,
      engagement: 82.3
    },
    {
      id: 4,
      title: 'Blockchain Fundamentals',
      views: 28340,
      revenue: 1234.00,
      stakes: 87,
      engagement: 71.2
    }
  ];

  const keyMetrics = {
    totalRevenue: 15847.50,
    totalViews: 234560,
    totalStakes: 1456,
    avgEngagement: 78.4,
    revenueGrowth: 23.5,
    viewsGrowth: 18.7,
    stakesGrowth: 45.2,
    engagementGrowth: 12.3
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(value);
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return (value / 1000000)?.toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000)?.toFixed(1) + 'K';
    }
    return value?.toString();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Analytics Overview</h3>
        
        <div className="flex gap-3">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-40"
          />
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="w-40"
          />
          <Button variant="outline" iconName="Download">
            Export
          </Button>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(keyMetrics?.totalRevenue)} XLM</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Icon name="TrendingUp" size={14} className="text-success mr-1" />
            <span className="text-sm text-success">+{keyMetrics?.revenueGrowth}%</span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(keyMetrics?.totalViews)}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={24} className="text-secondary" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Icon name="TrendingUp" size={14} className="text-success mr-1" />
            <span className="text-sm text-success">+{keyMetrics?.viewsGrowth}%</span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stakes</p>
              <p className="text-2xl font-bold text-foreground">{keyMetrics?.totalStakes}</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-accent" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Icon name="TrendingUp" size={14} className="text-success mr-1" />
            <span className="text-sm text-success">+{keyMetrics?.stakesGrowth}%</span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
              <p className="text-2xl font-bold text-foreground">{keyMetrics?.avgEngagement}%</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={24} className="text-warning" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Icon name="TrendingUp" size={14} className="text-success mr-1" />
            <span className="text-sm text-success">+{keyMetrics?.engagementGrowth}%</span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Revenue Trend</h4>
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Engagement Breakdown</h4>
            <Icon name="PieChart" size={20} className="text-secondary" />
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {engagementData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {engagementData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name}</span>
                <span className="text-sm font-medium text-foreground ml-auto">
                  {formatNumber(item?.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Performing Videos */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Top Performing Videos</h4>
          <Button variant="outline" size="sm" iconName="ExternalLink">
            View All
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Video</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Views</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Stakes</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {topVideos?.map((video, index) => (
                <tr key={video?.id} className="border-b border-border last:border-b-0">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{video?.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-medium text-foreground">{formatNumber(video?.views)}</span>
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-success">{formatCurrency(video?.revenue)} XLM</span>
                  </td>
                  <td className="py-4">
                    <span className="font-medium text-foreground">{video?.stakes}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${video?.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{video?.engagement}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;