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
            _endpoint: '',
            _peers: [],

            endpoint: function (endpoint) {
                if (typeof endpoint === 'undefined') {
                    return this._endpoint;
                }

                if (typeof endpoint !== 'string') {
                    console.error('endpoint should be of string type.');
                    return this._endpoint;
                }

                this._endpoint = endpoint;
                return this._endpoint;
            },

            peer: function () {
                return new Promise(function (resolve, reject) {
                    rpc.tracker().then(function (r) {
                        let result = [];

                        if (typeof r.data !== 'undefined') {
                            for (let i in r.data.peers) {
                                result.push(r.data.peers[i]);
                            }

                        }

                        resolve(result);
                    }).catch(function (e) {
                        reject(e);
                    });
                });
            },

            tracker: function () {
                return rpc.call('/peer', [], true);
            },

            call: function (path, data, raw = false) {
                if (this.endpoint() === '') {
                    console.error('Please use the "SASEUL.Rpc.endpoint" function to set the endpoint for invoking RPC.');
                    return [];
                }

                return new Promise(function (resolve, reject) {
                    axios({
                        method: "POST",
                        url: util.wrappedEndpoint(rpc.endpoint()) + path,
                        data: data,
                        timeout: 1000,
                    }).then(function (r) {
                        if (typeof r.data.code !== 'undefined') {
                            if (typeof r.data.data !== 'undefined' && raw === false) {
                                resolve(r.data.data);
                            } else {
                                resolve(r.data);
                            }
                        } else {
                            reject(r.data);
                        }
                    }).catch(function (e) {
                        if (typeof e.response === 'undefined') {
                            reject(e);
                        } else if (typeof e.response.data === 'undefined') {
                            reject(e.response);
                        } else {
                            resolve(e.response.data);
                        }
                    });
                });
            },

            ping: function () {
                return this.call('/ping', [], true);
            },

            round: function () {
                return this.call('/round', {"chain_type":"all"}, true);
            },

            signedTransaction: function (item, private_key) {
                return this.signedData(item, private_key);
            },

            signedRequest: function (item, private_key) {
                return this.signedData(item, private_key, "request");
            },

            signedData: function (item, private_key, type = "transaction") {
                if (typeof private_key === 'undefined') {
                    private_key = SASEUL.Sign.privateKey();
                }

                if (!sign.keyValidity(private_key)) {
                    console.error('Invalid private key: ' + private_key);
                    return {};
                }

                let data = {};

                item.from = sign.address(sign.publicKey(private_key));

                if (typeof item.timestamp !== 'number') {
                    item.timestamp = util.utime() + 1000000;
                }

                data[type] = item;
                data.public_key = sign.publicKey(private_key);
                data.signature = sign.signature(enc.txHash(item), private_key);

                return data;
            },

            estimatedFee: function (signed_transaction) {
                let data = '', length = JSON.stringify(signed_transaction).length;

                data+= 'transaction=' + encodeURIComponent(enc.string(signed_transaction.transaction));
                data+= '&public_key=' + signed_transaction.public_key;
                data+= '&signature=' + signed_transaction.signature;

                return new Promise(function (resolve, reject) {
                    rpc.call('/weight', data, false).then(function (rs) {
                        if (parseInt(length) === parseInt(rs)) {
                            resolve((parseInt(length) + 336) * 1000000000);
                        } else {
                            resolve(parseInt(rs) * 1000000000);
                        }
                    }).catch(reject);
                });
            },

            request: function (signed_request) {
                return this.call('/rawrequest', enc.string(signed_request), true);
            },

            sendTransaction: function (signed_transaction) {
                return this.call('/sendrawtransaction', enc.string(signed_transaction), true);
            },

            _broadcast: function (endpoint, signed_transaction) {
                axios({
                    method: "POST",
                    url: util.wrappedEndpoint(endpoint) + '/sendrawtransaction',
                    data: enc.string(signed_transaction),
                    timeout: 1000,
                }).then().catch(function (e) {});
            },

            broadcastTransaction: function (signed_transaction) {
                return new Promise(function (resolve, reject) {
                    rpc.peer().then(function (r) {
                        if (r.length > 1) {
                            r.sort((x, y) => x.address.localeCompare(y.address));

                            rpc.sendTransaction(signed_transaction).then(function (rs) {
                                if (rs.code === 200) {
                                    let l = r.length - 1;

                                    for (let i = 1; i < r.length; i = i * 2) {
                                        rpc._broadcast(r[i - 1].host, signed_transaction);
                                        rpc._broadcast(r[i].host, signed_transaction);
                                    }

                                    rpc._broadcast(r[l - 1].host, signed_transaction);
                                    rpc._broadcast(r[l].host, signed_transaction);
                                }

                                resolve(rs);
                            }).catch(function (e) {
                                reject(e);
                            });
                        } else if (r.length === 1) {
                            rpc.sendTransaction(signed_transaction).then(function (rs) {
                                resolve(rs);
                            }).catch(function (e) {
                                reject(e);
                            });
                        }
                    }).catch(function (e) { reject(e); });
                });
            },
        };
    })();
    /* end source */

    return SASEUL.Rpc;

}));
