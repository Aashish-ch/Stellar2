import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const TransactionProgressOverlay = () => {
  const [transactions, setTransactions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Listen for transaction events
    const handleTransactionStart = (event) => {
      const { transactionId, type, amount, recipient } = event?.detail;
      
      const newTransaction = {
        id: transactionId,
        type,
        amount,
        recipient,
        status: 'pending',
        startTime: Date.now(),
        progress: 0,
        hash: null,
        error: null
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      simulateTransactionProgress(transactionId);
    };

    const handleTransactionUpdate = (event) => {
      const { transactionId, status, progress, hash, error } = event?.detail;
      
      setTransactions(prev => prev?.map(tx => 
        tx?.id === transactionId 
          ? { ...tx, status, progress, hash, error }
          : tx
      ));
    };

    window.addEventListener('transaction-start', handleTransactionStart);
    window.addEventListener('transaction-update', handleTransactionUpdate);

    return () => {
      window.removeEventListener('transaction-start', handleTransactionStart);
      window.removeEventListener('transaction-update', handleTransactionUpdate);
    };
  }, []);

  const simulateTransactionProgress = (transactionId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate success or failure
        const success = Math.random() > 0.1; // 90% success rate
        
        setTimeout(() => {
          const event = new CustomEvent('transaction-update', {
            detail: {
              transactionId,
              status: success ? 'success' : 'error',
              progress: 100,
              hash: success ? `TX${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null,
              error: success ? null : 'Transaction failed due to insufficient funds'
            }
          });
          window.dispatchEvent(event);
          
          // Auto-remove successful transactions after 5 seconds
          if (success) {
            setTimeout(() => {
              setTransactions(prev => prev?.filter(tx => tx?.id !== transactionId));
            }, 5000);
          }
        }, 500);
      } else {
        const event = new CustomEvent('transaction-update', {
          detail: {
            transactionId,
            status: 'pending',
            progress: Math.min(progress, 95)
          }
        });
        window.dispatchEvent(event);
      }
    }, 800);
  };

  const removeTransaction = (transactionId) => {
    setTransactions(prev => prev?.filter(tx => tx?.id !== transactionId));
  };

  const retryTransaction = (transaction) => {
    const event = new CustomEvent('transaction-start', {
      detail: {
        transactionId: `${transaction.id}_retry_${Date.now()}`,
        type: transaction.type,
        amount: transaction.amount,
        recipient: transaction.recipient
      }
    });
    window.dispatchEvent(event);
    
    removeTransaction(transaction?.id);
  };

  const getTransactionIcon = (type, status) => {
    if (status === 'success') return 'CheckCircle';
    if (status === 'error') return 'XCircle';
    
    switch (type) {
      case 'stake': return 'TrendingUp';
      case 'unstake': return 'TrendingDown';
      case 'transfer': return 'Send';
      case 'purchase': return 'ShoppingCart';
      default: return 'Activity';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const formatTransactionType = (type) => {
    switch (type) {
      case 'stake': return 'Staking';
      case 'unstake': return 'Unstaking';
      case 'transfer': return 'Transfer';
      case 'purchase': return 'Purchase';
      default: return 'Transaction';
    }
  };

  if (transactions?.length === 0) return null;

  return (
    <>
      {/* Desktop Overlay */}
      <div className="hidden md:block fixed bottom-6 right-6 z-300 w-80">
        <div className="bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span className="text-sm font-medium text-card-foreground">
                Transactions ({transactions?.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              iconName={isMinimized ? "ChevronUp" : "ChevronDown"}
              onClick={() => setIsMinimized(!isMinimized)}
            />
          </div>
          
          {!isMinimized && (
            <div className="max-h-64 overflow-y-auto">
              {transactions?.map((transaction) => (
                <div key={transaction?.id} className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getTransactionIcon(transaction?.type, transaction?.status)} 
                        size={16} 
                        className={getStatusColor(transaction?.status)}
                      />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {formatTransactionType(transaction?.type)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction?.amount} XLM
                        </p>
                      </div>
                    </div>
                    
                    {transaction?.status === 'error' && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="RotateCcw"
                          onClick={() => retryTransaction(transaction)}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="X"
                          onClick={() => removeTransaction(transaction?.id)}
                        />
                      </div>
                    )}
                  </div>
                  
                  {transaction?.status === 'pending' && (
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${transaction?.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Processing... {Math.round(transaction?.progress)}%
                      </p>
                    </div>
                  )}
                  
                  {transaction?.status === 'success' && transaction?.hash && (
                    <div className="space-y-1">
                      <p className="text-xs text-success">Transaction confirmed</p>
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        {transaction?.hash}
                      </p>
                    </div>
                  )}
                  
                  {transaction?.status === 'error' && transaction?.error && (
                    <p className="text-xs text-error">{transaction?.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Mobile Bottom Sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-300 bg-card border-t border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span className="text-sm font-medium text-card-foreground">
                Transactions
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {transactions?.length} active
            </span>
          </div>
          
          <div className="space-y-3">
            {transactions?.slice(0, 2)?.map((transaction) => (
              <div key={transaction?.id} className="flex items-center space-x-3">
                <Icon 
                  name={getTransactionIcon(transaction?.type, transaction?.status)} 
                  size={16} 
                  className={getStatusColor(transaction?.status)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {formatTransactionType(transaction?.type)}
                    </p>
                    <p className="text-xs text-muted-foreground ml-2">
                      {transaction?.amount} XLM
                    </p>
                  </div>
                  
                  {transaction?.status === 'pending' && (
                    <div className="w-full bg-muted rounded-full h-1 mt-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${transaction?.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {transaction?.status === 'success' && (
                    <p className="text-xs text-success">Confirmed</p>
                  )}
                  
                  {transaction?.status === 'error' && (
                    <p className="text-xs text-error">Failed</p>
                  )}
                </div>
                
                {transaction?.status === 'error' && (
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="RotateCcw"
                    onClick={() => retryTransaction(transaction)}
                  />
                )}
              </div>
            ))}
            
            {transactions?.length > 2 && (
              <p className="text-xs text-muted-foreground text-center">
                +{transactions?.length - 2} more transactions
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionProgressOverlay;