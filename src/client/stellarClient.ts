import { 
  SorobanRpc, 
  Transaction, 
  TransactionBuilder, 
  Account, 
  TimeoutInfinite, 
  xdr, 
  Address, 
  Contract,
  Networks
} from '@stellar/stellar-sdk';
import { Network, DEFAULT_NETWORK } from '../utils/networkConfig';

/**
 * StellarClient handles low-level interactions with the Stellar Soroban RPC.
 */
export class StellarClient {
  public server: SorobanRpc.Server;
  public network: Network;

  constructor(network: Network = DEFAULT_NETWORK) {
    this.network = network;
    this.server = new SorobanRpc.Server(network.rpcUrl);
  }

  /**
   * Fetches the current sequence number for an account.
   */
  async getAccount(publicKey: string): Promise<Account> {
    return await this.server.getAccount(publicKey);
  }

  /**
   * Submits a transaction to the network and waits for results.
   */
  async submitTransaction(transaction: Transaction): Promise<SorobanRpc.Api.GetTransactionResponse> {
    const response = await this.server.sendTransaction(transaction);
    
    if (response.status !== 'PENDING') {
      throw new Error(`Transaction submission failed: ${JSON.stringify(response)}`);
    }

    // Poll for status
    let statusResponse = await this.server.getTransaction(response.hash);
    while (statusResponse.status === 'NOT_FOUND') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      statusResponse = await this.server.getTransaction(response.hash);
    }

    return statusResponse;
  }

  /**
   * Simulates a contract call to estimate fees and results.
   */
  async simulateTransaction(transaction: Transaction): Promise<SorobanRpc.Api.SimulateTransactionResponse> {
    return await this.server.simulateTransaction(transaction);
  }

  /**
   * Helper to build a transaction with Soroban specific settings.
   */
  async buildTransaction(sourceAccount: string, memo?: string): Promise<TransactionBuilder> {
    const account = await this.getAccount(sourceAccount);
    return new TransactionBuilder(account, {
      fee: '1000', // Base fee, will be updated by simulation
      networkPassphrase: this.network.networkPassphrase,
      timebounds: { minTime: 0, maxTime: 0 },
    });
  }
}
