'use strict'

const Code = require('./code');

module.exports = class Request extends Code {

    response;

    constructor(initialInfo = {}) {
        super();
        this.type = 'request';
        this.version = initialInfo.version ?? '1';
        this.name = initialInfo.name ?? '';
        this.nonce = initialInfo.nonce ?? '';
        this.writer = initialInfo.writer ?? '';
        this.parameters = initialInfo.parameters ?? {};
        this.executions = initialInfo.conditions ?? [];
        this.response = initialInfo.response ?? {};
    }

    Compile() {
        let obj = super.Compile();
        obj.response = this.response;
        return obj;
    }

    Response(response = null) {
        this.response = response ?? this.response;

        return this.response;
    }
}