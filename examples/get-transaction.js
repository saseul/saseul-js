/**
 * get-transaction.js
 *
 * Demonstrates a testnet flow:
 * 1) Request SL from the Faucet
 * 2) Check the Faucet transaction status
 * 3) Retrieve the sender's balance
 * 4) Send SL to another address
 * 5) Check the Send transaction status
 * 6) Retrieve both final balances
 */

const SASEUL = require('saseul');

(async () => {
    // Set testnet endpoints
    const endpoints = ['test.saseul.net'];
    SASEUL.Rpc.endpoints(endpoints);

    // Generate two key pairs: sender (from_keypair) and recipient (to_keypair)
    const from_keypair = SASEUL.Sign.keyPair();
    const to_keypair = SASEUL.Sign.keyPair();

    // Extract private key and addresses
    const from_private_key = from_keypair.private_key;
    const from_address = from_keypair.address;
    const to_address = to_keypair.address;

    console.log("Sender address (Faucet requested):", from_address);
    console.log("Recipient address:", to_address);

    // 1) Prepare Faucet transaction (to get SL)
    const faucet_tx = {
        type: "Faucet",
        from: from_address,
        timestamp: SASEUL.Util.uceiltime() + 1000000
    };
    const faucet_txhash = SASEUL.Enc.txHash(faucet_tx);
    const signed_faucet_tx = SASEUL.Rpc.signedTransaction(faucet_tx, from_private_key);

    console.log("Faucet transaction hash:", faucet_txhash);

    // Broadcast Faucet transaction
    try {
        const response = await SASEUL.Rpc.broadcastTransaction(signed_faucet_tx);
        console.log("Faucet broadcast response:");
        console.dir(response);
    } catch (error) {
        throw new Error(error);
    }

    // 2) Check Faucet transaction status
    const get_faucet = {
        type: "GetTransaction",
        target: faucet_txhash,
    };
    const signed_get_faucet = SASEUL.Rpc.signedRequest(get_faucet, SASEUL.Sign.privateKey());
    let faucet_found = false;

    for (let i = 0; i < 10; i++) {
        try {
            const response = await SASEUL.Rpc.raceRequest(signed_get_faucet);
            if (response && response.data && response.data.transaction) {
                console.log("Faucet transaction found:");
                console.dir(response);
                faucet_found = true;
                break;
            } else {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    if (!faucet_found) {
        throw new Error('Could not find Faucet transaction after 10 attempts.');
    }

    // 3) Retrieve the sender's balance
    const balance_1 = {
        type: "GetBalance",
        address: from_address,
    };
    const signed_balance_1 = SASEUL.Rpc.signedRequest(balance_1, SASEUL.Sign.privateKey());
    try {
        const response = await SASEUL.Rpc.raceRequest(signed_balance_1);
        console.log("Sender's balance after Faucet:");
        console.dir(response);
    } catch (error) {
        throw new Error(error);
    }

    // 4) Prepare Send transaction (transfer SL to recipient)
    const send_tx = {
        type: "Send",
        from: from_address,
        to: to_address,
        amount: '1234' + '000000000000000000',  // Example amount
        timestamp: SASEUL.Util.uceiltime() + 1000000
    };
    const send_txhash = SASEUL.Enc.txHash(send_tx);
    const signed_send_tx = SASEUL.Rpc.signedTransaction(send_tx, from_private_key);

    console.log("Send transaction hash:", send_txhash);

    // Broadcast Send transaction
    try {
        const response = await SASEUL.Rpc.broadcastTransaction(signed_send_tx);
        console.log("Send broadcast response:");
        console.dir(response);
    } catch (error) {
        throw new Error(error);
    }

    // 5) Check Send transaction status
    const get_send = {
        type: "GetTransaction",
        target: send_txhash,
    };
    const signed_get_send = SASEUL.Rpc.signedRequest(get_send, SASEUL.Sign.privateKey());
    let send_found = false;

    for (let i = 0; i < 10; i++) {
        try {
            const response = await SASEUL.Rpc.raceRequest(signed_get_send);
            if (response && response.data && response.data.transaction) {
                console.log("Send transaction found:");
                console.dir(response);
                send_found = true;
                break;
            } else {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    if (!send_found) {
        throw new Error('Could not find Send transaction after 10 attempts.');
    }

    // 6) Retrieve final balances of both addresses
    const balance_2 = {
        type: "GetBalance",
        address: from_address,
    };
    const signed_balance_2 = SASEUL.Rpc.signedRequest(balance_2, SASEUL.Sign.privateKey());
    try {
        const response = await SASEUL.Rpc.raceRequest(signed_balance_2);
        console.log("Final balance of sender:", from_address);
        console.dir(response);
    } catch (error) {
        throw new Error(error);
    }

    const balance_3 = {
        type: "GetBalance",
        address: to_address,
    };
    const signed_balance_3 = SASEUL.Rpc.signedRequest(balance_3, SASEUL.Sign.privateKey());
    try {
        const response = await SASEUL.Rpc.raceRequest(signed_balance_3);
        console.log("Final balance of recipient:", to_address);
        console.dir(response);
    } catch (error) {
        throw new Error(error);
    }
})();
