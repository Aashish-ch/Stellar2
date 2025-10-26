import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TokenSwapInterface = () => {
  const [fromToken, setFromToken] = useState('XLM');
  const [toToken, setToToken] = useState('CREATOR');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);

  const tokenOptions = [
    { value: 'XLM', label: 'Stellar Lumens (XLM)', balance: 1250.50 },
    { value: 'CREATOR', label: 'Creator Token (CREATOR)', balance: 850.25 },
    { value: 'STAKE', label: 'Stake Rewards (STAKE)', balance: 425.75 },
    { value: 'USDC', label: 'USD Coin (USDC)', balance: 500.00 }
  ];

  const slippageOptions = [
    { value: 0.1, label: '0.1%' },
    { value: 0.5, label: '0.5%' },
    { value: 1.0, label: '1.0%' },
    { value: 3.0, label: '3.0%' }
  ];

  useEffect(() => {
    // Simulate exchange rate calculation
    const calculateRate = () => {
      const rates = {
        'XLM-CREATOR': 0.14,
        'XLM-STAKE': 0.10,
        'XLM-USDC': 0.12,
        'CREATOR-XLM': 7.14,
        'CREATOR-STAKE': 0.74,
        'CREATOR-USDC': 0.85,
        'STAKE-XLM': 9.58,
        'STAKE-CREATOR': 1.35,
        'STAKE-USDC': 1.15
      };
      
      const rateKey = `${fromToken}-${toToken}`;
      const rate = rates?.[rateKey] || 1;
      setExchangeRate(rate);
      
      if (fromAmount) {
        const calculatedAmount = parseFloat(fromAmount) * rate;
        setToAmount(calculatedAmount?.toFixed(6));
        setPriceImpact(Math.random() * 2); // Simulate price impact
      }
    };

    if (fromToken !== toToken) {
      calculateRate();
    }
  }, [fromToken, toToken, fromAmount]);

  const handleFromAmountChange = (e) => {
    const value = e?.target?.value;
    setFromAmount(value);
    
    if (value && exchangeRate) {
      const calculatedAmount = parseFloat(value) * exchangeRate;
      setToAmount(calculatedAmount?.toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleMaxAmount = () => {
    const selectedToken = tokenOptions?.find(token => token?.value === fromToken);
    if (selectedToken) {
      setFromAmount(selectedToken?.balance?.toString());
    }
  };

  const executeSwap = async () => {
    setIsSwapping(true);
    
    try {
      // Simulate swap transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Dispatch transaction event
      const event = new CustomEvent('transaction-start', {
        detail: {
          transactionId: `swap_${Date.now()}`,
          type: 'swap',
          amount: `${fromAmount} ${fromToken} → ${toAmount} ${toToken}`,
          recipient: 'Token Swap'
        }
      });
      window.dispatchEvent(event);
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setIsSwapping(false);
    }
  };

  const getTokenBalance = (tokenSymbol) => {
    const token = tokenOptions?.find(t => t?.value === tokenSymbol);
    return token ? token?.balance : 0;
  };

  const isSwapValid = () => {
    return fromAmount && 
           toAmount && 
           parseFloat(fromAmount) > 0 && 
           parseFloat(fromAmount) <= getTokenBalance(fromToken) &&
           fromToken !== toToken;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Token Swap</h2>
          <p className="text-sm text-muted-foreground">Exchange tokens at optimal rates</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-warning" />
          <span className="text-sm text-muted-foreground">Live rates</span>
        </div>
      </div>
      <div className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">From</label>
          <div className="space-y-2">
            <Select
              options={tokenOptions?.filter(token => token?.value !== toToken)}
              value={fromToken}
              onChange={setFromToken}
              placeholder="Select token"
            />
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="xs"
                onClick={handleMaxAmount}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                MAX
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Balance: {getTokenBalance(fromToken)?.toFixed(2)} {fromToken}
            </p>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapTokens}
            className="rounded-full border border-border"
          >
            <Icon name="ArrowUpDown" size={20} />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">To</label>
          <div className="space-y-2">
            <Select
              options={tokenOptions?.filter(token => token?.value !== fromToken)}
              value={toToken}
              onChange={setToToken}
              placeholder="Select token"
            />
            <Input
              type="number"
              placeholder="0.00"
              value={toAmount}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Balance: {getTokenBalance(toToken)?.toFixed(2)} {toToken}
            </p>
          </div>
        </div>

        {/* Exchange Rate Info */}
        {exchangeRate > 0 && fromToken !== toToken && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <span className="text-sm font-medium text-card-foreground">
                1 {fromToken} = {exchangeRate?.toFixed(6)} {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price Impact</span>
              <span className={`text-sm font-medium ${
                priceImpact > 1 ? 'text-warning' : 'text-success'
              }`}>
                {priceImpact?.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Slippage Tolerance</span>
              <Select
                options={slippageOptions}
                value={slippage}
                onChange={setSlippage}
                className="w-20"
              />
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          variant="primary"
          onClick={executeSwap}
          loading={isSwapping}
          disabled={!isSwapValid()}
          iconName="ArrowRightLeft"
          className="w-full"
        >
          {isSwapping ? 'Swapping...' : 'Swap Tokens'}
        </Button>

        {/* Warning Messages */}
        {priceImpact > 3 && (
          <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <p className="text-sm text-warning">High price impact detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenSwapInterface;