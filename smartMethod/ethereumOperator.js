'use strict'

module.exports = class EthereumOperator {

    /**
     * Generate a SHA3 hash value
     * [Warning] This method may not work on every SASEUL network.
     * @param vars array
     * @returns {{$sha3: *[]}}
     */
    static sha3(vars = [])
    {
        return {"$sha3": vars};
    }

    /**
     * Verify signature
     * [Warning] This method may not work on every SASEUL network.
     * @param obj object
     * @param public_key string
     * @param signature string
     * @returns {{$eth_sign_verify: string[]}}
     */
    static eth_sign_verify(obj = null, public_key = '', signature = '')
    {
        return {"$eth_sign_verify": [obj, public_key, signature]};
    }

    static eth_public_key(private_key = '')
    {
        return {"$eth_public_key": [private_key]};
    }

    static eth_address(public_key = '')
    {
        return {"$eth_address": [public_key]};
    }
}