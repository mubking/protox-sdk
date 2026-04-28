# Wallet Integration Guide

This guide explains how to connect different wallet providers to the Protox SDK for signing transactions on the Stellar network.

---

## Overview

The SDK uses a two-layer wallet system:

- **`WalletSigner`** - a low-level interface any wallet adapter must implement.
- **`WalletConnector`** - a high-level wrapper that connects a signer to the vault.

```typescript
export interface WalletSigner {
  getPublicKey(): Promise<string>;
  signTransaction(txXdr: string, network: string): Promise<string>;
}
```

---

## Option 1: Private Key Wallet (Development Only)

Use `PrivateKeyWallet` for local development and automated testing. Never use a funded mainnet key in code.

```typescript
import { PrivateKeyWallet, WalletConnector } from '@protox/sdk';

const signer = new PrivateKeyWallet(process.env.SECRET_KEY!);
const wallet = new WalletConnector(signer);

const address = await wallet.getAddress();
console.log('Wallet address:', address);
```

**When to use:** Scripts, tests, CI pipelines.
**When to avoid:** Any user-facing application.

---

## Option 2: Freighter Browser Extension

Freighter is the standard Stellar browser wallet. Implement the `WalletSigner` interface using the Freighter API.

### Installation

```bash
npm install @stellar/freighter-api
```

### Adapter

```typescript
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';
import { WalletSigner, WalletConnector, NETWORKS } from '@protox/sdk';

class FreighterWallet implements WalletSigner {
  async getPublicKey(): Promise<string> {
    const connected = await isConnected();
    if (!connected) throw new Error('Freighter is not connected');
    return await getPublicKey();
  }

  async signTransaction(txXdr: string, network: string): Promise<string> {
    return await signTransaction(txXdr, { networkPassphrase: network });
  }
}

const signer = new FreighterWallet();
const wallet = new WalletConnector(signer, NETWORKS.MAINNET);
```

### Checking Freighter Availability

```typescript
import { isConnected, isAllowed } from '@stellar/freighter-api';

async function checkFreighter(): Promise<boolean> {
  const connected = await isConnected();
  if (!connected) { console.warn('Freighter not detected'); return false; }
  const allowed = await isAllowed();
  if (!allowed) { console.warn('Site not authorized by Freighter'); return false; }
  return true;
}
```

---

## Option 3: Albedo Wallet

Albedo is a web-based Stellar transaction signer that works without a browser extension.

### Installation

```bash
npm install @albedo-link/intent
```

### Adapter

```typescript
import albedo from '@albedo-link/intent';
import { WalletSigner, WalletConnector, NETWORKS } from '@protox/sdk';

class AlbedoWallet implements WalletSigner {
  private cachedPublicKey: string | null = null;

  async getPublicKey(): Promise<string> {
    if (this.cachedPublicKey) return this.cachedPublicKey;
    const result = await albedo.publicKey({});
    this.cachedPublicKey = result.pubkey;
    return result.pubkey;
  }

  async signTransaction(txXdr: string, network: string): Promise<string> {
    const result = await albedo.tx({
      xdr: txXdr,
      network: network === NETWORKS.MAINNET.networkPassphrase ? 'public' : 'testnet',
      submit: false,
    });
    return result.signed_envelope_xdr;
  }
}

const signer = new AlbedoWallet();
const wallet = new WalletConnector(signer);
```

---

## Connecting a Wallet to the Vault

```typescript
import { StellarClient, ProtoxVault, NETWORKS } from '@protox/sdk';

const client = new StellarClient(NETWORKS.TESTNET);

// At construction
const vault = new ProtoxVault(process.env.CONTRACT_ADDRESS!, client, wallet);

// Or after construction
const vault = new ProtoxVault(process.env.CONTRACT_ADDRESS!, client);
vault.connect(wallet);
```

Read-only calls (`getBalance`, `getTotalShares`) work without a wallet. State-changing calls (`deposit`, `withdraw`) throw `"Wallet not connected"` if none is attached.

---

## Switching Networks

Ensure your wallet and client always use the same network passphrase.

```typescript
const network = NETWORKS.TESTNET;
const client = new StellarClient(network);
const wallet = new WalletConnector(signer, network);
```

---

## Building a Custom Wallet Adapter

```typescript
import { WalletSigner } from '@protox/sdk';

class MyCustomWallet implements WalletSigner {
  async getPublicKey(): Promise<string> {
    return await myWalletSDK.getAddress();
  }

  async signTransaction(txXdr: string, network: string): Promise<string> {
    return await myWalletSDK.sign(txXdr, network);
  }
}
```

Requirements:
- `getPublicKey()` must return a valid Stellar public key (starts with `G`).
- `signTransaction()` must return a signed transaction envelope in XDR format.
- Both methods must be async.

---

## Error Handling

```typescript
try {
  const result = await vault.deposit(1000n);
} catch (error: any) {
  if (error.message?.includes('Wallet not connected')) {
    console.error('Please connect your wallet first');
  } else if (error.message?.includes('User declined')) {
    console.error('Transaction rejected by user');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

---

## Wallet Comparison

| Feature | PrivateKeyWallet | Freighter | Albedo |
|---|---|---|---|
| Browser extension required | No | Yes | No |
| User approval prompt | No | Yes | Yes |
| Suitable for production | No | Yes | Yes |
| Suitable for testing | Yes | No | No |
| Key stored in code | Yes | No | No |
