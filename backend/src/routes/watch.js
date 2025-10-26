const express = require('express');
const StellarSdk = require('@stellar/stellar-sdk');
const authMiddleware = require('../middleware/auth');
const { Watch, User } = require('../models');

const router = express.Router();

// Asset configuration
const PLATFORM_TOKEN_CODE = process.env.PLATFORM_TOKEN_CODE || 'CST';
const PLATFORM_TOKEN_ISSUER = process.env.PLATFORM_TOKEN_ISSUER;

// Create platform asset
const platformAsset = new StellarSdk.Asset(
  PLATFORM_TOKEN_CODE,
  PLATFORM_TOKEN_ISSUER
);

// Record watch event and reward coins
router.post('/watch-event', authMiddleware, async (req, res) => {
  try {
    const { videoId, duration } = req.body;
    const { publicKey } = req.user;

    if (!videoId || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Record watch event
    await Watch.create({
      userPublicKey: publicKey,
      videoId,
      duration,
      timestamp: new Date()
    });

    // Calculate rewards (example: 1 token per minute watched)
    const rewardAmount = Math.floor(duration / 60);
    
    if (rewardAmount <= 0) {
      return res.status(400).json({ error: 'Watch duration too short for rewards' });
    }

    // Issue tokens to user's account
    const server = new StellarSdk.Server(process.env.HORIZON_URL);
    const sourceKeypair = StellarSdk.Keypair.fromSecret(process.env.PLATFORM_TOKEN_ISSUER_SECRET);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: process.env.NETWORK === 'TESTNET' 
        ? StellarSdk.Networks.TESTNET 
        : StellarSdk.Networks.PUBLIC
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: publicKey,
      asset: platformAsset,
      amount: rewardAmount.toString()
    }))
    .setTimeout(30)
    .build();

    transaction.sign(sourceKeypair);
    await server.submitTransaction(transaction);

    res.json({
      success: true,
      reward: rewardAmount,
      asset: PLATFORM_TOKEN_CODE
    });
  } catch (error) {
    console.error('Watch event error:', error);
    res.status(500).json({ error: 'Failed to process watch event' });
  }
});

// Get user's watch history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { publicKey } = req.user;
    
    const watches = await Watch.findAll({
      where: { userPublicKey: publicKey },
      order: [['timestamp', 'DESC']],
      limit: 50
    });

    res.json({ watches });
  } catch (error) {
    console.error('Watch history error:', error);
    res.status(500).json({ error: 'Failed to fetch watch history' });
  }
});

// Get user's token balance
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const { publicKey } = req.user;
    const server = new StellarSdk.Server(process.env.HORIZON_URL);
    
    const account = await server.loadAccount(publicKey);
    const balance = account.balances.find(b => 
      b.asset_code === PLATFORM_TOKEN_CODE && 
      b.asset_issuer === PLATFORM_TOKEN_ISSUER
    );

    res.json({
      balance: balance ? balance.balance : '0',
      asset: PLATFORM_TOKEN_CODE
    });
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get token swap rates
router.get('/swap-rates', async (req, res) => {
  try {
    // Get current market rates from Stellar DEX
    const server = new StellarSdk.Server(process.env.HORIZON_URL);
    
    const orderbook = await server.orderbook(
      platformAsset,
      StellarSdk.Asset.native()
    ).call();

    res.json({
      asset: PLATFORM_TOKEN_CODE,
      asks: orderbook.asks.slice(0, 5),
      bids: orderbook.bids.slice(0, 5)
    });
  } catch (error) {
    console.error('Swap rates error:', error);
    res.status(500).json({ error: 'Failed to fetch swap rates' });
  }
});

module.exports = router;
