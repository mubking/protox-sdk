import { StellarClient, ProtoxVault, PrivateKeyWallet, WalletConnector, NETWORKS } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Example 2: Withdraw tokens from the Protox Vault
 */
async function withdrawExample() {
  const secretKey = process.env.USER_SECRET || 'SD... (your secret key)';
  const vaultContractAddress = process.env.VAULT_CONTRACT_ID || 'CD... (vault ID)';

  // 1. Setup client and wallet
  const client = new StellarClient(NETWORKS.TESTNET);
  const signer = new PrivateKeyWallet(secretKey);
  const wallet = new WalletConnector(signer);

  // 2. Initialize vault
  const vault = new ProtoxVault(vaultContractAddress, client, wallet);

  console.log(`Withdrawing tokens for: ${await wallet.getAddress()}...`);

  // 3. Withdraw 500 tokens
  try {
    const result = await vault.withdraw(500n);
    console.log('Withdrawal success! Transaction Hash:', result.hash);
  } catch (error) {
    console.error('Withdrawal failed:', error);
  }
}

withdrawExample().catch(console.error);

// TODO: Add support for partial and full withdrawals
// TODO: Implement error handling for insufficient funds
