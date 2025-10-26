const express = require('express');
const jwt = require('jsonwebtoken');
const StellarSdk = require('@stellar/stellar-sdk');
const { User } = require('../models');
const crypto = require('crypto');

const router = express.Router();

// Store challenges temporarily (should use Redis in production)
const pendingChallenges = new Map();

// Generate a challenge for authentication
router.post('/challenge', async (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }

    // Generate a random challenge
    const challenge = crypto.randomBytes(32).toString('base64');
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store the challenge with expiry
    pendingChallenges.set(publicKey, {
      challenge,
      expiry
    });

    res.json({
      challenge,
      expiry,
      network: process.env.STELLAR_NETWORK || 'TESTNET'
    });
  } catch (error) {
    console.error('Challenge generation error:', error);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

// Verify the signed challenge and authenticate the user
router.post('/verify', async (req, res) => {
  try {
    const { publicKey, signature } = req.body;

    // Get the pending challenge
    const pending = pendingChallenges.get(publicKey);
    if (!pending) {
      return res.status(400).json({ error: 'No pending challenge found' });
    }

    const { challenge, expiry } = pending;

    // Check if challenge has expired
    if (Date.now() > expiry) {
      pendingChallenges.delete(publicKey);
      return res.status(400).json({ error: 'Challenge has expired' });
    }

    // Create KeyPair from public key
    const keyPair = StellarSdk.Keypair.fromPublicKey(publicKey);

    // Verify the signature
    const data = Buffer.from(challenge);
    const signatureBuffer = Buffer.from(signature, 'base64');
    
    const isValid = keyPair.verify(data, signatureBuffer);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    const [user] = await User.findOrCreate({
      where: { publicKey },
      defaults: { lastLogin: new Date() }
    });

    // Update last login
    if (user) {
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { publicKey },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Clear the used challenge
    pendingChallenges.delete(publicKey);

    res.json({
      token,
      user: {
        publicKey: user.publicKey,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
