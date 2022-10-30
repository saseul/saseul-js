(function () {
    var s = SASEUL, c = s.Core, e = s.Enc, g = s.Sign, f = s.Rpc = {
        default_peers: [
            'main.saseul.net',
            'aroma.saseul.net',
            'blanc.saseul.net',
        ],

        ping: function (h) {
            if (typeof h !== 'object') {
                h = this.default_peers;
            }

            return new Promise(function (_r) {
                f._searchPeers(h, function (r) {
                    f._queryRounds(r, function (r) {
                        _r(r);
                    })
                })
            });
        },

        searchPeers: function (h) {
            if (typeof h !== 'object') {
                h = this.default_peers;
            }

            return new Promise(function (_r) {
                f._searchPeers(h, function (r) {
                    _r(r);
                })
            });
        },

        _searchPeers: function (h, b) {
            f.multi(h, '/peer', { method: "POST", mode : "cors" },
                function (r) {
                    var _r = [];
                    r.forEach(function (i) {
                        try {
                            Object.values(i.data.peers).forEach(function (j) {
                                _r.push(j.host);
                            });
                        } catch (e) {}
                    });
                    b([...new Set(_r)]);
            });
        },

        queryRounds: function (h) {
            if (typeof h !== 'object') {
                h = this.default_peers;
            }

            return new Promise(function (_r) {
                f._queryRounds(h, function (r) {
                    _r(r);
                })
            });
        },

        _queryRounds: function (h, b) {
            f.multi(
                h, '/round?chain_type=all', { method: "POST", mode : "cors" },
                function (r) {
                    var _r = [];
                    r.forEach(function (i) {
                        try {
                            _r.push({
                                host: i.host,
                                main: i.data.main.block,
                                resource: i.data.resource.block
                            });
                        } catch (e) {}
                    });
                    b(_r);
                }
            );
        },

        transaction: function (v, k) {
            return this.data(v, k);
        },

        request: function (v, k) {
            if (typeof k !== "string") {
                k = g.privateKey();
            }

            return this.data(v, k, "request");
        },

        data: function (v, k, t = "transaction") {
            var d = {};

            try {
                v.from = g.address(g.publicKey(k));

                if (typeof v.timestamp !== 'number') {
                    v.timestamp = c.utime();
                }

                d[t] = v;
                d.public_key = g.publicKey(k);
                d.signature = g.signature(e.txHash(v), k);

                return d;

            } catch (_e) {
                if (!g.keyValidity(k)) {
                    console.error('Invalid private key: ' + k);
                    return {};
                }

                console.error(_e);
                return {};
            }
        },

        send: function (o, h) {
            var p, b = new FormData();

            if (typeof h !== "string") {
                h = 'blanc.saseul.net';
            }

            if (typeof o.transaction === "object") {
                b.append("transaction", e.string(o.transaction));
                p = h + '/sendtransaction';
            } else {
                b.append("request", e.string(o.request));
                p = h + '/request';
            }

            b.append("public_key", o.public_key);
            b.append("signature", o.signature);

            return new Promise(function (_r) {
                f._send(b, p, function (r) {
                    _r(r);
                })
            });
        },

        _send: function (form_data, url_path, callback) {
            fetch('//' + url_path, {
                method: "POST",
                mode: "cors",
                body: form_data,
            }).then(
                (function (r) { return r.json() }),
                (function (r) { return { code: 999, msg: r.message }; })
            ).then(
                (function (r) {
                    callback(r);
                })
            );
        },

        multi: function (urls, path, option, callback, max_number = 9) {
            var _t = [], _n = 0, _z = Math.min(urls.length, max_number);

            urls = this.shuffle(urls);
            urls.forEach(function (_a, _i) {
                if (_i < _z) {
                    fetch('//' + _a + path, option)
                        .then(
                            (function (r) { return r.json(); }),
                            (function (r) { return { code: 999, msg: r.message }; })
                        )
                        .then(
                            (function (r) {
                                try {
                                    _t.push({
                                        host: _a,
                                        data: r.data
                                    });
                                } catch (e) {}

                                if (_n++ === _z - 1) {
                                    try {
                                        callback(_t);
                                    } catch (e) {}
                                }
                            })
                        );
                }
            });
        },

        shuffle: function (a) {
            return a.map(v => ({ v, i: Math.random() }))
                .sort((x, y) => x.i - y.i)
                .map(({ v }) => v)
        },
    };
})();