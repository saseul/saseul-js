# SASEUL JS Examples

This repository contains JavaScript examples demonstrating how to interact 
with the SASEUL network—such as generating key pairs, sending SL, retrieving balances, 
and more. Each file is a self-contained script runnable in Node.js.

## Quick Start
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run a script** (for example):
   ```bash
   node ./generate-keypair.js
   ```
3. **Customize**: Replace addresses or private keys as needed for your environment.

## Example Scripts

- **generate-keypairs.js**  
  Demonstrates how to generate new key pairs.
- **seed-to-keypairs.js**  
  Shows how to extract key pairs from an existing seed.
- **faucet-sl.js**  
  Requests testnet SL from the faucet.
- **send-sl.js**  
  Sends SL on the testnet.
- **getbalance.js**  
  Checks the balance of an account on the testnet.
- **get-transaction.js**  
  Retrieves transaction details on the testnet.

## Additional Notes
- Always be cautious when handling private keys.