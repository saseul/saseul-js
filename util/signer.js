'use strict'

const Hasher = require('./hasher');
const Enc = require('./enc');

module.exports = class Signer {
    static ADDRESS_SIZE = Hasher.ID_HASH_SIZE;
    static KEY_SIZE = (32 * 2);
    static SIGNATURE_SIZE = (64 * 2);

    static PrivateKey()
    {
        const keypair = Enc.MakeKeypair();
        return keypair.private_key;
    }

    static PublicKey(private_key)
    {
        return Enc.MakePublicKey(private_key);
    }

    static Address(public_key)
    {
        return Enc.MakeAddress(public_key);
    }

    static AddressValidity(address)
    {
        return Hasher.IdHashValidity(address);
    }

    static Signature(obj, private_key)
    {
        const str = Hasher.String(obj);
        const public_key = this.PublicKey(private_key);

        return Enc.Signature(str, private_key, public_key);
    }

    static SignatureValidity(obj, public_key, signature)
    {
        const str = Hasher.String(obj);

        return Enc.IsValidSignature(str, public_key, signature);
    }

    static SignatureFormatValidity(signature)
    {
        return (signature.length === this.SIGNATURE_SIZE && Hasher.IsHex(signature));
    }

    static KeyValidity(key)
    {
        return (key.length === this.KEY_SIZE && Hasher.IsHex(key));
    }

}