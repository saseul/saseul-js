'use strict'

module.exports = class BasicOperator {

    static legacy_condition(abi, err_msg ='Conditional error')
    {
        return [abi, err_msg];
    }

    static condition(abi, err_msg ='Conditional error')
    {
        return {"$condition": [abi, err_msg]};
    }

    static response(abi)
    {
        return {"$response": [abi]};
    }

    static weight()
    {
        return {"$weight": []};
    }

    static if(condition = false, ifTrue = null, ifFalse = null)
    {
        return {"$if": [condition, ifTrue, ifFalse]};
    }

    static and(vars = [])
    {
        return {"$and": vars};
    }

    static or(vars = [])
    {
        return {"$or": vars};
    }

    static get(obj = {}, key = '')
    {
        return {"$get": [obj, key]};
    }
}