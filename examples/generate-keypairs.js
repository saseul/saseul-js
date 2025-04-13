/**
 * generate-keypairs.js
 *
 * This example demonstrates how to generate key pairs,
 * validate addresses, and handle each component (private key, public key, and address).
 */

const SASEUL = require('saseul');

// Generate an all-in-one key pair
// This gives you a private key, public key, and address at once.
let keypairs = SASEUL.Sign.keyPair();

console.log("Private Key (combined):", keypairs.private_key);
console.log("Public Key (combined):", keypairs.public_key);
console.log("Address (combined):", keypairs.address);

// Alternatively, generate each item separately
// 1. Private key
let private_key = SASEUL.Sign.privateKey();

// 2. Public key (requires private key as input)
let public_key = SASEUL.Sign.publicKey(private_key);

// 3. Address (requires public key as input)
let address = SASEUL.Sign.address(public_key);

console.log("Private Key (separate):", private_key);
console.log("Public Key (separate):", public_key);
console.log("Address (separate):", address);

// Validate addresses
// 1. Check a correct address
console.log("Is valid address:", SASEUL.Sign.addressValidity(address));

// 2. Check an incorrect address
console.log("Is valid address:", SASEUL.Sign.addressValidity("fc981d82177c3fdc1a41304691d8e53da71eb6848932"));