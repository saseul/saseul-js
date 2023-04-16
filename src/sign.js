;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory(
            require("./core"),
            require("tweetnacl")
        );
    } else if (typeof define === "function" && define.amd) {
        define(["./core", "tweetnacl"], factory);
    } else {
        factory(root.SASEUL, nacl);
    }
}(this, function (SASEUL, nacl) {
    /* start source */
    (function () {
        var saseul = SASEUL, util = saseul.Util, enc = saseul.Enc, sign = saseul.Sign = {
            KEY_SIZE: 64,
            SIGNATURE_SIZE: 128,

            keyPair: function () {
                var pair = nacl.sign.keyPair();
                var result = {};

                result.private_key = util.byteToHex(pair.secretKey).substring(0, 64);
                result.public_key = util.byteToHex(pair.publicKey);
                result.address = this.address(result.public_key);

                return result;
            },

            privateKey: function () {
                return util.byteToHex(nacl.sign.keyPair().secretKey).substring(0, 64);
            },

            publicKey: function (private_key) {
                return util.byteToHex(nacl.sign.keyPair.fromSeed(util.hexToByte(private_key)).publicKey);
            },

            address: function (public_key) {
                return enc.idHash(public_key);
            },

            addressValidity: function (address) {
                return enc.idHashValidity(address);
            },

            signature: function (obj, private_key) {
                return util.byteToHex(nacl.sign.detached(
                    util.stringToByte(enc.string(obj)), util.hexToByte(private_key + this.publicKey(private_key))
                ));
            },

            signatureValidity: function (obj, public_key, signature) {
                return signature.length === this.SIGNATURE_SIZE &&
                    enc.isHex(signature) === true && nacl.sign.detached.verify(
                    util.stringToByte(enc.string(obj)), util.hexToByte(signature), util.hexToByte(public_key)
                );
            },

            keyValidity: function (key) {
                return key.length === this.KEY_SIZE && enc.isHex(key);
            },
        };
    })();
    /* end source */

    return SASEUL.Sign;

}));