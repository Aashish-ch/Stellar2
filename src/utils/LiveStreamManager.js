import { Server } from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk/lib/soroban';
import { useWallet } from '../contexts/WalletContext';
import { TransactionManager } from './TransactionManager';

export class LiveStreamManager {
  constructor(contractId, networkPassphrase, horizonUrl = 'https://horizon-testnet.stellar.org') {
    this.contractId = contractId;
    this.networkPassphrase = networkPassphrase;
    this.server = new Server(horizonUrl);
    this.transactionManager = new TransactionManager(horizonUrl);
  }

  async setupContract() {
    this.contract = new Contract(this.contractId);
    await this.contract.load(this.server);
  }

  async createStreamOffering(
    sourcePublicKey,
    streamId,
    totalShares,
    basePrice,
    maxPrice,
    preLiveDurationHours,
    streamStartTimestamp
  ) {
    const operation = this.contract.call(
      'create_stream_offering',
      streamId,
      totalShares.toString(),
      basePrice.toString(),
      maxPrice.toString(),
      preLiveDurationHours,
      streamStartTimestamp.toString()
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  async buyShares(sourcePublicKey, streamId, sharesToBuy) {
    const operation = this.contract.call(
      'buy_shares',
      streamId,
      sharesToBuy.toString()
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  async depositRevenue(sourcePublicKey, streamId, amount) {
    const operation = this.contract.call(
      'deposit_revenue',
      streamId,
      amount.toString()
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  // View functions
  async getOffering(streamId) {
    return this.contract.call('get_offering', streamId);
  }

  async getInvestments(streamId) {
    return this.contract.call('get_investments', streamId);
  }

  async getCurrentPrice(streamId) {
    return this.contract.call('get_current_price', streamId);
  }

  async getStreamStatus(streamId) {
    return this.contract.call('get_stream_status', streamId);
  }
}

// React hook for easy contract interactions
export function useLiveStream(contractId) {
  const { publicKey, isWalletConnected } = useWallet();
  const manager = new LiveStreamManager(
    contractId,
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
    process.env.NEXT_PUBLIC_HORIZON_URL
  );

  const isReady = isWalletConnected && publicKey;

  return {
    isReady,
    createStreamOffering: async (streamId, totalShares, basePrice, maxPrice, preLiveDurationHours, streamStartTimestamp) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.createStreamOffering(
        publicKey, 
        streamId, 
        totalShares, 
        basePrice, 
        maxPrice, 
        preLiveDurationHours, 
        streamStartTimestamp
      );
    },
    buyShares: async (streamId, sharesToBuy) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.buyShares(publicKey, streamId, sharesToBuy);
    },
    depositRevenue: async (streamId, amount) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.depositRevenue(publicKey, streamId, amount);
    },
    getOffering: async (streamId) => {
      await manager.setupContract();
      return manager.getOffering(streamId);
    },
    getInvestments: async (streamId) => {
      await manager.setupContract();
      return manager.getInvestments(streamId);
    },
    getCurrentPrice: async (streamId) => {
      await manager.setupContract();
      return manager.getCurrentPrice(streamId);
    },
    getStreamStatus: async (streamId) => {
      await manager.setupContract();
      return manager.getStreamStatus(streamId);
    }
  };
}
