'use strict'
const Signer = require('../util/signer');
const SignedData = require('./signedData');
const Common = require('../core/common');
const PHP = require('../php/php');

module.exports = class SignedTransaction extends SignedData {

    validity = null;

    constructor(item) {
        super();
        try {
            this.data = item.transaction ?? null;
            this.public_key = item.public_key ?? null;
            this.signature = item.signature ?? null;
            this.type = item.type ?? null;
            this.timestamp = item.timestamp ?? null;
            this.hash = this.Hash();

            this.Validity(true);

        } catch (e) {
            throw e;
        }
    }

    Signature(signature) {
        this.signature = signature ?? this.signature;
        return this.signature;
    }


    Validity(force = false) {
        try {
            // already checked validity;
            if (force === false && this.validity !== null) {
                return this.validity;
            }

            if (this.data === null) {
                return this.validity = Common.FailResult('The signed transaction must contain the "transaction" parameter. ');
            }

            if (this.public_key === null) {
                return this.validity = Common.FailResult('The signed transaction must contain the "public_key" parameter. ');
            }

            if (typeof this.public_key !== 'string') {
                return this.validity = Common.FailResult('Parameter "public_key" must be of string type. ');
            }

            if (!Signer.KeyValidity(this.public_key)) {
                return this.validity = Common.FailResult('Invalid public key: ' + this.public_key);
            }

            if (this.signature === null) {
                return this.validity = Common.FailResult('The signed transaction must contain the "signature" parameter. ');
            }

            if (typeof this.signature !== 'string') {
                return this.validity = Common.FailResult('Parameter "signature" must be of string type. ');
            }

            if (this.type === null) {
                return this.validity = Common.FailResult('The signed transaction must contain the "transaction.type" parameter. ');
            }

            if (typeof this.type !== 'string') {
                return this.validity = Common.FailResult('Parameter "transaction.type" must be of string type. ');
            }

            if (this.timestamp === null) {
                return this.validity = Common.FailResult('The signed transaction must contain the "transaction.timestamp" parameter. ');
            }

            if (!PHP.is_int(this.timestamp)) {
                return this.validity = Common.FailResult('Parameter "transaction.timestamp" must be of integer type. ');
            }

            if (!Signer.SignatureValidity(this.hash, this.public_key, this.signature)) {
                return this.validity = Common.FailResult('Invalid signature: ' + this.signature + ' (transaction hash: ' + this.hash + ')');
            }

            return this.validity = Common.SuccessResult();
        } catch (e) {
            throw e;
        }
    }

    Obj() {
        return {
            "transaction": this.data,
            "public_key": this.public_key,
            "signature": this.signature
        }
    }



}