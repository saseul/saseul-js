var SASEUL = SASEUL || function () {
    var saseul = {}, core = saseul.Core = {
        hash: function (algo, string) {
            return CryptoJS[algo](string).toString(CryptoJS.enc.Hex);
        },

        time: function () {
            return parseInt(new Date().getTime() / 1000);
        },

        utime: function () {
            return parseInt((new Date().getTime()) + '000');
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
    };
    return saseul;
}();