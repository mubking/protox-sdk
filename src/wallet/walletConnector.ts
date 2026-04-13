import { Keypair, Transaction, xdr } from '@stellar/stellar-sdk';

/**
 * Interface for wallet adapters (Freighter, Albedo, Private Key, etc.)
 */
export interface WalletSigner {
  getPublicKey(): Promise<string>;
  signTransaction(txXdr: string, network: string): Promise<string>;
}

/**
 * A basic private key wallet implementation for development and testing.
 */
export class PrivateKeyWallet implements WalletSigner {
  private keypair: Keypair;

  constructor(secretKey: string) {
    this.keypair = Keypair.fromSecret(secretKey);
  }

  async getPublicKey(): Promise<string> {
    return this.keypair.publicKey();
  }

  async signTransaction(txXdr: string, network: string): Promise<string> {
    const transaction = new Transaction(txXdr, network);
    transaction.sign(this.keypair);
    return transaction.toXDR();
  }
}

/**
 * WalletConnector manages the connection to different wallet providers.
 */
export class WalletConnector {
  private signer: WalletSigner;

  constructor(signer: WalletSigner) {
    this.signer = signer;
  }

  async getAddress(): Promise<string> {
    return await this.signer.getPublicKey();
  }

  async sign(transaction: Transaction): Promise<Transaction> {
    const signedXdr = await this.signer.signTransaction(
      transaction.toXDR(),
      transaction.networkPassphrase
    );
    return new Transaction(signedXdr, transaction.networkPassphrase);
  }

  // TODO: Add support for Freighter browser extension
  // TODO: Add support for Albedo wallet
  // TODO: Implement session management for persistent wallet connections
}
