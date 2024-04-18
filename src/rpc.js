;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory(require("./core"), require("axios"));
    } else if (typeof define === "function" && define.amd) {
        define(["./core", "axios"], factory);
    } else {
        factory(root.SASEUL, axios);
    }
}(this, function (SASEUL, axios) {
    /* start source */
    (function () {
        var saseul = SASEUL, util = saseul.Util, enc = saseul.Enc, sign = saseul.Sign, rpc = saseul.Rpc = {
            _default_peers: ['https://main.saseul.net', 'https://sub.saseul.net', 'https://aroma.saseul.net', 'https://blanc.saseul.net'],
            _endpoints: null,
            _timeout: 30000,
            _headers: {},
            _broadcast_limit: 32,

            endpoint: function (endpoint) {
                const endpoints = this.endpoints(endpoint);
                const index = Math.floor(Math.random() * endpoints.length);

                return endpoints[index];
            },

            endpoints: function (endpoints) {
                if (typeof endpoints === 'object') {
                    this._endpoints = Object.values(endpoints);
                } else if (typeof endpoints !== 'undefined') {
                    this._endpoints = [String(endpoints)];
                }

                if (!this._endpoints) {
                    return this._default_peers;
                }

                return this._endpoints;
            },

            timeout: function (timeout) {
                if (typeof timeout === 'number' && timeout > 0) {
                    this._timeout = timeout;
                }

                return this._timeout;
            },

            headers: function (headers) {
                if (typeof headers === 'object') {
                    this._headers = headers;
                }

                return this._headers;
            },

            broadcastLimit: function (limit) {
                if (typeof limit === 'number' && limit > 0) {
                    this._broadcast_limit = limit;
                }

                return this._broadcast_limit;
            },

            tracker: function () {
                return this.get('peer', {});
            },

            trackerFromAll: function () {
                return new Promise((resolve, reject) => {
                    rpc.all("GET", 'peer', {}).then(r => {
                        let results = {
                            peers: [],
                            known_hosts: [],
                        };

                        r.forEach(item => {
                            if (item.data && item.data.peers && item.data.known_hosts
                                && typeof item.data.peers === 'object' && Array.isArray(item.data.known_hosts)) {
                                results.peers.push(Object.values(item.data.peers));
                                results.known_hosts.push(item.data.known_hosts);
                            }
                        });

                        if (results.peers.length > 0) {
                            results.peers = util.flatMerge(results.peers);
                            results.known_hosts = util.flatMerge(results.known_hosts);

                            resolve(results);
                        } else {
                            reject(r);
                        }
                    });
                });
            },

            peer: function () {
                return new Promise((resolve, reject) => {
                    rpc.tracker().then(r => resolve(Object.values(r.data.peers))).catch(reject);
                });
            },

            peerFromAll: function () {
                return new Promise((resolve, reject) => {
                    rpc.all("GET", 'peer', {}).then(r => {
                        let peers = [];

                        r.forEach(item => {
                            if (item.data && item.data.peers && typeof item.data.peers === 'object') {
                                peers.push(Object.values(item.data.peers));
                            }
                        });

                        if (peers.length > 0) {
                            peers = util.flatMerge(peers);
                            resolve(peers);
                        } else {
                            reject(r);
                        }
                    });
                });
            },

            ping: function () {
                return this.get('ping', {});
            },

            round: function () {
                return this.get('round', { chain_type: "all" });
            },

            bestRound: function () {
                return new Promise((resolve, reject) => {
                    this.all("GET", 'round', { chain_type: "all" }).then(r => {
                        let data = r;
                        let max_mheight = Math.max(...data.map(obj => (obj.data ? obj.data.main.block.height : 0)));
                        let max_rheight = Math.max(...data.map(obj => (obj.data ? obj.data.resource.block.height : 0)));

                        let max_mblock = data.find(obj => obj.data && obj.data.main.block.height === max_mheight);
                        let max_rblock = data.find(obj => obj.data && obj.data.resource.block.height === max_rheight);

                        if (!max_mblock || !max_rblock) {
                            reject({
                                main: null,
                                resource: null,
                            });
                        } else {
                            resolve({
                                main: max_mblock.data.main.block,
                                resource: max_rblock.data.resource.block,
                            });
                        }
                    }).catch(reject);
                });
            },

            signedRequest: function (item, private_key) {
                return this.signedData(item, private_key, 'request');
            },

            simpleRequest: function (item) {
                return { request: item };
            },

            signedTransaction: function (item, private_key) {
                return this.signedData(item, private_key, 'transaction');
            },

            request: function (signed_request) {
                return this.get('request', signed_request);
            },

            raceRequest: function (signed_request, condition = () => true) {
                return this.race("GET", 'request', signed_request, condition);
            },

            sendTransaction: function (signed_transaction) {
                return this.post('sendtransaction', signed_transaction);
            },

            sendTransactionToAll: function (signed_transaction) {
                return this.all("POST", 'sendtransaction', signed_transaction);
            },

            broadcastTransaction: function (signed_transaction) {
                return new Promise((resolve, reject) => {
                    this.peerFromAll().then(peers => {
                        let limit = rpc.broadcastLimit() - rpc.endpoints().length;
                        let targets = util.merge(rpc.endpoints(), util.randomSlice(peers, limit).map(o => o.host));

                        rpc._all(targets, "POST", 'sendtransaction', signed_transaction, () => true, r => {
                            let f = r.filter(o => o.code === 200);

                            if (f.length > 0) {
                                resolve(f[0]);
                            } else {
                                let m = Math.max(...r.map(o => o.code));
                                let f = r.filter(o => o.code === m);

                                if (f.length > 0) {
                                    reject(f[0]);
                                } else {
                                    reject(r[0]);
                                }
                            }
                        });
                    }).catch(reject);
                });
            },

            estimatedFee: function (signed_transaction) {
                const length = JSON.stringify(signed_transaction).length;

                return new Promise((resolve, reject) => {
                    this.race("POST", 'weight', signed_transaction, util.isInt).then(r => {
                        let weight = parseInt((r.data || '0'));
                        let fee = weight === length ? (length + 336) * 1000000000 : weight * 1000000000;

                        resolve(fee);
                    }).catch(e => {
                        reject(e);
                    })
                });
            },

            // ---

            get: function (path, data) {
                return this.fetch("GET", path, data);
            },

            post: function (path, data) {
                return this.fetch("POST", path, data);
            },

            fetch: function (method, path, data) {
                return new Promise(function (resolve, reject) {
                    let item = rpc.axiosItem(rpc.endpoint(), method, path, data, rpc.headers());
                    axios(item).then(r => {
                        if (r.data && r.data.code) {
                            resolve(r.data);
                        } else {
                            reject({ code: 901, msg: "Invalid response parameter" });
                        }
                    }).catch(error => {
                        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                            reject({ code: 408, msg: 'Request timed out' });
                        } else if (error.response && error.response.data && error.response.data.code) {
                            resolve(error.response.data);
                        } else if (error.response.status && error.response.statusText && error.response.data) {
                            reject({ code: error.response.status, msg: error.response.statusText, data: error.response.data });
                        } else {
                            reject(error);
                        }
                    });
                });
            },

            signedData: function (item, private_key, type = "transaction") {
                if (!private_key) {
                    private_key = SASEUL.Sign.privateKey();
                }

                if (!sign.keyValidity(private_key)) {
                    console.error('Invalid private key: ' + private_key);
                    return {};
                }

                let data = {};

                item.from = sign.address(sign.publicKey(private_key));

                if (typeof item.timestamp !== 'number') {
                    item.timestamp = util.utime() + (type === 'transaction' ? 2000000 : 0);
                }

                data[type] = item;
                data.public_key = sign.publicKey(private_key);
                data.signature = sign.signature(enc.txHash(item), private_key);

                return data;
            },

            axiosItem: function (endpoint, method, path, data, headers) {
                let item = {
                    method: method,
                    url: `${util.wrappedEndpoint(endpoint)}/${path}`,
                    timeout: rpc.timeout()
                };

                if (typeof headers === 'object' && Object.keys(headers).length > 0) {
                    item.headers = headers;
                }

                if (method === "GET") {
                    let params = [];

                    for (let key in data) {
                        params.push(`${key}=${util.string(data[key])}`);
                    }

                    item.url = item.url + (Object.keys(data).length === 0 ? '' : '?' + params.join('&'));
                } else {
                    let params = new FormData();

                    for (let key in data) {
                        params.set(key, util.string(data[key]));
                    }

                    item.data = params;
                }

                return item;
            },

            race: function (method, path, data, condition = () => true) {
                const endpoints = this.endpoints();
                return new Promise(function (resolve, reject) {
                    rpc._race(endpoints, method, path, data, condition, resolve, reject);
                });
            },

            _race: function (endpoints, method, path, data, condition = () => false, success = () => {}, fallback = () => {}) {
                if (!Array.isArray(endpoints) || endpoints.length === 0) {
                    fallback();
                }

                try {
                    let count = 0;
                    let results, item, cancel;
                    let token = new axios.CancelToken(c => cancel = c);

                    let tasks = endpoints.map(endpoint => {
                        item = rpc.axiosItem(endpoint, method, path, data, rpc.headers());
                        item.cancelToken = token;

                        axios(item).then(r => {
                            if (r.data && r.data.code && condition(r.data.data)) {
                                success(r.data);
                                cancel();
                            } else {
                                count++;
                            }
                        }).catch(error => {
                            count++

                            if (!results) {
                                if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                                    results = { code: 408, msg: 'Request timed out' };
                                } else if (error.response && error.response.data && error.response.data.code) {
                                    results = error.response.data;
                                } else if (error.response && error.response.status) {
                                    results = { code: error.response.status, msg: error.response.statusText, data: error.response.data };
                                } else {
                                    results = error;
                                }
                            }
                        }).finally(() => count >= endpoints.length && fallback(results))
                    });

                    Promise.race(tasks).then();
                } catch (e) {
                    console.error(e);
                }
            },

            all: function (method, path, data, condition = () => true) {
                const endpoints = this.endpoints();
                return new Promise(function (resolve) {
                    rpc._all(endpoints, method, path, data, condition, resolve);
                });
            },

            _all: function (endpoints, method, path, data, condition = () => true, success = () => {}) {
                if (!Array.isArray(endpoints) || endpoints.length === 0) {
                    fallback();
                }

                try {
                    let results = [];
                    let item;
                    let tasks = endpoints.map(endpoint => {
                        item = rpc.axiosItem(endpoint, method, path, data, rpc.headers());

                        axios(item).then(r => {
                            if (r.data && r.data.code && condition(r.data.data)) {
                                results.push({ endpoint: endpoint, code: r.data.code, data: r.data.data });
                            } else {
                                results.push({ endpoint: endpoint, msg: 'Condition not met' });
                            }
                        }).catch(error => {
                            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                                results.push({ endpoint: endpoint, code: 408, msg: 'Request timed out' });
                            } else if (error.response && error.response.data && error.response.data.code) {
                                let r = error.response.data;
                                r.endpoint = endpoint;
                                results.push(r);
                            } else if (error.response && error.response.status) {
                                results.push({ endpoint: endpoint, code: error.response.status, msg: error.response.statusText, data: error.response.data });
                            } else {
                                results.push({ endpoint: endpoint, error: error });
                            }
                        }).finally(() => {
                            if (results.length >= endpoints.length) {
                                success(results);
                            }
                        });
                    });

                    Promise.race(tasks).then();
                } catch (e) {
                    console.error(e);
                }
            },
        };
    })();
    /* end source */

    return SASEUL.Rpc;

}));
