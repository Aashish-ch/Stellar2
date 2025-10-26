const { test } = require('@jest/globals');
const request = require('supertest');
const app = require('../src');
const { User, Watch } = require('../src/models');
const jwt = require('jsonwebtoken');

describe('Backend API Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Setup test database
    await User.sync({ force: true });
    await Watch.sync({ force: true });

    // Create test user
    testUser = await User.create({
      publicKey: 'TESTACC1234567890'
    });

    // Generate auth token
    authToken = jwt.sign(
      { publicKey: testUser.publicKey },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('Authentication Endpoints', () => {
    test('POST /auth/challenge should return challenge', async () => {
      const res = await request(app)
        .post('/auth/challenge')
        .send({ publicKey: testUser.publicKey });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('challenge');
      expect(res.body).toHaveProperty('expiry');
    });

    test('POST /auth/verify should validate signature', async () => {
      // First get a challenge
      const challengeRes = await request(app)
        .post('/auth/challenge')
        .send({ publicKey: testUser.publicKey });

      // Mock signature verification
      const res = await request(app)
        .post('/auth/verify')
        .send({
          publicKey: testUser.publicKey,
          signature: 'mock-valid-signature',
          challenge: challengeRes.body.challenge
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Watch Endpoints', () => {
    test('POST /watch/watch-event should record watch and reward tokens', async () => {
      const res = await request(app)
        .post('/watch/watch-event')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          videoId: 'test-video-1',
          duration: 180 // 3 minutes
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('reward');
    });

    test('GET /watch/history should return watch history', async () => {
      const res = await request(app)
        .get('/watch/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('watches');
      expect(Array.isArray(res.body.watches)).toBeTruthy();
    });

    test('GET /watch/balance should return token balance', async () => {
      const res = await request(app)
        .get('/watch/balance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('balance');
      expect(res.body).toHaveProperty('asset');
    });

    test('GET /watch/swap-rates should return current rates', async () => {
      const res = await request(app)
        .get('/watch/swap-rates');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('asks');
      expect(res.body).toHaveProperty('bids');
    });
  });
});
