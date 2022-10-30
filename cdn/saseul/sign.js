(function () {
    var s = SASEUL, c = s.Core, e = s.Enc, f = s.Sign = {
        KEY_SIZE: 64,
        SIGNATURE_SIZE: 128,

        keyPair: function ()
        {
            var p = nacl.sign.keyPair();
            var k = {};

            k.private_key = c.byteToHex(p.secretKey).substr(0, 64);
            k.public_key = c.byteToHex(p.publicKey);
            k.address = this.address(k.public_key);

            return k;
        },

        privateKey: function ()
        {
            return c.byteToHex(nacl.sign.keyPair().secretKey).substr(0, 64);
        },

        publicKey: function (k)
        {
            return c.byteToHex(nacl.sign.keyPair.fromSeed(c.hexToByte(k)).publicKey);
        },

        address: function (k)
        {
            return e.idHash(k);
        },

        addressValidity: function (a)
        {
            return e.idHashValidity(a);
        },

        signature: function (o, k)
        {
            return c.byteToHex(nacl.sign.detached(
                c.stringToByte(e.string(o)), c.hexToByte(k + this.publicKey(k))
            ));
        },

        signatureValidity: function (o, k, g)
        {
            return g.length === this.SIGNATURE_SIZE &&
                e.isHex(g) === true && nacl.sign.detached.verify(
                c.stringToByte(o), c.hexToByte(g), c.hexToByte(k)
            );
        },

        keyValidity: function (k)
        {
            return k.length === this.KEY_SIZE && e.isHex(k);
        },
    };
})();