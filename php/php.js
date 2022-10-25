'use strict'
const CryptoJS = require('crypto-js');
const LocutusPHP = require('locutus/php');
const BigNumber = require('bignumber.js');

module.exports = class PHP {

    static time () {
        return LocutusPHP.datetime.time();
    }

    static microtime(getAsFloat) {
        return LocutusPHP.datetime.microtime(getAsFloat);
    }

    static str_pad (input, padLength, padString, padType) {
        return LocutusPHP.strings.str_pad(input, padLength, padString, padType);
    }

    static dechex (number) {
        return LocutusPHP.math.dechex(number);
    }

    static hash(algo, string) {
        return CryptoJS[algo](string).toString(CryptoJS.enc.Hex);
    }

    static _phpCastString (value) {
        return LocutusPHP.strings._phpCastString(value);
    }

    static ini_get (varname) {
        return LocutusPHP.info.ini_get(varname);
    }

    static substr(input, start, len) {
        return LocutusPHP.strings.substr(input, start, len);
    }

    static is_int (mixedVar) {
        return LocutusPHP.var.is_int(mixedVar);
    }

    static is_double (mixedVar) {
        return LocutusPHP.var.is_double(mixedVar);
    }

    static is_float (mixedVar) {
        return LocutusPHP.var.is_float(mixedVar);
    }

    static is_array (mixedVar) {
        return LocutusPHP.var.is_array(mixedVar);
    }

    static is_numeric(mixedVar) {
        return LocutusPHP.var.is_numeric(mixedVar);
    }

    static array_sum(array = []) {
        return LocutusPHP.array.array_sum(array);
    }

    static strlen(str) {
        return LocutusPHP.strings.strlen(str);
    }

    static pack(format, values) {
        return LocutusPHP.math.pack(format, values);
    }

    static bin2hex(bin) {
        return LocutusPHP.math.bin2hex(bin);
    }

    static hexdec(hexString) {
        return LocutusPHP.math.hexdec(hexString);
    }

    static bcadd(left, right, scale) {
        return LocutusPHP.bc.bcadd(left, right, scale);
    }

    static bcsub(left, right, scale) {
        return LocutusPHP.bc.bcsub(left, right, scale);
    }

    static bcmul(left, right, scale) {
        return LocutusPHP.bc.bcmul(left, right, scale);
    }

    static bcdiv(left, right, scale) {
        return LocutusPHP.bc.bcdiv(left, right, scale);
    }
    static bccomp(left, right, scale) {
        return LocutusPHP.bc.bccomp(left, right, scale);
    }

    static bcpow(left, right, scale) {
        const powered = Math.round( Math.round( Math.pow(left, right) * Math.pow( 10, scale + 1 ) ) / Math.pow( 10, 1 ) ) / Math.pow(10, scale);

        return new BigNumber(powered).toFixed(scale);
    }

    static bcmod(left, right, scale) {
        const num1 = new BigNumber(left);
        const num2 = new BigNumber(right);

        return num1.mod(num2).toFixed(scale);
    }

    static max(left, right) {
        return LocutusPHP.math.max(left, right);
    }
}