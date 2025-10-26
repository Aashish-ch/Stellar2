import { Server } from '@stellar/stellar-sdk';
import { Contract } from '@stellar/stellar-sdk/lib/soroban';
import { useWallet } from '../contexts/WalletContext';
import { TransactionManager } from './TransactionManager';

export class VideoShareManager {
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

  async createOffering(sourcePublicKey, videoId, totalShares, basePrice, priceIncrement, saleDurationDays) {
    const operation = this.contract.call(
      'create_offering',
      videoId,
      totalShares.toString(),
      basePrice.toString(),
      priceIncrement.toString(),
      saleDurationDays
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  async buyShares(sourcePublicKey, videoId, sharesToBuy) {
    const operation = this.contract.call(
      'buy_shares',
      videoId,
      sharesToBuy.toString()
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  async depositRevenue(sourcePublicKey, videoId, amount) {
    const operation = this.contract.call(
      'deposit_revenue',
      videoId,
      amount.toString()
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  async claimRevenue(sourcePublicKey, videoId) {
    const operation = this.contract.call(
      'claim_revenue',
      videoId
    );

    return this.transactionManager.executeTransaction(sourcePublicKey, [operation]);
  }

  // View functions - these don't require signing
  async getOffering(videoId) {
    return this.contract.call('get_offering', videoId);
  }

  async getInvestments(videoId) {
    return this.contract.call('get_investments', videoId);
  }

  async getRevenue(videoId) {
    return this.contract.call('get_revenue', videoId);
  }

  async getCurrentPrice(videoId) {
    return this.contract.call('get_current_price', videoId);
  }
}

// React hook for easy contract interactions
export function useVideoShare(contractId) {
  const { publicKey, isWalletConnected } = useWallet();
  const manager = new VideoShareManager(
    contractId,
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE,
    process.env.NEXT_PUBLIC_HORIZON_URL
  );

  const isReady = isWalletConnected && publicKey;

  return {
    isReady,
    createOffering: async (videoId, totalShares, basePrice, priceIncrement, saleDurationDays) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.createOffering(publicKey, videoId, totalShares, basePrice, priceIncrement, saleDurationDays);
    },
    buyShares: async (videoId, sharesToBuy) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.buyShares(publicKey, videoId, sharesToBuy);
    },
    depositRevenue: async (videoId, amount) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.depositRevenue(publicKey, videoId, amount);
    },
    claimRevenue: async (videoId) => {
      if (!isReady) throw new Error('Wallet not connected');
      await manager.setupContract();
      return manager.claimRevenue(publicKey, videoId);
    },
    getOffering: async (videoId) => {
      await manager.setupContract();
      return manager.getOffering(videoId);
    },
    getInvestments: async (videoId) => {
      await manager.setupContract();
      return manager.getInvestments(videoId);
    },
    getRevenue: async (videoId) => {
      await manager.setupContract();
      return manager.getRevenue(videoId);
    },
    getCurrentPrice: async (videoId) => {
      await manager.setupContract();
      return manager.getCurrentPrice(videoId);
    }
  };
}
