/**
 * seed-to-keypairs.js
 *
 * This example shows how to generate multiple key pairs from a seed.
 * If you want to generate more key pairs, you can reduce the seed length
 * and increase the pad length in the loop index (e.g., padStart())
 * to allow for a larger range of values.
 */

const SASEUL = require('saseul');

// Generate a random 60-character hexadecimal string to use as the seed
let seed = SASEUL.Sign.privateKey().slice(0, -4);

// Create multiple key pairs by appending an index to the seed
for (let i = 0; i < 5; i++) {
    // Combine the seed with a 4-digit hexadecimal index
    let base = seed + i.toString(16).padStart(4, '0');

    // Hash the combined string to derive a private key
    let private_key = SASEUL.Enc.hash(base);

    // Generate the public key from the private key
    let public_key = SASEUL.Sign.publicKey(private_key);

    // Generate the address from the public key
    let address = SASEUL.Sign.address(public_key);

    console.log("Derived Private Key:", private_key);
    console.log("Derived Public Key:", public_key);
    console.log("Derived Address:", address);
}