# Protox SDK Architecture Overview

Protox SDK is a modular TypeScript developer toolkit designed for seamless interaction with Protox smart contracts on the Stellar network.

## Core Modules

### 1. **StellarClient**
The `StellarClient` handles low-level communication with the Soroban RPC. It is responsible for:
- Fetching account state and sequence numbers.
- Building and submitting transactions.
- Simulating contract calls for fee estimation and footprint calculation.

### 2. **ProtoxVault**
The `ProtoxVault` class is the primary interface for developers. It abstracts away the complexity of building contract calls into simple, high-level methods:
- `deposit(amount)`
- `withdraw(amount)`
- `getBalance(userAddress)`
- `getTotalShares()`

### 3. **WalletConnector**
The `WalletConnector` manages wallet integrations. It defines a standardized interface for different wallet providers (Freighter, Albedo, private keys) and handles transaction signing.

### 4. **NetworkConfig**
The `NetworkConfig` utility manages the different network endpoints for Stellar Testnet and Mainnet, including RPC URLs and network passphrases.

## Data Flow

1. **Initialization**: Developer initializes `StellarClient` with a target network.
2. **Wallet Connection**: Developer connects a wallet using `WalletConnector`.
3. **Contract Call**: Developer calls a method on `ProtoxVault` (e.g., `deposit`).
4. **Building**: The SDK builds a transaction, simulates it for fees/footprint, and assembles the final transaction.
5. **Signing**: The transaction is sent to the wallet for signing.
6. **Submission**: The signed transaction is submitted via `StellarClient` to the network.
7. **Confirmation**: The SDK polls the RPC until the transaction is confirmed or fails.

## Key Design Principles

- **Modularity**: Every module can be used independently or as part of the full SDK.
- **Type Safety**: Extensive use of TypeScript interfaces for all contract inputs and outputs.
- **Developer Experience**: Heavy focus on abstraction, making blockchain interactions feel like standard API calls.
- **Auditability**: All state-changing actions are clearly logged and follow Stellar's best practices.
