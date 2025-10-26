import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TransactionHistoryTable = ({ walletConnected }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (walletConnected) {
      fetchTransactionHistory();
    }
  }, [walletConnected]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType]);

  const fetchTransactionHistory = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTransactions = [
        {
          id: 'TX001',
          hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
          type: 'stake',
          amount: '250.00',
          asset: 'XLM',
          recipient: 'TechGuru_2024',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 3600000),
          fee: '0.00001'
        },
        {
          id: 'TX002',
          hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
          type: 'payout',
          amount: '45.75',
          asset: 'XLM',
          recipient: 'Your Wallet',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 7200000),
          fee: '0.00001'
        },
        {
          id: 'TX003',
          hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2',
          type: 'swap',
          amount: '100.00',
          asset: 'CREATOR1',
          recipient: 'Token Swap',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 14400000),
          fee: '0.00001'
        },
        {
          id: 'TX004',
          hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3',
          type: 'transfer',
          amount: '75.50',
          asset: 'XLM',
          recipient: 'GDXN...K7M2',
          status: 'pending',
          timestamp: new Date(Date.now() - 1800000),
          fee: '0.00001'
        },
        {
          id: 'TX005',
          hash: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4',
          type: 'unstake',
          amount: '150.00',
          asset: 'XLM',
          recipient: 'CryptoQueen',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 21600000),
          fee: '0.00001'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered?.filter(tx => tx?.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered?.filter(tx => 
        tx?.hash?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        tx?.recipient?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        tx?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'stake': return 'TrendingUp';
      case 'unstake': return 'TrendingDown';
      case 'payout': return 'ArrowDownLeft';
      case 'swap': return 'ArrowLeftRight';
      case 'transfer': return 'Send';
      default: return 'Activity';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatTransactionType = (type) => {
    switch (type) {
      case 'stake': return 'Stake';
      case 'unstake': return 'Unstake';
      case 'payout': return 'Payout';
      case 'swap': return 'Token Swap';
      case 'transfer': return 'Transfer';
      default: return 'Transaction';
    }
  };

  const truncateHash = (hash) => {
    return `${hash?.slice(0, 8)}...${hash?.slice(-8)}`;
  };

  const openBlockchainExplorer = (hash) => {
    window.open(`https://stellar.expert/explorer/testnet/tx/${hash}`, '_blank');
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions?.slice(startIndex, startIndex + itemsPerPage);

  if (!walletConnected) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center space-y-4">
          <Icon name="History" size={48} className="text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Transaction History</h3>
            <p className="text-muted-foreground">Connect your wallet to view transaction history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Transaction History</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTransactionHistory}
          loading={isLoading}
          iconName="RefreshCw"
        >
          Refresh
        </Button>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'stake', 'payout', 'swap', 'transfer']?.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type === 'all' ? 'All' : formatTransactionType(type)}
            </Button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-8">
          <Icon name="Loader2" size={32} className="text-muted-foreground animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      ) : filteredTransactions?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Recipient</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Hash</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions?.map((tx) => (
                  <tr key={tx?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <Icon name={getTransactionIcon(tx?.type)} size={16} />
                        <span className="text-sm font-medium text-card-foreground">
                          {formatTransactionType(tx?.type)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">{tx?.amount} {tx?.asset}</p>
                        <p className="text-xs text-muted-foreground">Fee: {tx?.fee} XLM</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-sm text-card-foreground truncate max-w-32">{tx?.recipient}</p>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${getStatusColor(tx?.status)}`}>
                        {tx?.status?.charAt(0)?.toUpperCase() + tx?.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-sm text-muted-foreground">
                        {tx?.timestamp?.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx?.timestamp?.toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => openBlockchainExplorer(tx?.hash)}
                        iconName="ExternalLink"
                      >
                        {truncateHash(tx?.hash)}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginatedTransactions?.map((tx) => (
              <div key={tx?.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={getTransactionIcon(tx?.type)} size={16} />
                    <span className="text-sm font-medium text-card-foreground">
                      {formatTransactionType(tx?.type)}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(tx?.status)}`}>
                    {tx?.status?.charAt(0)?.toUpperCase() + tx?.status?.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Amount</span>
                    <span className="text-sm font-semibold text-card-foreground">{tx?.amount} {tx?.asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Recipient</span>
                    <span className="text-sm text-card-foreground truncate max-w-32">{tx?.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Time</span>
                    <span className="text-sm text-muted-foreground">
                      {tx?.timestamp?.toLocaleDateString()} {tx?.timestamp?.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Hash</span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => openBlockchainExplorer(tx?.hash)}
                      iconName="ExternalLink"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions?.length)} of {filteredTransactions?.length}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  iconName="ChevronLeft"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  iconName="ChevronRight"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistoryTable;