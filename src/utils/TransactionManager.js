import * as StellarSdk from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

export class TransactionManager {
  constructor(horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org') {
    this.server = new StellarSdk.Server(horizonUrl);
    this.networkPassphrase = horizonUrl.includes('testnet') 
      ? StellarSdk.Networks.TESTNET 
      : StellarSdk.Networks.PUBLIC;
  }

  async buildTransaction(sourcePublicKey, operations) {
    try {
      const sourceAccount = await this.server.loadAccount(sourcePublicKey);
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      });

      // Add all operations to the transaction
      operations.forEach(operation => {
        transaction.addOperation(operation);
      });

      // Set timeout and build the transaction
      const builtTransaction = transaction
        .setTimeout(30)
        .build();

      return builtTransaction;
    } catch (error) {
      console.error('Error building transaction:', error);
      throw error;
    }
  }

  async signAndSubmit(transaction) {
    try {
      // Get the transaction XDR
      const xdr = transaction.toXDR();

      // Sign the transaction using Freighter
      const signedXDR = await signTransaction(xdr, {
        networkPassphrase: this.networkPassphrase
      });

      // Convert the signed XDR back to a transaction
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        this.networkPassphrase
      );

      // Submit the signed transaction
      const result = await this.server.submitTransaction(signedTransaction);
      return result;
    } catch (error) {
      console.error('Error signing/submitting transaction:', error);
      throw error;
    }
  }

  // Helper method to create a payment operation
  createPaymentOperation(destination, amount, asset = StellarSdk.Asset.native()) {
    return StellarSdk.Operation.payment({
      destination,
      asset,
      amount: amount.toString()
    });
  }

  // Helper method to create a changeTrust operation
  createChangeTrustOperation(asset, limit = '1000000000') {
    return StellarSdk.Operation.changeTrust({
      asset,
      limit
    });
  }

  // Helper method for custom operations
  async executeTransaction(sourcePublicKey, operations) {
    try {
      const transaction = await this.buildTransaction(sourcePublicKey, operations);
      const result = await this.signAndSubmit(transaction);
      return result;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }
}
