'use strict'

module.exports = class ReadOperator {

    static load_param(vars = [])
    {
        return {"$load_param": vars};
    }

    static read_universal(attr = null, key = null, defaultValue = null)
    {
        return {"$read_universal": [attr, key, defaultValue]}
    }

    static read_local(attr = null, key = null, defaultValue = null)
    {
        return {"$read_local": [attr, key, defaultValue]}
    }
}