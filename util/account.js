'use strict'

const Signer = require('./signer');

module.exports = class Account {

    private_key;
    public_key;
    address;

    constructor(private_key = null) {
        try {
            this.Set(private_key);
        } catch (e) {
            throw e;
        }
    }

    Set(private_key = null) {
        try {
            if(private_key === null) private_key = Signer.PrivateKey();

            if(!Signer.KeyValidity(private_key)) throw 'Invalid private key';
            this.private_key = private_key;
            this.public_key = Signer.PublicKey(this.private_key);
            this.address = Signer.Address(this.public_key);

            return {
                private_key: this.private_key,
                public_key: this.public_key,
                address: this.address
            }
        } catch (e) {
            throw e;
        }
    }

    Signature(obj) {
        return Signer.Signature(obj, this.private_key);
    }



}