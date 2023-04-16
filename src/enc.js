;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory(
            require("./core"),
            require("crypto-js"),
        );
    } else if (typeof define === "function" && define.amd) {
        define(["./core", "crypto-js"], factory);
    } else {
        factory(root.SASEUL, CryptoJS);
    }
}(this, function (SASEUL, CryptoJS) {
    /* start source */
    (function () {
        var saseul = SASEUL, util = saseul.Util, enc = saseul.Enc = {
            SHORT_HASH_SIZE: 40,
            ID_HASH_SIZE: 44,
            HASH_SIZE: 64,
            HEX_TIME_SIZE: 14,
            TIME_HASH_SIZE: 78,
            ZERO_ADDRESS: '00000000000000000000000000000000000000000000',

            string: function (obj) {
                if (typeof obj !== 'string') {
                    obj = JSON.stringify(obj);
                }

                return util.stringToUnicode(obj.replaceAll('/', '\\/'));
            },

            crypto: function (algo, string) {
                return CryptoJS[algo](string).toString(CryptoJS.enc.Hex);
            },

            hash: function (obj) {
                return this.crypto('SHA256', this.string(obj));
            },

            shortHash: function (obj) {
                return this.crypto('RIPEMD160', this.hash(obj));
            },

            checksum: function (hash) {
                return this.hash(this.hash(hash)).substring(0, 4);
            },

            hextime: function (utime) {
                if (typeof utime !== 'number') {
                    utime = util.utime();
                }

                utime = utime.toString(16);

                if (utime.length > this.HEX_TIME_SIZE) {
                    return utime.substring(0, this.HEX_TIME_SIZE);
                }

                return utime.toString(16).padStart(this.HEX_TIME_SIZE, '0');
            },

            timeHash: function (obj, utime) {
                return this.hextime(utime) + this.hash(obj);
            },

            timeHashValidity: function (hash) {
                return this.isHex(hash) === true && hash.length === this.TIME_HASH_SIZE;
            },

            idHash: function (obj) {
                var short_hash = this.shortHash(obj);

                return short_hash + this.checksum(short_hash);
            },

            idHashValidity: function (id_hash) {
                return this.isHex(id_hash) === true &&
                    id_hash.length === this.ID_HASH_SIZE &&
                    this.checksum(id_hash.substring(0, this.SHORT_HASH_SIZE)) === id_hash.substr(-4);
            },

            spaceId: function (writer, space) {
                return this.hash([writer, space]);
            },

            cid: function (writer, space) {
                return this.spaceId(writer, space);
            },

            txHash: function (tx) {
                return this.timeHash(this.hash(tx), tx.timestamp);
            },

            isHex: function (str) {
                if (typeof str !== 'string') {
                    return false;
                }
                return (Boolean(str.match(/^[0-9a-f]+$/)));
            },

            parseCode: function (code) {
                if (typeof code === "string") {
                    code = JSON.parse(code);
                }

                if (typeof code.w === 'undefined') {
                    return {
                        cid: SASEUL.Enc.spaceId(code.writer, code.nonce),
                        name: code.name ?? '',
                        writer: code.writer ?? '',
                        type: code.type ?? '',
                        version: code.version ?? '0',
                        parameters: code.parameters ?? {},
                        nonce: code.nonce ?? '',
                    }
                } else {
                    return {
                        cid: SASEUL.Enc.spaceId(code.w, code.s),
                        name: code.n ?? '',
                        writer: code.w ?? '',
                        type: code.t ?? '',
                        version: code.v ?? '0',
                        parameters: code.p ?? {},
                        nonce: code.s ?? '',
                    }
                }
            },
        };
    })();
    /* end source */

    return SASEUL.Enc;

}));
