import { test, expect } from '@playwright/test';
import { StellarSdk } from '@stellar/stellar-sdk';

test.describe('Steller Create E2E Tests', () => {
  let page;
  let testAccount;

  test.beforeAll(async () => {
    // Setup test account
    const keypair = StellarSdk.Keypair.random();
    testAccount = {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };

    // Fund test account on testnet
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${testAccount.publicKey}`
    );
    expect(response.ok).toBeTruthy();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Mock Freighter wallet
    await page.addInitScript(() => {
      window.freighterApi = {
        isConnected: async () => true,
        getUserPublicKey: async () => testAccount.publicKey,
        signTransaction: async (xdr) => {
          // Sign with test account
          const transaction = StellarSdk.TransactionBuilder.fromXDR(
            xdr,
            StellarSdk.Networks.TESTNET
          );
          transaction.sign(StellarSdk.Keypair.fromSecret(testAccount.secretKey));
          return transaction.toXDR();
        }
      };
    });
  });

  test('Full user flow: connect wallet → buy shares → claim revenue', async () => {
    // Navigate to home page
    await page.goto('http://localhost:3000');

    // Connect wallet
    const connectButton = await page.getByText('Connect Wallet');
    await connectButton.click();

    // Verify wallet connected
    await expect(page.getByText(testAccount.publicKey.slice(0, 4))).toBeVisible();

    // Navigate to video page
    await page.goto('http://localhost:3000/video-watch-page?id=test-video-1');

    // Buy shares
    const buySharesButton = await page.getByText('Buy Shares');
    await buySharesButton.click();

    const shareAmountInput = await page.getByLabel('Number of Shares');
    await shareAmountInput.fill('10');

    const confirmBuyButton = await page.getByText('Confirm Purchase');
    await confirmBuyButton.click();

    // Wait for transaction to complete
    await page.waitForSelector('text=Transaction successful');

    // Simulate creator depositing revenue
    // This would normally be done through the creator dashboard
    const response = await fetch('http://localhost:3001/api/test/deposit-revenue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoId: 'test-video-1',
        amount: '100'
      })
    });
    expect(response.ok).toBeTruthy();

    // Claim revenue
    const claimButton = await page.getByText('Claim Revenue');
    await claimButton.click();

    // Verify claim successful
    await page.waitForSelector('text=Revenue claimed successfully');
  });

  test('Live stream investment flow', async () => {
    // Navigate to live stream page
    await page.goto('http://localhost:3000/live-stream-watch');

    // Connect wallet if not connected
    const walletStatus = await page.getByText(testAccount.publicKey.slice(0, 4));
    if (!walletStatus) {
      const connectButton = await page.getByText('Connect Wallet');
      await connectButton.click();
    }

    // Buy shares in upcoming stream
    const investButton = await page.getByText('Invest Now');
    await investButton.click();

    const shareAmountInput = await page.getByLabel('Number of Shares');
    await shareAmountInput.fill('5');

    const confirmInvestButton = await page.getByText('Confirm Investment');
    await confirmInvestButton.click();

    // Verify investment successful
    await page.waitForSelector('text=Investment successful');

    // Verify price increases as stream start approaches
    const initialPrice = await page.getByTestId('share-price').innerText();
    
    // Wait a minute
    await page.waitForTimeout(60000);
    
    const newPrice = await page.getByTestId('share-price').innerText();
    expect(parseFloat(newPrice)).toBeGreaterThan(parseFloat(initialPrice));
  });

  test('Watch-to-earn and token shop flow', async () => {
    // Navigate to video page
    await page.goto('http://localhost:3000/video-watch-page?id=test-video-2');

    // Connect wallet if not connected
    const walletStatus = await page.getByText(testAccount.publicKey.slice(0, 4));
    if (!walletStatus) {
      const connectButton = await page.getByText('Connect Wallet');
      await connectButton.click();
    }

    // Get initial token balance
    const initialBalance = await page.getByTestId('token-balance').innerText();

    // Watch video for 2 minutes
    await page.waitForTimeout(120000);

    // Verify tokens received
    const newBalance = await page.getByTestId('token-balance').innerText();
    expect(parseFloat(newBalance)).toBeGreaterThan(parseFloat(initialBalance));

    // Navigate to token shop
    await page.goto('http://localhost:3000/token-shop');

    // Swap tokens
    const swapButton = await page.getByText('Swap Tokens');
    await swapButton.click();

    const amountInput = await page.getByLabel('Amount to Swap');
    await amountInput.fill('10');

    const confirmSwapButton = await page.getByText('Confirm Swap');
    await confirmSwapButton.click();

    // Verify swap successful
    await page.waitForSelector('text=Swap successful');
  });
});
