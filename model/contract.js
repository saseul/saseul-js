'use strict'

const Code = require('./code');

module.exports = class Contract extends Code {

    updates;

    constructor(initialInfo = {}) {
        super();
        this.type = 'contract';
        this.version = initialInfo.version ?? '1';
        this.name = initialInfo.name ?? '';
        this.nonce = initialInfo.nonce ?? '';
        this.writer = initialInfo.writer ?? '';
        this.parameters = initialInfo.parameters ?? {};
        this.executions = initialInfo.conditions ?? [];
        this.updates = initialInfo.updates ?? [];
    }

    Compile() {
        let obj = super.Compile();
        obj.updates = this.updates;
        return obj;
    }

    AddUpdate(update) {
        this.updates.push(update);
    }

    Updates(updates = null) {
        this.updates = updates ?? this.updates;

        return this.updates;
    }
}