'use strict'

const Clock = require('./clock');
const PHP = require('../php/php');
const Enc = require('../util/enc');

module.exports = class Hasher {
    static HASH_BYTES = 32;
    static HEX_TIME_BYTES = 7;

    static TIME_HASH_BYTES = this.HEX_TIME_BYTES + this.HASH_BYTES;
    static ID_HASH_BYTES = 22;
    static SHORT_HASH_BYTES = 20;
    static STATUS_KEY_BYTES = 48;
    static STATUS_HASH_BYTES = 64;

    static HASH_SIZE = this.HASH_BYTES * 2;
    static HEX_TIME_SIZE = this.HEX_TIME_BYTES * 2;
    static TIME_HASH_SIZE = this.TIME_HASH_BYTES * 2;
    static ID_HASH_SIZE = 44;
    static SHORT_HASH_SIZE = 40;
    static STATUS_PREFIX_SIZE = 64;
    static STATUS_KEY_SIZE = 64;
    static STATUS_HASH_SIZE = 128;

    static MerkleRoot(array = [])
    {
        if (array.length === 0) {
            return this.Hash('');
        }

        let hash_array = [];

        array.forEach(item => {
            hash_array.push(this.Hash(item));
        })

        while (hash_array.length > 1) {
            let tmp_array = hash_array;
            let hash_array = [];

            for (let i = 0; i < tmp_array.length; i = i + 2) {
                if (i === tmp_array.length - 1) {
                    hash_array.push(tmp_array[i]);
                } else {
                    hash_array.push(this.Hash(tmp_array[i] + tmp_array[i + 1]));
                }
            }
        }

        return hash_array[0];
    }

    static MerkleTree(array = [])
    {
        const tree = {};
        let parent = [];

        array.forEach(item => {
            parent.push(this.Hash(item));
        });

        let height = 0;
        tree[height] = parent;

        while(parent.length > 1) {
            height = height + 1;
            tree[height] = {};

            for (let i = 0; i < parent.length; i = i + 2) {
                if(parent[i + 1]) {
                    tree[height].push(this.Hash(`${parent[i]}${parent[i + 1]}`));
                } else {
                    tree[height].push(parent[i]);
                }
            }

            parent = tree[height];
        }

        return tree;
    }

    static MerklePath(array = [])
    {
        const merkle_path = [];
        const tree = this.MerkleTree(array);

        for (let i = 0; i < array.length; i++) {
            const path = [];

            for (const height in tree) {
                const leaf = tree[height];
                const o = parseInt(i / 2 ** height);
                const way = i % (2 ** (height + 1));

                if(way < (2 ** height) && (leaf[o + 1] !== null && leaf[o + 1] !== undefined)) {
                    path.push(`0${leaf[o + 1]}`);
                } else if(way >= (2 ** height ) && (leaf[o - 1] !== null && leaf[o - 1] !== undefined)) {
                    path.push(`1${leaf[o + 1]}`);
                }
            }
            merkle_path[i] = path;
        }

        return merkle_path;
    }

    static TracePath(start_hash, path = [])
    {
        let root = start_hash;

        path.forEach(item => {
            const prefix = item[0];
            const hash = PHP.substr(item, 1);

            if(prefix === '0') {
                root = Hasher.Hash(`${root}${hash}`);
            } else {
                root = Hasher.Hash(`${hash}${root}`);
            }
        });

        return root;
    }

    static Hash(obj)
    {
        return PHP.hash('SHA256', this.String(obj));
    }

    static ShortHash(obj)
    {
        return PHP.hash('RIPEMD160', this.Hash(obj));
    }

    static Checksum(hash)
    {
        return PHP.substr(PHP.hash('SHA256', PHP.hash('SHA256', hash)), 0, 4);
    }

    static Hextime(utime = null)
    {
        utime = utime ?? Clock.Utime();

        return PHP.str_pad(PHP.dechex(utime), this.HEX_TIME_SIZE, '0', 'STR_PAD_LEFT');
    }

    static TimeHash(obj, timestamp)
    {
        return this.Hextime(timestamp) + this.Hash(obj);
    }

    static TimeHashValidity(hash)
    {
        return hash.length === this.TIME_HASH_SIZE && this.IsHex(hash) === true;
    }

    static IdHash(obj)
    {
        let hash = this.ShortHash(obj);
        let checksum = this.Checksum(hash);

        return hash + checksum;
    }

    static IdHashValidity(id)
    {
        if (id.length !== this.ID_HASH_SIZE) {
            return false;
        }

        let hash = PHP.substr(id, 0, -4);
        let checksum = PHP.substr(id, -4);

        return (id.length === this.ID_HASH_SIZE) && (this.Checksum(hash) === checksum);
    }

    static FillHash(hash)
    {
        if (PHP.strlen(hash) < this.STATUS_HASH_SIZE) {
            return PHP.str_pad(hash, this.STATUS_HASH_SIZE, '0', 'STR_PAD_RIGHT');
        }

        return hash;
    }

    static StatusHash(writer, space, attr, key)
    {
        if (PHP.strlen(key) > this.STATUS_KEY_SIZE || !this.IsHex(key)) {
            return null;
        }

        return `${this.StatusPrefix(writer, space, attr)}${key}`;
    }

    static StatusPrefix(writer, space, attr)
    {
        return this.Hash(`${writer}${space}${attr}`);
    }

    static SpaceId(writer, space)
    {
        return this.Hash([writer, space]);
    }

    static TransactionHash(transaction)
    {
        return this.TimeHash(this.Hash(transaction), (transaction['timestamp'] ?? 0));
    }

    static String(obj)
    {
        if (['array', 'object', 'resource'].includes(typeof obj)) {
            obj = JSON.stringify(obj);
            obj = Enc.StringToUnicode(obj.replace(/\//g, '\\/'));
        }

        return String(obj);
    }

    static IsHex(hex)
    {
        if (typeof hex !== 'string') {
            return false;
        }
        return (Boolean(hex.match(/^[0-9a-f]+$/)));
    }
}