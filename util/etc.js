'use strict'
const Math = require('./math');
const PHP = require("../php/php");

module.exports = class Etc {

    /**
     * Convert Nyang to SL
     * @param nyang
     * @returns {string}
     * @constructor
     */
    static FromNyang(nyang) {
        try {
            if(typeof nyang !== 'string' || !PHP.is_numeric(nyang)) throw 'nyang must be a numeric string.';
            const decimal = 18;
            const sl = Math.Div(nyang, Math.Pow('10', decimal).split('.')[0], decimal);

            return this.#RemoveFloatZero(sl);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Convert SL to Nyang
     * @param sl
     * @returns {string}
     * @constructor
     */
    static ToNyang(sl) {
        try {
            if(typeof sl !== 'string' || !PHP.is_numeric(sl)) throw 'sl must be a numeric string.';
            const decimal = 18;

            return Math.Mul(sl, Math.Pow('10', decimal).split('.')[0], 0);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Convert Nyang value string into SL
     * @param number
     * @param decimal
     * @returns {string|*}
     * @constructor
     */
    static ParseDecimal(number, decimal = 18) {
        try {
            if(typeof decimal === 'number' && decimal === 0) return number;
            if(typeof number !== 'string' || !PHP.is_numeric(number)) throw 'number must be a numeric string.';
            if(typeof decimal !== 'number' || !PHP.is_int(decimal)) throw 'decimal must be an integer.';

            return this.#RemoveFloatZero(Math.Div(number, Math.Pow('10', decimal).split('.')[0], decimal));
        } catch (e) {
            throw e;
        }
    }

    /**
     * Convert SL value string into Nyang
     * @param number
     * @param decimal
     * @returns {*}
     * @constructor
     */
    static ApplyDecimal(number, decimal = 18) {
        try {
            if(typeof decimal === 'number' && decimal === 0) return number;
            if(typeof number !== 'string' || !PHP.is_numeric(number)) throw 'number must be a numeric string.';
            if(typeof decimal !== 'number' || !PHP.is_int(decimal)) throw 'decimal must be an integer.';

            return Math.Mul(number, Math.Pow('10', decimal).split('.')[0], 0);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Remove redundant zeros from a float string
     * @param str
     * @returns {string}
     */
    static #RemoveFloatZero(str) {
        try {
            if(typeof str !== 'string' || !PHP.is_numeric(str)) throw 'str must be a numeric string.';

            let intPart = str.split('.')[0];
            let floatPart = str.split('.')[1];
            let charArr = str.split('');

            if(str.indexOf('.') < 0) throw `${str} is not a float string.`;
            if(floatPart.length === 0 || Math.Eq(floatPart, '0')) return intPart;

            for (let i = charArr.length - 1; i > 0; i--) {
                const char = charArr[i];
                if(char === '0') charArr[i] = '';
                else break;
            }

            return charArr.join('');
        } catch (e) {
            throw e;
        }
    }

    /**
     * Returns the length of a string (in bytes) on success, and 0 if the string is empty
     * @param str
     * @constructor
     */
    static Strlen(str) {
        try {
            return PHP.strlen(str);
        } catch (e) {
            throw e;
        }
    }

}