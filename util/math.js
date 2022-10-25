'use strict'

const PHP = require('../php/php');

module.exports = class Math {
    static IsHex(str)
    {
        if (str.match(/^[0-9a-f]+$/)) {
            return true;
        }

        return false;
    }

    static IsHexbyte(str)
    {
        if (this.IsHex(str) && PHP.strlen(str) % 2 === 0) {
            return true;
        }

        return false;
    }

    static Decbin(dec, length = 0)
    {
        switch (length) {
            case 1:
                return PHP.pack('C', dec);
            case 2:
                return PHP.pack('n', dec);
            case 3: case 4:
                return PHP.pack('N', dec);
            default:
                return PHP.pack('J', dec);
        }
    }

    static Bindec(bin)
    {
        return Number(PHP.hexdec(PHP.bin2hex(bin)));
    }

    static Hexdec(hex)
    {
        if (PHP.strlen(hex) < 2) {
            return PHP.hexdec(hex);
        }

        return PHP.bcadd(
            PHP.bcmul(16, this.Hexdec(PHP.substr(hex, 0, -1))),
            PHP.hexdec(PHP.substr(hex, -1))
        );
    }

    static Dechex(dec, byte = false)
    {
        let result;
        let last = PHP.bcmod(dec, 16);
        let remain = PHP.bcdiv(PHP.bcsub(dec, last), 16);

        if (remain === '0') {
            result = PHP.dechex(last);
        } else {
            result = this.Dechex(remain) + PHP.dechex(last);
        }

        if (byte === true && PHP.strlen(result) % 2 === 1) {
            result = '0' + result;
        }

        return result;
    }

    static Add(a, b, scale = null) {
        scale = scale ?? this.Maxscale(a, b);

        return PHP.bcadd(a, b, scale);
    }

    static Sub(a, b, scale = null) {
        scale = scale ?? this.Maxscale(a, b);

        return PHP.bcsub(a, b, scale);
    }

    static Mul(a, b, scale = null) {
        scale = scale ?? this.Maxscale(a, b);

        return PHP.bcmul(a, b, scale);
    }

    static Div(a, b, scale = null) {
        scale = scale ?? this.Maxscale(a, b);

        if (this.Eq(b, 0)) {
            return null;
        }

        return PHP.bcdiv(a, b, scale);
    }

    static Pow(a, b) {
        return PHP.bcpow(a, b, this.Maxscale(a, b));
    }

    static Mod(a, b) {
        return PHP.bcmod(a, b, this.Maxscale(a, b));
    }

    static Equal(a, b) {
        return (PHP.bccomp(a, b, this.Maxscale(a, b)) === 0);
    }

    static Eq(a, b) {
        return this.Equal(a, b);
    }

    static Ne(a, b) {
        return !this.Equal(a, b);
    }

    static Gt(a, b) {
        return (PHP.bccomp(a, b, this.Maxscale(a, b)) === 1);
    }

    static Lt(a, b) {
        return (PHP.bccomp(a, b, this.Maxscale(a, b)) === -1);
    }

    static Gte(a, b) {
        return (PHP.bccomp(a, b, this.Maxscale(a, b)) >= 0);
    }

    static Lte(a, b) {
        return (PHP.bccomp(a, b, this.Maxscale(a, b)) <= 0);
    }

    static Floor(a, scale = 0)
    {
        if (!PHP.is_numeric(a)) {
            return '0';
        }

        if (this.Gte(a, 0) || scale >= this.Scale(a)) {
            return PHP.bcadd(a, 0, scale);
        }

        return PHP.bcsub(a, PHP.bcpow('0.1', scale, scale), scale);
    }

    static Ceil(a, scale = 0)
    {
        if (!PHP.is_numeric(a)) {
            return '0';
        }

        if (this.Lte(a, 0) || scale >= this.Scale(a)) {
            return PHP.bcadd(a, 0, scale);
        }

        return PHP.bcadd(a, PHP.bcpow('0.1', scale, scale), scale);
    }

    static Round(a, scale = 0)
    {
        if (!PHP.is_numeric(a)) {
            return '0';
        }

        if (this.Gte(a, 0)) {
            return PHP.bcadd(a, PHP.bcdiv(PHP.bcpow('0.1', scale, scale), '2', scale + 1), scale);
        }

        return PHP.bcsub(a, PHP.bcdiv(PHP.bcpow('0.1', scale, scale), '2', scale + 1), scale);
    }

    static Scale(a)
    {
        if (!PHP.is_numeric(a) || String(a).indexOf('.') === false) {
            return '0';
        }

        return a.length - String(a).indexOf('.') - 1;
    }

    static Maxscale(a, b)
    {
        return PHP.max(this.Scale(a), this.Scale(b));
    }
}