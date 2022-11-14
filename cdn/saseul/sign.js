(function () {
    var saseul = SASEUL, core = saseul.Core, enc = saseul.Enc, func = saseul.Sign = {
        KEY_SIZE: 64,
        SIGNATURE_SIZE: 128,

        keyPair: function ()
        {
            var pair = nacl.sign.keyPair();
            var result = {};

            result.private_key = core.byteToHex(pair.secretKey).substring(0, 64);
            result.public_key = core.byteToHex(pair.publicKey);
            result.address = this.address(result.public_key);

            return result;
        },

        privateKey: function ()
        {
            return core.byteToHex(nacl.sign.keyPair().secretKey).substring(0, 64);
        },

        publicKey: function (private_key)
        {
            return core.byteToHex(nacl.sign.keyPair.fromSeed(core.hexToByte(private_key)).publicKey);
        },

        address: function (public_key)
        {
            return enc.idHash(public_key);
        },

        addressValidity: function (address)
        {
            return enc.idHashValidity(address);
        },

        signature: function (obj, private_key)
        {
            return core.byteToHex(nacl.sign.detached(
                core.stringToByte(enc.string(obj)), core.hexToByte(private_key + this.publicKey(private_key))
            ));
        },

        signatureValidity: function (obj, public_key, signature)
        {
            return signature.length === this.SIGNATURE_SIZE &&
                enc.isHex(signature) === true && nacl.sign.detached.verify(
                core.stringToByte(obj), core.hexToByte(signature), core.hexToByte(public_key)
            );
        },

        keyValidity: function (key)
        {
            return key.length === this.KEY_SIZE && enc.isHex(key);
        },
    };
})();