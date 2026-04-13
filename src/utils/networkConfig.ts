export interface Network {
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl?: string;
}

export const NETWORKS = {
  TESTNET: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  MAINNET: {
    networkPassphrase: 'Public Global Stellar Network ; October 2015',
    rpcUrl: 'https://soroban-rpc.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
  },
};

export const DEFAULT_NETWORK = NETWORKS.TESTNET;
