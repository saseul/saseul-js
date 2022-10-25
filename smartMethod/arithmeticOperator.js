'use strict'

module.exports = class ArithmeticOperator {

    /**
     *
     * @param vars array
     * @returns {{$add: *[]}}
     */
    static add(vars = [])
    {
        return {"$add": vars};
    }

    /**
     *
     * @param vars array
     * @returns {{$sub: *[]}}
     */
    static sub(vars = [])
    {
        return {"$sub": vars};
    }

    /**
     *
     * @param vars array
     * @returns {{$mul: *[]}}
     */
    static mul(vars = [])
    {
        return {"$mul": vars};
    }

    /**
     *
     * @param vars array
     * @returns {{$div: *[]}}
     */
    static div(vars = [])
    {
        return {"$div": vars};
    }

    static precise_add(left = null, right = null, scale = 0)
    {
        return {"$precise_add": [left, right, scale]};
    }

    static precise_sub(left = null, right = null, scale = 0)
    {
        return {"$precise_sub": [left, right, scale]};
    }

    static precise_mul(left = null, right = null, scale = 0)
    {
        return {"$precise_mul": [left, right, scale]};
    }

    static precise_div(left = null, right = null, scale = 0)
    {
        return {"$precise_div": [left, right, scale]};
    }

    static scale(value = null) {
        return {"$scale": [value]};
    }
}