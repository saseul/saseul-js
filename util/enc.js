'use strict';
const CryptoJS = require('crypto-js');
const nacl = require('tweetnacl');

module.exports = class Enc {

    static ToUint8Array(str) {
        let result = [];

        for(let i = 0; i < str.length; i+=2)
        {
            result.push(parseInt(str.substring(i, i + 2), 16));
        }
        result = Uint8Array.from(result);

        return result;
    }

    static StringToUnicode(str) {
        if (!str) return '';

        let u = '';

        for (let i = 0; i < str.length; i++) {
            let s = str[i].charCodeAt(0).toString(16);

            if (s.length > 2) {
                u+= '\\u' + s;
            } else {
                u+= str[i];
            }
        }

        return u;
    };

    static RandomHexString(byte) {
        let hex = '';

        for (let i = 0; i < byte * 2; i++) {
            let r = Math.floor(Math.random() * 16);
            hex += r.toString(16);
        }

        return hex;
    };

    static HexToByte(str) {
        if (!str) return new Uint8Array();

        let a = [];

        for (let i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }

        return new Uint8Array(a);
    };

    static ByteToHex(byte) {
        if (!byte) {
            return '';
        }

        let hexStr = '';
        for (let i = 0; i < byte.length; i++) {
            let hex = (byte[i] & 0xff).toString(16);
            hex = (hex.length === 1) ? '0' + hex : hex;
            hexStr += hex;
        }

        return hexStr.toLowerCase();
    };

    static StringToByte(str) {
        let buf = new Uint8Array(new ArrayBuffer(str.length));
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            buf[i] = str.charCodeAt(i);
        }
        return buf;
    };

    static Hash(str) {
        return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
    }

    static Thash(str, timestamp) {
        return this.TimeHash(this.ThashLogic(str), timestamp || 0);
    };

    static TimeHash(thash, timestamp) {
        timestamp = timestamp.toString(16);

        for(let i = timestamp.length; i < 14; i++){
            timestamp = '0' + timestamp;
        }
        return timestamp + '' + this.ThashLogic(thash);
    };

    static ThashLogic(str) {
        if (typeof str !== 'string') str = JSON.stringify(str);
        str = this.StringToUnicode(str.replace(/\//g, '\\/'));

        return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
    };

    static MakeAddress(public_key) {
        let address, s0, s1, s2;

        s0 = CryptoJS.SHA256(public_key).toString(CryptoJS.enc.Hex);
        s0 = CryptoJS.RIPEMD160(s0).toString(CryptoJS.enc.Hex);
        s1 = s0;

        s2 = CryptoJS.SHA256(s1).toString(CryptoJS.enc.Hex);
        s2 = CryptoJS.SHA256(s2).toString(CryptoJS.enc.Hex);

        address = s1 + s2.substr(0, 4);

        return address;
    };

    static MakeCid(hash, prefix) {
        let p0 = '0x00';
        let p1 = prefix;
        let address, s0, s1, s2;

        s0 = CryptoJS.SHA256(p0 + hash).toString(CryptoJS.enc.Hex);
        s0 = CryptoJS.RIPEMD160(s0).toString(CryptoJS.enc.Hex);
        s1 = p1 + s0;

        s2 = CryptoJS.SHA256(s1).toString(CryptoJS.enc.Hex);
        s2 = CryptoJS.SHA256(s2).toString(CryptoJS.enc.Hex);

        address = s1 + s2.substr(0, 4);

        return address;
    };

    static MakeKeypair() {
        let salt = nacl.sign.keyPair();
        let keypair = {};

        keypair.private_key = this.ByteToHex(salt.secretKey).substr(0, 64);
        keypair.public_key = this.ByteToHex(salt.publicKey);
        keypair.address = this.MakeAddress(keypair.public_key);

        return keypair;
    };

    static MakePublicKey(private_key) {
        let b = Enc.HexToByte(private_key);
        let salt = nacl.sign.keyPair.fromSeed(b);

        return this.ByteToHex(salt.publicKey);
    };

    static AESFormatter = {
        stringify: function (cipherParams) {
            let jsonObj = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }
            return JSON.stringify(jsonObj);
        },
        parse: function (jsonStr) {
            let jsonObj = JSON.parse(jsonStr);
            let cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
            }
            return cipherParams;
        }
    };

    static Signature(str, private_key, public_key) {
        return this.ByteToHex(nacl.sign.detached(
            this.StringToByte(str), this.HexToByte(private_key + public_key)
        ));
    };

    static IsValidSignature(str, public_key, signature) {
        return nacl.sign.detached.verify(
            this.StringToByte(str), this.HexToByte(signature), this.HexToByte(public_key)
        );
    };

    static Microseconds() {
        let d = new Date();

        return (d.getTime() * 1000) + d.getMilliseconds();
    };

}




