(function () {
    var saseul = SASEUL, core = saseul.Core, enc = saseul.Enc, sign = saseul.Sign, func = saseul.Rpc = {
        default_peers: [
            'main.saseul.net',
            'aroma.saseul.net',
            'blanc.saseul.net',
        ],

        ping: function (host_array) {
            if (typeof host_array !== 'object') {
                host_array = this.default_peers;
            }

            return new Promise(function (resolve) {
                func._searchPeers(host_array, function (result) {
                    func._queryRounds(result, function (result) {
                        resolve(result);
                    })
                })
            });
        },

        searchPeers: function (host_array) {
            if (typeof host_array !== 'object') {
                host_array = this.default_peers;
            }

            return new Promise(function (resolve) {
                func._searchPeers(host_array, function (result) {
                    resolve(result);
                })
            });
        },

        _searchPeers: function (host, callback) {
            func.multi(host, '/peer', { method: "POST", mode : "cors" },
                function (result) {
                    var peer_array = [];
                    result.forEach(function (req) {
                        try {
                            Object.values(req.data.peers).forEach(function (peer) {
                                peer_array.push(peer.host);
                            });
                        } catch (e) {}
                    });
                    callback([...new Set(peer_array)]);
            });
        },

        queryRounds: function (host_array) {
            if (typeof host_array !== 'object') {
                host_array = this.default_peers;
            }

            return new Promise(function (resolve) {
                func._queryRounds(host_array, function (result) {
                    resolve(result);
                })
            });
        },

        _queryRounds: function (host, callback) {
            func.multi(
                host, '/round?chain_type=all', { method: "POST", mode : "cors" },
                function (result) {
                    var items = [];
                    result.forEach(function (req) {
                        try {
                            items.push({
                                host: req.host,
                                main: req.data.main.block,
                                resource: req.data.resource.block
                            });
                        } catch (e) {}
                    });
                    callback(items);
                }
            );
        },

        transaction: function (data, private_key) {
            if (typeof private_key !== "string") {
                private_key = sign.privateKey();
            }

            return this.data(data, private_key);
        },

        request: function (data, private_key) {
            if (typeof private_key !== "string") {
                private_key = sign.privateKey();
            }

            return this.data(data, private_key, "request");
        },

        data: function (item, private_key, type = "transaction") {
            var result = {};

            try {
                item.from = sign.address(sign.publicKey(private_key));

                if (typeof item.timestamp !== 'number') {
                    item.timestamp = core.utime();
                }

                result[type] = item;
                result.public_key = sign.publicKey(private_key);
                result.signature = sign.signature(enc.txHash(item), private_key);

                return result;

            } catch (_e) {
                if (!sign.keyValidity(private_key)) {
                    console.error('Invalid private key: ' + private_key);
                    return {};
                }

                console.error(_e);
                return {};
            }
        },

        send: function (data, host) {
            var url_path, body = new FormData();

            if (typeof host !== "string") {
                console.error('The host URL is required. ');
                return new Promise(function (resolve) {
                    resolve({ code: 999, msg: "The host URL is required. " });
                });
            }

            if (typeof data.transaction === "object") {
                body.append("transaction", enc.string(data.transaction));
                url_path = host + '/sendtransaction';
            } else {
                body.append("request", enc.string(data.request));
                url_path = host + '/request';
            }

            body.append("public_key", data.public_key);
            body.append("signature", data.signature);

            return new Promise(function (resolve) {
                func._send(body, url_path, function (result) {
                    resolve(result);
                })
            });
        },

        _send: function (body, url_path, callback) {
            fetch(func.wrapUrl(url_path), {
                method: "POST",
                mode: "cors",
                body: body,
            }).then(
                (function (result) { return result.json() }),
                (function (result) { return { code: 999, msg: result.message }; })
            ).then(
                (function (result) {
                    callback(result);
                })
            );
        },

        multi: function (urls, path, option, callback, max_number = 9) {
            var items = [], req_count = 0, req_limit = Math.min(urls.length, max_number);

            urls = this.shuffle(urls);
            urls.forEach(function (host, i) {
                if (i < req_limit) {
                    fetch(func.wrapUrl(host + path), option)
                        .then((function (result) { return result.json(); }),
                            (function (result) { return { code: 999, msg: result.message }; }))
                        .then((function (result) {
                                try {
                                    items.push({
                                        host: host,
                                        data: result.data
                                    });
                                } catch (e) {}

                                if (req_count++ === req_limit - 1) {
                                    try {
                                        callback(items);
                                    } catch (e) {}
                                }
                            }));
                }
            });
        },

        shuffle: function (array) {
            return array.map(v => ({ v, i: Math.random() }))
                .sort((x, y) => x.i - y.i)
                .map(({ v }) => v)
        },

        wrapUrl: function (url_path) {
            if (url_path.substring(0, 7) === 'http://' || url_path.substring(0, 8) === 'https://' || url_path.substring(0, 2) === '//') {
                return url_path;
            }

            return '//' + url_path;
        }
    };
})();