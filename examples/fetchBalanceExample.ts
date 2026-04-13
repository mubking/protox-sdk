import { StellarClient, ProtoxVault, NETWORKS } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Example 3: Fetch Vault Balances
 */
async function fetchBalanceExample() {
  const userAddress = process.env.USER_ADDRESS || 'GD... (user public key)';
  const vaultContractAddress = process.env.VAULT_CONTRACT_ID || 'CD... (vault ID)';

  // 1. Setup client
  const client = new StellarClient(NETWORKS.TESTNET);

  // 2. Initialize vault (no wallet needed for read-only)
  const vault = new ProtoxVault(vaultContractAddress, client);

  console.log(`Fetching vault state for user: ${userAddress}...`);

  try {
    // 3. Get user balance
    const balance = await vault.getBalance(userAddress);
    console.log(`User Balance: ${balance.toString()}`);

    // 4. Get total shares in vault
    const totalShares = await vault.getTotalShares();
    console.log(`Total Vault Shares: ${totalShares.toString()}`);

  } catch (error) {
    console.error('Failed to fetch balance:', error);
  }
}

fetchBalanceExample().catch(console.error);

// TODO: Add support for real-time balance updates via events
// TODO: Implement formatted currency display based on token decimals
