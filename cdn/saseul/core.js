var SASEUL = SASEUL || function () {
    var s = {}, c = s.Core = {
        hash: function (algo, string) {
            return CryptoJS[algo](string).toString(CryptoJS.enc.Hex);
        },

        time: function () {
            return parseInt(new Date().getTime() / 1000);
        },

        utime: function () {
            return parseInt((new Date().getTime()) + '000');
        },

        randomHexString: function (n) {
            var h = '';

            for (var i = 0; i < n * 2; i++) {
                var r = Math.floor(Math.random() * 16);
                h += r.toString(16);
            }

            return h;
        },

        hexToByte: function (o) {
            if (!o) {
                return new Uint8Array();
            }

            var a = [];
            for (var i = 0, l = o.length; i < l; i += 2) {
                a.push(parseInt(o.substr(i, 2), 16));
            }

            return new Uint8Array(a);
        },

        byteToHex: function (o) {
            if (!o) {
                return '';
            }

            var s = '';
            for (var i = 0; i < o.length; i++) {
                var h = (o[i] & 0xff).toString(16);
                h = (h.length === 1) ? '0' + h : h;
                s += h;
            }

            return s.toLowerCase();
        },

        stringToByte: function (o) {
            var b = new Uint8Array(new ArrayBuffer(o.length));
            for (var i = 0, l = o.length; i < l; i++) {
                b[i] = o.charCodeAt(i);
            }
            return b;
        },

        stringToUnicode: function (o) {
            if (!o) {
                return '';
            }

            let u = '';

            for (let i = 0; i < o.length; i++) {
                let c = o[i].charCodeAt(0).toString(16);

                if (c.length > 2) {
                    u+= '\\u' + c;
                } else {
                    u+= o[i];
                }
            }

            return u;
        },
    };
    return s;
}();