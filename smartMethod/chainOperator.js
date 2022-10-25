'use strict'

module.exports = class ChainOperator {

    // only request or resource chain
    static get_block(target = null, full = false)
    {
        return {"$get_block": [target, full]};
    }

    static list_block(height = 0, count = 20, sort = -1)
    {
        return {"$list_block": [height, count, sort]};
    }

    static block_count()
    {
        return {"$block_count": []};
    }

    static get_transaction(target = null)
    {
        return {"$get_transaction": [target]};
    }

    static list_transaction(page = 1, count = 20, address = null)
    {
        return {"$list_transaction": [page, count, address]};
    }

    static transaction_count()
    {
        return {"$transaction_count": []};
    }

    static get_code(type, target)
    {
        return {"$get_code": [type, target]};
    }

    static list_code(page = 1, count = 20)
    {
        return {"$list_code": [page, count]};
    }

    static code_count()
    {
        return {"$code_count": []};
    }

    static block_exists(height = 0, previous_blockhash = '')
    {
        return {"$block_exists": [height, previous_blockhash]};
    }

    static is_validator(height = 0, public_key = '')
    {
        return {"$is_validator": [height, public_key]};
    }

    static list_universal(attr = null, page = 1, count = 20)
    {
        return {"$list_universal": [attr, page, count]};
    }

    static count_universal(attr = null)
    {
        return {"$count_universal": [attr]};
    }

    static get_resource_block(target = null, full = false)
    {
        return {"$get_resource_block": [target, full]};
    }

    static list_resource_block(page = 1, count = 20)
    {
        return {"$list_resource_block": [page, count]};
    }

    static resource_block_count()
    {
        return {"$resource_block_count": []};
    }

    static get_blocks(target = null, full = false)
    {
        return {"$get_blocks": [target, full]};
    }

    static get_resource_blocks(target = null, full = false)
    {
        return {"$get_resource_blocks": [target, full]};
    }
}