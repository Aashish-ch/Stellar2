import { test, expect } from '@jest/globals';
import { soroban } from '@stellar/stellar-sdk';
import { LiveStreamContract } from '../src/live_stream';

describe('Live Stream Contract Tests', () => {
  let contract;
  let testEnv;
  let creator;
  let investor;

  beforeEach(async () => {
    testEnv = new soroban.Server('local');
    const { keypair: creatorKey } = await testEnv.createAccount();
    const { keypair: investorKey } = await testEnv.createAccount();
    
    creator = creatorKey;
    investor = investorKey;

    // Deploy contract
    const { contractId } = await testEnv.deployContract(LiveStreamContract);
    contract = new soroban.Contract(contractId, LiveStreamContract.spec);
  });

  test('create_stream_offering should initialize stream', async () => {
    const streamId = Buffer.from('test-stream-1').toString('base64');
    const totalShares = 1000;
    const basePrice = 100;
    const maxPrice = 1000;
    const preLiveDurationHours = 12;
    const streamStart = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

    await contract.call(
      'create_stream_offering',
      streamId,
      totalShares,
      basePrice,
      maxPrice,
      preLiveDurationHours,
      streamStart
    ).sign(creator);

    const offering = await contract.call('get_offering', streamId);
    expect(offering).toBeTruthy();
    expect(offering.totalShares).toBe(totalShares);
    expect(offering.basePrice).toBe(basePrice);
    expect(offering.maxPrice).toBe(maxPrice);
  });

  test('buy_shares should fail after stream starts', async () => {
    const streamId = Buffer.from('test-stream-2').toString('base64');
    const streamStart = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

    // Create offering
    await contract.call(
      'create_stream_offering',
      streamId,
      1000,
      100,
      1000,
      12,
      streamStart
    ).sign(creator);

    // Try to buy shares after stream started
    await expect(
      contract.call(
        'buy_shares',
        streamId,
        100
      ).sign(investor)
    ).rejects.toThrow('Stream has started');
  });

  test('price should increase during pre-live period', async () => {
    const streamId = Buffer.from('test-stream-3').toString('base64');
    const basePrice = 100;
    const maxPrice = 1000;
    const preLiveDurationHours = 12;
    const streamStart = Math.floor(Date.now() / 1000) + 43200; // 12 hours from now

    // Create offering
    await contract.call(
      'create_stream_offering',
      streamId,
      1000,
      basePrice,
      maxPrice,
      preLiveDurationHours,
      streamStart
    ).sign(creator);

    // Get initial price
    const initialPrice = await contract.call('get_current_price', streamId);
    expect(initialPrice).toBe(basePrice);

    // Fast forward 6 hours (halfway through pre-live)
    await testEnv.advanceTime(21600);

    // Get new price
    const midPrice = await contract.call('get_current_price', streamId);
    expect(midPrice).toBeGreaterThan(initialPrice);
    expect(midPrice).toBeLessThan(maxPrice);
  });

  test('get_stream_status should return correct status', async () => {
    const streamId = Buffer.from('test-stream-4').toString('base64');
    const streamStart = Math.floor(Date.now() / 1000) + 43200; // 12 hours from now

    // Create offering
    await contract.call(
      'create_stream_offering',
      streamId,
      1000,
      100,
      1000,
      12,
      streamStart
    ).sign(creator);

    // Check initial status
    let status = await contract.call('get_stream_status', streamId);
    expect(status).toBe('UPCOMING');

    // Fast forward to pre-live period
    await testEnv.advanceTime(21600); // 6 hours
    status = await contract.call('get_stream_status', streamId);
    expect(status).toBe('PRE_LIVE');

    // Fast forward to live
    await testEnv.advanceTime(21600); // another 6 hours
    status = await contract.call('get_stream_status', streamId);
    expect(status).toBe('LIVE');
  });
});
