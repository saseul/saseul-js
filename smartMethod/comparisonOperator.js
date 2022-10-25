'use strict'

module.exports = class ComparisonOperator {

    static eq(left = 0, right = 0)
    {
        return {"$eq": [left, right]};
    }

    static ne(left = 0, right = 0) {
        return {"$ne": [left, right]};
    }

    static gt(left = 0, right = 0) {
        return {"$gt": [left, right]};
    }

    static lt(left = 0, right = 0) {
        return {"$lt": [left, right]};
    }

    static gte(left = 0, right = 0) {
        return {"$gte": [left, right]};
    }

    static lte(left = 0, right = 0) {
        return {"$lte": [left, right]};
    }

    static in(target = null, cases = []) {
        return {"$in": [target, cases]};
    }
}