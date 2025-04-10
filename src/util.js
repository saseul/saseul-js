;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory(require("./core"));
    } else if (typeof define === "function" && define.amd) {
        define(["./core"], factory);
    } else {
        factory(root.SASEUL);
    }
}(this, function (SASEUL) {
    /* start source */
    (function () {
        var saseul = SASEUL, util = saseul.Util = {

            time: function () {
                return Math.floor(Date.now() / 1000);
            },

            utime: function () {
                return Date.now() * 1000;
            },

            uceiltime: function () {
                return Math.ceil(Date.now() / 1000) * 1000000;
            },

            randomHexString: function (num_bytes) {
                let result = '';

                for (let i = 0; i < num_bytes * 2; i++) {
                    result += Math.floor(Math.random() * 16).toString(16);
                }

                return result;
            },

            hexToByte: function (hex) {
                if (!hex) {
                    return new Uint8Array();
                }

                let bytes = [];

                for (let i = 0, length = hex.length; i < length; i += 2) {
                    bytes.push(parseInt(hex.slice(i, i + 2), 16));
                }

                return new Uint8Array(bytes);
            },

            byteToHex: function (byte_array) {
                if (!byte_array) {
                    return '';
                }

                return Array.prototype.map.call(byte_array, function(byte) {
                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                }).join('').toLowerCase();
            },

            stringToByte: function (str) {
                let byte_array = new Uint8Array(str.length);

                for (let i = 0; i < str.length; i++) {
                    byte_array[i] = str.charCodeAt(i);
                }

                return byte_array;
            },

            stringToUnicode: function (str) {
                if (!str) {
                    return '';
                }

                return Array.prototype.map.call(str, function (char) {
                    let c = char.charCodeAt(0).toString(16);

                    if (c.length > 2) {
                        return '\\u' + c;
                    }

                    return char;
                }).join('');
            },

            isIP: function (string) {
                let pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:([0-9]{1,5}))?$/;
                return pattern.test(string);
            },

            isHex: function (input) {
                if (typeof input !== 'string') {
                    return false;
                }

                const hexPattern = /^[0-9a-fA-F]+$/;
                return hexPattern.test(input) && input.length % 2 === 0;
            },

            isInt: function (number) {
                if (typeof number !== 'number' && typeof number !== 'string') {
                    return false;
                }

                return Number.isInteger(Number(number)) && !/^0[0-9a-fA-F]+$/.test(number);
            },

            isNumeric: function (number) {
                if (typeof number !== 'number' && typeof number !== 'string') {
                    return false;
                }

                return !isNaN(Number(number)) && Number(number) !== Infinity && !/^0[0-9a-fA-F]+$/.test(n);
            },

            wrappedEndpoint: function (endpoint) {
                let is_browser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

                if (is_browser) {
                    if (endpoint.startsWith('http://') || endpoint.startsWith('https://') || endpoint.startsWith('//')) {
                        return endpoint;
                    }

                    return this.isIP(endpoint) ? 'http://' + endpoint : '//' + endpoint;
                } else {
                    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
                        return endpoint;
                    }

                    return 'http://' + endpoint;
                }
            },

            string: function (input) {
                let s;

                if (typeof input === 'object' && input !== null) {
                    s = JSON.stringify(input);
                } else {
                    s = String(input);
                }

                return this.stringToUnicode(s.replace(/\//g, '\\/'));
            },

            shuffle: function (array) {
                return array.map(v => ({ v, i: Math.random() }))
                    .sort((x, y) => x.i - y.i)
                    .map(({ v }) => v)
            },

            merge: function (array1, array2) {
                let m = array1.concat(array2);
                return [...new Set(m)];
            },

            flatMerge: function (arrays) {
                let m = arrays.flat();
                return [...new Set(m)];
            },

            randomSlice: function (array, size) {
                return this.shuffle(array).slice(0, size);
            },
        };
    })();
    /* end source */

    return SASEUL.Util;

}));