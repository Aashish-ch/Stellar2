import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const transactionsPerPage = 10;

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'swap', label: 'Token Swaps' },
    { value: 'stake', label: 'Stakes' },
    { value: 'unstake', label: 'Unstakes' },
    { value: 'purchase', label: 'Purchases' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'reward', label: 'Rewards' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  useEffect(() => {
    // Simulate fetching transaction history
    const fetchTransactions = () => {
      const mockTransactions = [
        {
          id: 'TX001',
          type: 'swap',
          description: 'Swapped 100 XLM for 714 CREATOR',
          amount: '-100 XLM, +714 CREATOR',
          status: 'completed',
          timestamp: new Date(Date.now() - 3600000),
          hash: 'GDXN...K7M2',
          fee: '0.00001 XLM',
          blockchainUrl: 'https://stellar.expert/explorer/testnet/tx/example1'
        },
        {
          id: 'TX002',
          type: 'stake',
          description: 'Staked in TechGuru\'s video "React Best Practices"',
          amount: '-500 CREATOR',
          status: 'completed',
          timestamp: new Date(Date.now() - 7200000),
          hash: 'ABCD...EF12',
          fee: '0.00001 XLM',
          blockchainUrl: 'https://stellar.expert/explorer/testnet/tx/example2'
        },
        {
          id: 'TX003',
          type: 'purchase',
          description: 'Redeemed TechGuru Signed Mousepad',
          amount: '-500 CREATOR',
          status: 'completed',
          timestamp: new Date(Date.now() - 10800000),
          hash: 'WXYZ...9876',
          fee: '0.00001 XLM',
          blockchainUrl: 'https://stellar.expert/explorer/testnet/tx/example3'
        },
        {
          id: 'TX004',
          type: 'reward',
          description: 'Staking reward from CodeMaster_Pro',
          amount: '+125.50 STAKE',
          status: 'completed',
          timestamp: new Date(Date.now() - 14400000),
          hash: 'QRST...5432',
          fee: '0.00001 XLM',
          blockchainUrl: 'https://stellar.expert/explorer/testnet/tx/example4'
        },
        {
          id: 'TX005',
          type: 'transfer',
          description: 'Sent XLM to GDXN...K7M2',
          amount: '-50 XLM',
          status: 'pending',
          timestamp: new Date(Date.now() - 1800000),
          hash: 'MNOP...1234',
          fee: '0.00001 XLM',
          blockchainUrl: null
        },
        {
          id: 'TX006',
          type: 'unstake',
          description: 'Unstaked from GameDev_Master\'s stream',
          amount: '+300 CREATOR, +45.75 STAKE',
          status: 'completed',
          timestamp: new Date(Date.now() - 21600000),
          hash: 'IJKL...7890',
          fee: '0.00001 XLM',
          blockchainUrl: 'https://stellar.expert/explorer/testnet/tx/example6'
        },
        {
          id: 'TX007',
          type: 'swap',
          description: 'Swapped 200 STAKE for 173 CREATOR',
          amount: '-200 STAKE, +173 CREATOR',
          status: 'failed',
          timestamp: new Date(Date.now() - 25200000),
          hash: null,
          fee: '0.00001 XLM',
          blockchainUrl: null,
          errorMessage: 'Insufficient liquidity'
        }
      ];

      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search and filters
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered?.filter(tx => 
        tx?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        tx?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        tx?.hash?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered?.filter(tx => tx?.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered?.filter(tx => tx?.status === filterStatus);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchTerm, filterType, filterStatus]);

  const getTypeIcon = (type) => {
    const icons = {
      swap: 'ArrowRightLeft',
      stake: 'TrendingUp',
      unstake: 'TrendingDown',
      purchase: 'ShoppingCart',
      transfer: 'Send',
      reward: 'Gift'
    };
    return icons?.[type] || 'Activity';
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-success',
      pending: 'text-warning',
      failed: 'text-error'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: 'CheckCircle',
      pending: 'Clock',
      failed: 'XCircle'
    };
    return icons?.[status] || 'Circle';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const paginatedTransactions = filteredTransactions?.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions?.length / transactionsPerPage);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5]?.map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
              </div>
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
          <h2 className="text-xl font-semibold text-card-foreground">Transaction History</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTransactions?.length} transactions found
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="Download">
          Export
        </Button>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
        />
        <Select
          options={typeOptions}
          value={filterType}
          onChange={setFilterType}
          placeholder="Filter by type"
        />
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={setFilterStatus}
          placeholder="Filter by status"
        />
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getTypeIcon(transaction?.type)} size={16} />
                    <span className="text-sm font-medium capitalize">
                      {transaction?.type}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {transaction?.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {transaction?.id}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-mono text-card-foreground">
                    {transaction?.amount}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getStatusIcon(transaction?.status)} 
                      size={14} 
                      className={getStatusColor(transaction?.status)}
                    />
                    <span className={`text-sm font-medium capitalize ${getStatusColor(transaction?.status)}`}>
                      {transaction?.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(transaction?.timestamp)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {transaction?.blockchainUrl && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="ExternalLink"
                        onClick={() => window.open(transaction?.blockchainUrl, '_blank')}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Copy"
                      onClick={() => navigator.clipboard?.writeText(transaction?.hash || transaction?.id)}
                    >
                      Copy
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedTransactions?.map((transaction) => (
          <div key={transaction?.id} className="bg-muted rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name={getTypeIcon(transaction?.type)} size={16} />
                <span className="text-sm font-medium capitalize">
                  {transaction?.type}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getStatusIcon(transaction?.status)} 
                  size={14} 
                  className={getStatusColor(transaction?.status)}
                />
                <span className={`text-xs font-medium capitalize ${getStatusColor(transaction?.status)}`}>
                  {transaction?.status}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-card-foreground mb-2">
              {transaction?.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-card-foreground">
                {transaction?.amount}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(transaction?.timestamp)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                ID: {transaction?.id}
              </span>
              <div className="flex items-center space-x-2">
                {transaction?.blockchainUrl && (
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="ExternalLink"
                    onClick={() => window.open(transaction?.blockchainUrl, '_blank')}
                  />
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Copy"
                  onClick={() => navigator.clipboard?.writeText(transaction?.hash || transaction?.id)}
                />
              </div>
            </div>
            
            {transaction?.errorMessage && (
              <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                {transaction?.errorMessage}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * transactionsPerPage) + 1} to{' '}
            {Math.min(currentPage * transactionsPerPage, filteredTransactions?.length)} of{' '}
            {filteredTransactions?.length} transactions
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      )}
      {filteredTransactions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' ?'Try adjusting your search or filters' :'Your transaction history will appear here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;