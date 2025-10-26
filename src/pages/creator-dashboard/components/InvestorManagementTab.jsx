import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvestorManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('investment');
  const [selectedInvestors, setSelectedInvestors] = useState([]);

  const mockInvestors = [
    {
      id: 1,
      walletAddress: 'GDXN...K7M2',
      fullAddress: 'GDXNKJM7VWXYZ2K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7M2',
      totalInvestment: 2450.75,
      activeStakes: 12,
      totalReturns: 847.32,
      joinDate: '2024-09-15',
      lastActivity: '2024-10-24',
      status: 'active',
      riskLevel: 'medium'
    },
    {
      id: 2,
      walletAddress: 'GABY...N8P4',
      fullAddress: 'GABYKJM7VWXYZ2K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6N8P4',
      totalInvestment: 5200.00,
      activeStakes: 8,
      totalReturns: 1923.45,
      joinDate: '2024-08-22',
      lastActivity: '2024-10-25',
      status: 'active',
      riskLevel: 'high'
    },
    {
      id: 3,
      walletAddress: 'GCDE...R5T6',
      fullAddress: 'GCDEKJM7VWXYZ2K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6R5T6',
      totalInvestment: 890.25,
      activeStakes: 5,
      totalReturns: 234.67,
      joinDate: '2024-10-01',
      lastActivity: '2024-10-23',
      status: 'active',
      riskLevel: 'low'
    },
    {
      id: 4,
      walletAddress: 'GFGH...U7V8',
      fullAddress: 'GFGHKJM7VWXYZ2K8L9M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6U7V8',
      totalInvestment: 1750.50,
      activeStakes: 3,
      totalReturns: 456.78,
      joinDate: '2024-09-08',
      lastActivity: '2024-10-20',
      status: 'inactive',
      riskLevel: 'medium'
    }
  ];

  const sortOptions = [
    { value: 'investment', label: 'Total Investment' },
    { value: 'returns', label: 'Total Returns' },
    { value: 'stakes', label: 'Active Stakes' },
    { value: 'joinDate', label: 'Join Date' },
    { value: 'lastActivity', label: 'Last Activity' }
  ];

  const filteredInvestors = mockInvestors?.filter(investor => 
      investor?.walletAddress?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      investor?.fullAddress?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )?.sort((a, b) => {
      switch (sortBy) {
        case 'investment':
          return b?.totalInvestment - a?.totalInvestment;
        case 'returns':
          return b?.totalReturns - a?.totalReturns;
        case 'stakes':
          return b?.activeStakes - a?.activeStakes;
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate);
        case 'lastActivity':
          return new Date(b.lastActivity) - new Date(a.lastActivity);
        default:
          return 0;
      }
    });

  const handleSelectInvestor = (investorId) => {
    setSelectedInvestors(prev => 
      prev?.includes(investorId)
        ? prev?.filter(id => id !== investorId)
        : [...prev, investorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvestors?.length === filteredInvestors?.length) {
      setSelectedInvestors([]);
    } else {
      setSelectedInvestors(filteredInvestors?.map(investor => investor?.id));
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-success' : 'text-muted-foreground';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalInvestment = filteredInvestors?.reduce((sum, investor) => sum + investor?.totalInvestment, 0);
  const totalReturns = filteredInvestors?.reduce((sum, investor) => sum + investor?.totalReturns, 0);
  const activeInvestors = filteredInvestors?.filter(investor => investor?.status === 'active')?.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Investors</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{filteredInvestors?.length}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="UserCheck" size={20} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Active Investors</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{activeInvestors}</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Total Investment</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalInvestment?.toLocaleString()} XLM</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={20} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Total Returns</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalReturns?.toLocaleString()} XLM</p>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search by wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-full sm:w-48"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" iconName="Download">
            Export
          </Button>
          <Button variant="outline" iconName="Mail">
            Message Selected
          </Button>
        </div>
      </div>
      {/* Investor Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedInvestors?.length === filteredInvestors?.length && filteredInvestors?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Investor</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Investment</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Active Stakes</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Returns</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Risk Level</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Activity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestors?.map((investor) => (
                <tr key={investor?.id} className="border-t border-border hover:bg-muted/50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedInvestors?.includes(investor?.id)}
                      onChange={() => handleSelectInvestor(investor?.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground font-mono">{investor?.walletAddress}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {formatDate(investor?.joinDate)}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">{investor?.totalInvestment?.toLocaleString()} XLM</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="TrendingUp" size={14} className="text-primary" />
                      <span className="font-medium text-foreground">{investor?.activeStakes}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-success">+{investor?.totalReturns?.toLocaleString()} XLM</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium capitalize ${getRiskLevelColor(investor?.riskLevel)}`}>
                      {investor?.riskLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${investor?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                      <span className={`text-sm font-medium capitalize ${getStatusColor(investor?.status)}`}>
                        {investor?.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-muted-foreground">{formatDate(investor?.lastActivity)}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="xs" iconName="Eye" />
                      <Button variant="ghost" size="xs" iconName="Mail" />
                      <Button variant="ghost" size="xs" iconName="MoreHorizontal" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredInvestors?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">No investors found</p>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default InvestorManagementTab;