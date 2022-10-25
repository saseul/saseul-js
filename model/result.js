'use strict'
const Code = require('../code');

module.exports = class Result {

    code = Code.OK;
    data = null;
    items = {};

    constructor(data = null) {
        this.data = data ?? this.data;
    }


    Code(code = null) {
        this.code = code ?? this.code;

        return this.code;
    }

    Data(data = null) {
        this.data = data ?? this.data;

        return this.data;
    }

    Item(key, value = null) {
        if (value === null) {
            if (this.items[key]) {
                return this.items[key];
            }

            return null;
        }

        this.items[key] = value;

        return value;
    }

    Obj() {
        let obj = { 'code': this.code };

        if (this.data !== null) obj['data'] = this.data;

        for (const key in this.items) {
            obj[key] = this.items[key];
        }

        return obj;
    }

    Json() {
        return JSON.stringify(this.Obj());
    }
}