import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PortfolioAnalytics = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [chartType, setChartType] = useState('performance');
  const [portfolioData, setPortfolioData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const timeframeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const chartTypeOptions = [
    { value: 'performance', label: 'Performance' },
    { value: 'distribution', label: 'Distribution' },
    { value: 'earnings', label: 'Earnings' }
  ];

  useEffect(() => {
    // Simulate fetching portfolio analytics
    const fetchAnalytics = () => {
      const mockData = {
        performance: [
          { date: '2025-10-19', value: 1850.25, change: 0 },
          { date: '2025-10-20', value: 1923.50, change: 3.96 },
          { date: '2025-10-21', value: 1876.75, change: -2.43 },
          { date: '2025-10-22', value: 2045.80, change: 9.01 },
          { date: '2025-10-23', value: 2156.30, change: 5.40 },
          { date: '2025-10-24', value: 2089.45, change: -3.10 },
          { date: '2025-10-25', value: 2234.75, change: 6.95 }
        ],
        distribution: [
          { name: 'XLM', value: 1250.50, percentage: 55.9, color: '#6366F1' },
          { name: 'CREATOR', value: 850.25, percentage: 38.0, color: '#8B5CF6' },
          { name: 'STAKE', value: 425.75, percentage: 19.0, color: '#10B981' },
          { name: 'USDC', value: 500.00, percentage: 22.4, color: '#F59E0B' }
        ],
        earnings: [
          { month: 'Jun', staking: 125.50, rewards: 89.25, trading: 45.75 },
          { month: 'Jul', staking: 156.75, rewards: 112.80, trading: 67.20 },
          { month: 'Aug', staking: 189.30, rewards: 134.50, trading: 78.90 },
          { month: 'Sep', staking: 234.80, rewards: 167.25, trading: 92.15 },
          { month: 'Oct', staking: 278.45, rewards: 198.60, trading: 105.30 }
        ],
        summary: {
          totalValue: 2234.75,
          totalChange: 6.95,
          totalEarnings: 1456.80,
          bestPerformer: 'STAKE',
          worstPerformer: 'XLM'
        }
      };

      setPortfolioData(mockData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [timeframe]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(2)}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {typeof entry?.value === 'number' ? formatCurrency(entry?.value) : entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPerformanceChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={portfolioData?.performance}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `$${value?.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="var(--color-primary)" 
          strokeWidth={2}
          dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderDistributionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={portfolioData?.distribution}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
        >
          {portfolioData?.distribution?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderEarningsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={portfolioData?.earnings}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="month" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="staking" fill="var(--color-primary)" name="Staking" />
        <Bar dataKey="rewards" fill="var(--color-secondary)" name="Rewards" />
        <Bar dataKey="trading" fill="var(--color-accent)" name="Trading" />
      </BarChart>
    </ResponsiveContainer>
  );

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Portfolio Analytics</h2>
          <p className="text-sm text-muted-foreground">Investment performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            className="w-32"
          />
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="w-24"
          />
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">
            {formatCurrency(portfolioData?.summary?.totalValue || 0)}
          </p>
          <p className={`text-sm ${
            (portfolioData?.summary?.totalChange || 0) >= 0 ? 'text-success' : 'text-error'
          }`}>
            {formatPercentage(portfolioData?.summary?.totalChange || 0)}
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-card-foreground">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">
            {formatCurrency(portfolioData?.summary?.totalEarnings || 0)}
          </p>
          <p className="text-sm text-muted-foreground">All time</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-sm font-medium text-card-foreground">Best Performer</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">
            {portfolioData?.summary?.bestPerformer || 'N/A'}
          </p>
          <p className="text-sm text-success">+12.5% this week</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-card-foreground">Needs Attention</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">
            {portfolioData?.summary?.worstPerformer || 'N/A'}
          </p>
          <p className="text-sm text-error">-2.1% this week</p>
        </div>
      </div>
      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-card-foreground">
            {chartTypeOptions?.find(opt => opt?.value === chartType)?.label} Chart
          </h3>
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {timeframeOptions?.find(opt => opt?.value === timeframe)?.label}
            </span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          {chartType === 'performance' && renderPerformanceChart()}
          {chartType === 'distribution' && renderDistributionChart()}
          {chartType === 'earnings' && renderEarningsChart()}
        </div>
      </div>
      {/* Distribution Legend (for pie chart) */}
      {chartType === 'distribution' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioData?.distribution?.map((item) => (
            <div key={item?.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {item?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item?.percentage}% • {formatCurrency(item?.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
        <Button variant="outline" size="sm" iconName="Download">
          Export Report
        </Button>
        <Button variant="outline" size="sm" iconName="Settings">
          Configure Alerts
        </Button>
        <Button variant="outline" size="sm" iconName="RefreshCw">
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;