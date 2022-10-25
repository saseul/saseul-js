'use strict'

module.exports = class UtilOperator {

    /**
     * Concatenate variables
     * @param vars array
     * @returns {{$concat: *[]}}
     */
    static concat(vars=[])
    {
        return {"$concat": vars};
    }

    static count(vars=[])
    {
        return {"$count": [vars]};
    }

    /**
     * Count string length
     * @param value string
     * @returns {{$strlen: string[]}}
     */
    static strlen(value = '')
    {
        return {"$strlen": [value]};
    }

    /**
     * Test regular expression
     * @param reg regex
     * @param value string
     * @returns {{$reg_match: string[]}}
     */
    static reg_match(reg = null, value = '')
    {
        return {"$reg_match": [reg, value]};
    }

    /**
     * Encodes a JSON string
     * @param target object
     * @returns {{$encode_json: *[]}}
     */
    static encode_json(target = null)
    {
        return {"$encode_json": [target]};
    }

    /**
     * Decodes a JSON string
     * @param target string
     * @returns {{$decode_json: string[]}}
     */
    static decode_json(target = '')
    {
        return {"$decode_json": [target]};
    }

    /**
     * Generate a SHA256 hash value
     * @param vars array
     * @returns {{$hash: *[]}}
     */
    static hash(vars = [])
    {
        return {"$hash": [vars]};
    }

    /**
     * Generate a RIPEMD160 hash value
     * @param vars array
     * @returns {{$short_hash: *[]}}
     */
    static short_hash(vars = [])
    {
        return {"$short_hash": [vars]};
    }

    /**
     * Repeat SHA256 hash twice and get first 4 characters
     * @param vars array
     * @returns {{$id_hash: *[]}}
     */
    static id_hash(vars = [])
    {
        return {"$id_hash": [vars]};
    }

    /**
     * Verify signature
     * @param obj object
     * @param public_key string
     * @param signature string
     * @returns {{$sign_verify: string[]}}
     */
    static sign_verify(obj = null, public_key = '', signature = '')
    {
        return {"$sign_verify": [obj, public_key, signature]};
    }
}