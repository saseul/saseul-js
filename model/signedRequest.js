'use strict'
const SignedData = require('./signedData');
const Common = require('../core/common');

module.exports = class SignedRequest extends SignedData {

    validity = null;

    constructor(item) {
        try {
            super();
            this.data = item.request ?? null;
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

    Validity(force = false) {
        try {
            // already checked validity;
            if (force === false && this.validity !== null) {
                return this.validity;
            }

            if (this.data === null) {
                return this.validity = Common.FailResult('The request must contain the "request" parameter. ');
            }

            if (this.type === null) {
                return this.validity = Common.FailResult('The request must contain the "request.type" parameter. ');
            }

            if (typeof this.type !== 'string') {
                return this.validity = Common.FailResult('Parameter "request.type" must be of string type. ');
            }

            return this.validity = Common.SuccessResult();
        } catch (e) {
            throw e;
        }
    }

    Obj() {
        return {
            'request': this.data,
            'public_key': this.public_key,
            'signature': this.signature
        }
    }



}