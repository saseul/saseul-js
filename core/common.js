'use strict'
const Code = require('../code');
const Result = require("../model/result");

module.exports = class Common {

    static success_result = null;
    static fail_result = null;

    static SuccessResult(msg = null)
    {
        if (this.success_result === null) {
            this.success_result = new Result();
            this.success_result.Code(Code.OK);
            this.success_result.Item('status', 'success');
        }

        this.success_result.Item('msg', msg);

        return this.success_result;
    }

    static FailResult(err_msg, code = Code.FAIL)
    {
        if (this.fail_result === null) {
            this.fail_result = new Result();
            this.fail_result.Code(code);
            this.fail_result.Item('status', 'fail');
        }

        this.fail_result.Item('msg', err_msg);

        return this.fail_result;
    }
}