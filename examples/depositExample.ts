import { StellarClient, ProtoxVault, PrivateKeyWallet, WalletConnector, NETWORKS } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Example 1: Deposit tokens into the Protox Vault
 */
async function depositExample() {
  const secretKey = process.env.USER_SECRET || 'SD... (your secret key)';
  const vaultContractAddress = process.env.VAULT_CONTRACT_ID || 'CD... (vault ID)';

  // 1. Setup client and wallet
  const client = new StellarClient(NETWORKS.TESTNET);
  const signer = new PrivateKeyWallet(secretKey);
  const wallet = new WalletConnector(signer);

  // 2. Initialize vault
  const vault = new ProtoxVault(vaultContractAddress, client, wallet);

  console.log(`Depositing tokens for: ${await wallet.getAddress()}...`);

  // 3. Deposit 1000 tokens (adjust units as needed)
  try {
    const result = await vault.deposit(1000n);
    console.log('Deposit success! Transaction Hash:', result.hash);
  } catch (error) {
    console.error('Deposit failed:', error);
  }
}

depositExample().catch(console.error);

// TODO: Add support for custom memos in deposit operations
// TODO: Implement balance check before attempting deposit
