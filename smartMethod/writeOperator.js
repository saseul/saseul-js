'use strict'

module.exports = class WriteOperator {
    // only contract

    static write_universal(attr = null, key = null, value = null)
    {
        return {"$write_universal": [attr, key, value]};
    }

    static write_local(attr = null, key = null, value = null)
    {
        return {"$write_local": [attr, key, value]};
    }
}