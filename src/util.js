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
                return parseInt(new Date().getTime() / 1000);
            },

            utime: function () {
                return parseInt((new Date().getTime()) + '000');
            },

            uceiltime: function () {
                return ((this.time() + 1) * 1000000);
            },

            randomHexString: function (byte_length) {
                var result = '';

                for (var i = 0; i < byte_length * 2; i++) {
                    var char = Math.floor(Math.random() * 16);
                    result += char.toString(16);
                }

                return result;
            },

            hexToByte: function (hex) {
                if (!hex) {
                    return new Uint8Array();
                }

                var byte_array = [];
                for (var i = 0, length = hex.length; i < length; i += 2) {
                    byte_array.push(parseInt(hex.substr(i, 2), 16));
                }

                return new Uint8Array(byte_array);
            },

            byteToHex: function (byte_array) {
                if (!byte_array) {
                    return '';
                }

                var result = '';
                for (var i = 0; i < byte_array.length; i++) {
                    var hex = (byte_array[i] & 0xff).toString(16);
                    hex = (hex.length === 1) ? '0' + hex : hex;
                    result += hex;
                }

                return result.toLowerCase();
            },

            stringToByte: function (str) {
                var byte_array = new Uint8Array(new ArrayBuffer(str.length));
                for (var i = 0, l = str.length; i < l; i++) {
                    byte_array[i] = str.charCodeAt(i);
                }
                return byte_array;
            },

            stringToUnicode: function (str) {
                if (!str) {
                    return '';
                }

                let result = '';

                for (let i = 0; i < str.length; i++) {
                    let char = str[i].charCodeAt(0).toString(16);

                    if (char.length > 2) {
                        result+= '\\u' + char;
                    } else {
                        result+= str[i];
                    }
                }

                return result;
            },

            wrappedEndpoint: function (endpoint) {
                if (endpoint.substring(0, 7) === 'http://' || endpoint.substring(0, 8) === 'https://' || endpoint.substring(0, 2) === '//') {
                    return endpoint;
                }

                return '//' + endpoint;
            },

            shuffle: function (array) {
                return array.map(v => ({ v, i: Math.random() }))
                    .sort((x, y) => x.i - y.i)
                    .map(({ v }) => v)
            }
        };
    })();
    /* end source */

    return SASEUL.Util;

}));