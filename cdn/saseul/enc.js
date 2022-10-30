(function () {
    var s = SASEUL, c = s.Core, f = s.Enc = {
        SHORT_HASH_SIZE: 40,
        ID_HASH_SIZE: 44,
        HASH_SIZE: 64,
        HEX_TIME_SIZE: 14,
        TIME_HASH_SIZE: 78,

        string: function (o) {
            if (typeof o !== 'string') {
                o = JSON.stringify(o);
            }

            return c.stringToUnicode(o.replaceAll('/', '\\/'));
        },

        hash: function (o) {
            return c.hash('SHA256', this.string(o));
        },

        shortHash: function (o) {
            return c.hash('RIPEMD160', this.hash(o));
        },

        checksum: function (h) {
            return c.hash('SHA256', c.hash('SHA256', h)).substr(0, 4);
        },

        hextime: function(u) {
            if (typeof u !== 'number') {
                u = c.utime();
            }

            u = u.toString(16);

            if (u.length > this.HEX_TIME_SIZE) {
                return u.substr(0, this.HEX_TIME_SIZE);
            }

            return u.toString(16).padStart(this.HEX_TIME_SIZE, '0');
        },

        timeHash: function(o, u) {
            return this.hextime(u) + this.hash(o);
        },

        timeHashValidity: function(h) {
            return this.isHex(h) === true && h.length === this.TIME_HASH_SIZE;
        },

        idHash: function (o) {
            var h = this.shortHash(o);

            return h + this.checksum(h);
        },

        idHashValidity: function (i) {
            return this.isHex(i) === true &&
                i.length === this.ID_HASH_SIZE &&
                this.checksum(i.substr(0, this.SHORT_HASH_SIZE)) === i.substr(-4);
        },

        spaceId: function(w, s) {
            return this.hash([w, s]);
        },

        txHash: function (t) {
            return this.timeHash(this.hash(t), t.timestamp);
        },

        isHex: function (h) {
            if (typeof h !== 'string') {
                return false;
            }
            return (Boolean(h.match(/^[0-9a-f]+$/)));
        },
    };
})();