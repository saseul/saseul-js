'use strict'

const Code = require('./code');

module.exports = class Method extends Code {

    updates;

    constructor(initialInfo = {}) {
        super();
        this.type = initialInfo.t ?? 'request';
        this.machine = initialInfo.m ?? '0.2.0';
        this.name = initialInfo.n ?? '';
        this.version = initialInfo.v ?? '1';
        this.space = initialInfo.s ?? '';
        this.writer = initialInfo.w ?? '';
        this.parameters = initialInfo.p ?? {};
        this.executions = initialInfo.e ?? [];
    }

    Compile() {
        return {
            t: this.type,
            m: this.machine,
            n: this.name,
            v: this.version,
            s: this.space,
            w: this.writer,
            p: this.parameters,
            e: this.executions,
        }
    }

    Json() {
        return JSON.stringify(this.Compile());
    }
}