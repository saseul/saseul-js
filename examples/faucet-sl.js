/**
 * faucet-sl.js
 *
 * Demonstrates how to request SL on the testnet using the Faucet method.
 * This will not work on the mainnet.
 */

const SASEUL = require('saseul');

// Generate a new key pair
const keypair = SASEUL.Sign.keyPair();

// Private key of the sender for signing
const private_key = keypair.private_key;
const address = keypair.address;

// Log the generated key pair
console.log("Generated keypair:");
console.dir(keypair);

// Prepare the Faucet transaction
const tx = {
    type: "Faucet",
    from: address,
    timestamp: SASEUL.Util.uceiltime() + 1000000
};

// Sign the transaction using the private key
const signed_tx = SASEUL.Rpc.signedTransaction(tx, private_key);

// Node endpoints to connect to
const endpoints = ['test.saseul.net'];

// Set endpoints
SASEUL.Rpc.endpoints(endpoints);

// Broadcast the signed transaction and log the response or error
SASEUL.Rpc.broadcastTransaction(signed_tx)
    .then(response => {
        console.log("Faucet broadcast response:");
        console.dir(response);
    })
    .catch(error => {
        console.error("Faucet broadcast error:", error);
    });
