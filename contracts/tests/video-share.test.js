import { test, expect } from '@jest/globals';
import { soroban } from '@stellar/stellar-sdk';
import { VideoShareContract } from '../src/lib';

describe('Video Share Contract Tests', () => {
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
    const { contractId } = await testEnv.deployContract(VideoShareContract);
    contract = new soroban.Contract(contractId, VideoShareContract.spec);
  });

  test('create_offering should initialize video offering', async () => {
    const videoId = Buffer.from('test-video-1').toString('base64');
    const totalShares = 1000;
    const basePrice = 100;
    const priceIncrement = 10;
    const saleDurationDays = 28;

    await contract.call(
      'create_offering',
      videoId,
      totalShares,
      basePrice,
      priceIncrement,
      saleDurationDays
    ).sign(creator);

    const offering = await contract.call('get_offering', videoId);
    expect(offering).toBeTruthy();
    expect(offering.totalShares).toBe(totalShares);
    expect(offering.basePrice).toBe(basePrice);
  });

  test('buy_shares should reduce available shares', async () => {
    const videoId = Buffer.from('test-video-2').toString('base64');
    const totalShares = 1000;
    const sharesToBuy = 100;

    // Create offering
    await contract.call(
      'create_offering',
      videoId,
      totalShares,
      100,
      10,
      28
    ).sign(creator);

    // Buy shares
    await contract.call(
      'buy_shares',
      videoId,
      sharesToBuy
    ).sign(investor);

    const offering = await contract.call('get_offering', videoId);
    expect(offering.remainingShares).toBe(totalShares - sharesToBuy);
  });

  test('deposit_revenue should update revenue pool', async () => {
    const videoId = Buffer.from('test-video-3').toString('base64');
    const revenueAmount = 1000;

    // Create offering
    await contract.call(
      'create_offering',
      videoId,
      1000,
      100,
      10,
      28
    ).sign(creator);

    // Deposit revenue
    await contract.call(
      'deposit_revenue',
      videoId,
      revenueAmount
    ).sign(creator);

    const revenue = await contract.call('get_revenue', videoId);
    expect(revenue.totalAmount).toBe(revenueAmount);
  });

  test('claim_revenue should distribute correctly', async () => {
    const videoId = Buffer.from('test-video-4').toString('base64');
    const totalShares = 1000;
    const investorShares = 100;
    const revenueAmount = 1000;

    // Create offering
    await contract.call(
      'create_offering',
      videoId,
      totalShares,
      100,
      10,
      28
    ).sign(creator);

    // Buy shares
    await contract.call(
      'buy_shares',
      videoId,
      investorShares
    ).sign(investor);

    // Deposit revenue
    await contract.call(
      'deposit_revenue',
      videoId,
      revenueAmount
    ).sign(creator);

    // Claim revenue
    const claimAmount = await contract.call(
      'claim_revenue',
      videoId
    ).sign(investor);

    // Expected: (investorShares / totalShares) * revenueAmount
    const expectedClaim = Math.floor((investorShares * revenueAmount) / totalShares);
    expect(claimAmount).toBe(expectedClaim);
  });
});
