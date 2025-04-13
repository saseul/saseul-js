/**
 * getbalance.js
 *
 * Demonstrates how to retrieve the SL balance for a given address on the testnet.
 */

const SASEUL = require('saseul');

// Set testnet endpoints
const endpoints = ['test.saseul.net'];
SASEUL.Rpc.endpoints(endpoints);

// Generate a new key pair if you don't already have one
const keypair = SASEUL.Sign.keyPair();

// Use the generated address or replace it with your existing address
const address = keypair.address;
// const address = '<your_existing_address>';

console.log("Address to check balance:", address);

// Create a request to retrieve the balance
const req = {
    type: "GetBalance",
    address: address,
};

// Sign the request with a random private key
const signed_req = SASEUL.Rpc.signedRequest(req, SASEUL.Sign.privateKey());

// Send the request and log the balance or any errors
SASEUL.Rpc.raceRequest(signed_req)
    .then(response => {
        console.log("Balance response:");
        console.dir(response);
    })
    .catch(error => {
        console.error("Error retrieving balance:", error);
    });
