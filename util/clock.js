'use strict'

const PHP = require('../php/php');

module.exports = class Clock {

    static HEX_TIME_BYTES = 7;
    static HEX_TIME_SIZE = 14;

    static Utime()
    {
        return Number(PHP.array_sum(PHP.microtime().split(' ')) * 1000000);
    }

    static Hextime(microtime = null)
    {
        if (microtime === null) {
            microtime = this.Utime();
        }

        return PHP.str_pad(PHP.dechex(microtime), this.HEX_TIME_SIZE, '0', 'STR_PAD_LEFT');
    }

    static UCeiltime()
    {
        return (PHP.time() + 1) + '000000';
    }

    static UFloortime()
    {
        return PHP.time() + '000000';
    }
}