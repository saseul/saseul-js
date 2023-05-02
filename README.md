# SaseulJS - SASEUL Javascript Development Kit

[![NPM Version][npm-version-image]][npm-url]

[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

# Overview

SaseulJS is a toolkit for developing decentralized applications based on the SASEUL blockchain engine.
You can use this toolkit to create and send transactions and requests to the SASEUL network.
You can also create and register smart contracts that operate on the SASEUL network.

If you would like to contact the SASEUL team directly regarding example implementation, please inquire at the following email address.

e-mail: help@artifriends.com

If you need information about SASEUL, you can refer to the link below.

- SASEUL Website: https://saseul.com
- Guardee Wallet: https://applink.guardee.io/
- Block Explorer: https://explorer.saseul.com/
- SASEUL Docs: https://docs.saseul.com/

If you want to install the SASEUL engine, you can refer to the link below.

- Docker: https://hub.docker.com/r/artifriends/saseul-network

# Installation

You can install saseul-js via a package manager:

[NPM](https://www.npmjs.org/):

    $ npm install saseul

...or you can also use it as follows.

Browser:

    <!-- Dependencies: crypto-js, tweetnacl, axios -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/1.0.2/nacl.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.5/axios.min.js"></script>

    <script type="text/javascript" src="saseul.min.js"></script>

# Quick Start

First, please install [node.js.](https://nodejs.org/)

Then, you can use the following command to install [saseul-js.](https://www.npmjs.com/package/saseul)

```shell
$ npm install saseul
```

To create transactions on the SASEUL network, you need to generate an address that can initiate transactions. 

The following example demonstrates how to create a key pair that is used in the SASEUL network.


```nodejs
const SASEUL = require('saseul');

let keypair = SASEUL.Sign.keyPair();

console.dir(keypair);
```

Here is an example output of a generated key pair.

```shell
{
  private_key: 'c3baba5ea51b59c3b213bdac25b25ea75c5e6e5f9f78626757e5f197628aadd6',
  public_key: 'a8a0fb61c8e321592fea67a051f7f73b14fdb86b7974899fa9bf41ed59fe6500',
  address: 'e3a978597ce1429e8d0070c99d1d429fd11c69514e81'
}
```

Now we can use this key pair to create transactions to be sent to the main-net or test-net environment.

The following example is an example of querying a balance in the test-net environment.

When creating your own example, please replace the value of 'private_key' with the key pair you generated.

```javascript
const SASEUL = require('saseul');

(async function () {
    SASEUL.Rpc.endpoint("test.saseul.net");

    let private_key = "c3baba5ea51b59c3b213bdac25b25ea75c5e6e5f9f78626757e5f197628aadd6"
    let address = SASEUL.Sign.address(SASEUL.Sign.publicKey(private_key));

    let signed_request = SASEUL.Rpc.signedRequest({
        "type": "GetBalance",
        "address": address
    }, private_key);

    let result = await SASEUL.Rpc.request(signed_request);
    let balance = result.data.balance;

    console.dir(balance);
}
```

Now the newly generated address has no balance.

For testing purposes, we have deployed a faucet contract on the test-net.

The following example is an example of generating and broadcasting a faucet transaction in the test-net environment.

```javascript
const SASEUL = require('saseul');

(async function () {
    SASEUL.Rpc.endpoint("test.saseul.net");

    let private_key = "c3baba5ea51b59c3b213bdac25b25ea75c5e6e5f9f78626757e5f197628aadd6"
    let address = SASEUL.Sign.address(SASEUL.Sign.publicKey(private_key));

    let signed_request = SASEUL.Rpc.signedTransaction({
        "type": "Faucet"
    }, private_key);

    let result = await SASEUL.Rpc.broadcastTransaction(signed_request);

    console.dir(result);
}
```

After a few seconds, if you check the balance again, you can confirm that the balance has been added.

Now you can send SL to other people.

The following example is an example of generating and broadcasting a transaction that sends 125 SL in the testnet environment.

Since the decimal point of SL is 18 digits, you need to add 18 zeros to the 'amount'.

```javascript
const SASEUL = require('saseul');

(async function () {
    SASEUL.Rpc.endpoint("test.saseul.net");

    let private_key = "c3baba5ea51b59c3b213bdac25b25ea75c5e6e5f9f78626757e5f197628aadd6"
    let address = SASEUL.Sign.address(SASEUL.Sign.publicKey(private_key));

    let signed_request = SASEUL.Rpc.signedTransaction({
        "type": "Send",
        "to": "33f02e5c52f688ba68b5e32ee2e4079df2cf839882aa",
        "amount": "125000000000000000000"
    }, private_key);

    let result = await SASEUL.Rpc.broadcastTransaction(signed_request);

    console.dir(result);
}
```

If you need an example of writing a smart contract, please refer to the following repository.

- Sample contracts: https://github.com/saseul/sample-contracts

# Release Note

- `2.7.0 ~` Compatible with SASEUL(`2.1.6 ~`)
- `< 2.6.10` Compatible with SASEUL(`< 2.1.5`)

# License

[GPL-3.0](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/saseul
[npm-downloads-url]: https://npmcharts.com/compare/saseul?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/saseul
[npm-install-size-url]: https://packagephobia.com/result?p=saseul
[npm-url]: https://npmjs.org/package/saseul
[npm-version-image]: https://badgen.net/npm/v/saseul