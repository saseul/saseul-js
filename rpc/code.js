'use strict'

const Method = require("../model/method");
const ABI = require('../core/abi');

module.exports = class Code {

    // TODO. add methods -> Code.Contracts, Code.Requests, Code.Contract, Code.Request
    SYSTEM_METHODS = ['Genesis', 'Register', 'Grant', 'Revoke', 'Oracle'];

    static #ABI = new ABI();

    static ContractToMethod(code) {
        if(typeof code !== 'object') {
            return null;
        }

        const keys = Object.keys(code);

        if(keys.includes('t')) {
            return new Method(code);
        }

        const newCode = {
            t: code.type ?? 'contract',
            m: '0.2.0',
            n: code.name ?? '',
            v: code.version ?? '1',
            s: code.nonce ?? '',
            w: code.writer ?? '',
            p: code.parameters ?? [],
            e: [],
        };

        const conditions = code.conditions ?? [];
        const updates = code.updates ?? [];

        conditions.forEach(condition => {
            const logic = condition[0] ?? false;
            const errMsg = condition[1] ?? 'Conditional error';
            newCode.e.push(this.#ABI.Condition(logic, errMsg));
        });

        updates.forEach(update => {
            newCode.e.push(update);
        });

        return new Method(newCode);
    }

    static RequestToMethod(code) {
        if(typeof code !== 'object') {
            return null;
        }

        const keys = Object.keys(code);

        if(keys.includes('t')) {
            return new Method(code);
        }

        const newCode = {
            t: code.type ?? 'request',
            m: '0.2.0',
            n: code.name ?? '',
            v: code.version ?? '1',
            s: code.nonce ?? '',
            w: code.writer ?? '',
            p: code.parameters ?? [],
            e: [],
        };

        const conditions = code.conditions ?? [];
        const response = code.response ?? [];

        conditions.forEach(condition => {
            const logic = condition[0] ?? false;
            const errMsg = condition[1] ?? 'Conditional error';
            newCode.e.push(this.#ABI.Condition(logic, errMsg));
        });

        newCode.e.push(this.#ABI.Response(response));

        return new Method(newCode);
    }

}