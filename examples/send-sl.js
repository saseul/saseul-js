/**
 * send-sl.js
 *
 * A simple example of creating and sending a transaction
 * using the SASEUL library in a Node.js environment.
 *
 * If you need to connect to different nodes, you can add or replace
 * addresses in the 'endpoints' array below.
 */

const SASEUL = require('saseul');

// Generate key pairs for sender and receiver
const from_keypair = SASEUL.Sign.keyPair();
const to_keypair = SASEUL.Sign.keyPair();

// Extract the sender's private key
const from_private_key = from_keypair.private_key;

// Sender's address
const from_address = from_keypair.address;

// Receiver's address
const to_address = to_keypair.address;

// Transaction details
const tx = {
    type: "Send",
    from: from_address,
    to: to_address,
    amount: "100000",
    timestamp: SASEUL.Util.uceiltime() + 1000000
};

// Sign the transaction
const signed_tx = SASEUL.Rpc.signedTransaction(tx, from_private_key);

// Node endpoints to connect to
const endpoints = [
    'test.saseul.net'
];

// Set endpoints
SASEUL.Rpc.endpoints(endpoints);

// Broadcast the signed transaction and log the response or error
SASEUL.Rpc.broadcastTransaction(signed_tx)
    .then(response => {
        console.log("Broadcast response:");
        console.dir(response);
    })
    .catch(error => {
        console.error("Broadcast error:", error);
    });
