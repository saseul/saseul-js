'use strict'
const Hasher = require('../util/hasher');

module.exports = class SignedData {

    data;
    public_key;
    signature;
    hash;
    type;
    timestamp;
    vars = {};

    constructor() {}

    Vars(key, value = null) {
        if (value !== null) {
            this.vars[key] = value;
        }

        return (this.vars[key] ?? (this.data[key] ?? null));
    }

    Obj() {
        return {
            'data': this.data,
            'public_key': this.public_key,
            'signature': this.signature
        };
    }

    Hash() {
        const timestamp = this.timestamp ?? 0;
        return Hasher.TimeHash(Hasher.Hash(this.data), timestamp);
    }

    Json() {
        return JSON.stringify(this.Obj());
    }

    Size() {
        return this.Json().length;
    }


}