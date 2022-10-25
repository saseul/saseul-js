'use strict'

const fetch = require('node-fetch');
const Signer = require('./../util/signer');
const Factory = require("./factory");
const Config = require("../config");
const Clock = require("../util/clock");
const CODE = require("../code");
const Hasher = require("../util/hasher");
const ABI = require("../core/abi");
const FormData = require("form-data");

module.exports = class Sender {

    #ABI = new ABI();
    host = null;
    private_key = null;
    protocol = 'http';

    constructor(host = null, private_key = null) {
        try {
            this.Host(host);
            this.PrivateKey(private_key);
        } catch (e) {
            throw e;
        }
    }

    Host(host = null) {
        if(typeof host === 'string' && !host.startsWith(this.protocol)) host = `${this.protocol}://${host}`;
        this.host = host ?? this.host;

        return this.host;
    }

    PrivateKey(private_key = null) {
        this.private_key = private_key ?? this.private_key;
        if(this.private_key === null) this.private_key = Signer.PrivateKey();

        return this.private_key;
    }

    async RPC(rpc, data = {}) {
        try {
            let body, headers;
            if(typeof window === 'undefined') {
                body = JSON.stringify(data);
                headers = {'Content-Type': 'application/json;charset=utf-8'};
            } else {
                const keys = Object.keys(data);
                const form = new FormData();

                keys.forEach(key => { form.append(key, data[key]); });
                body = form;
                headers = {};
            }

            return await fetch(`${this.host}/${rpc}`, {
                method: 'POST',
                headers: headers,
                body: body,
            })
                .then(res => res.json())
                .then(res => {
                    if(res.code && res.code !== 200) throw res;
                    return res;
                })
                .catch(e => {
                    throw e;
                });
        } catch (e) {
            throw e;
        }
    }

    Request(request = {}, public_key = '', signature = '') {
        try {
            if(typeof request === 'object') request = JSON.stringify(request);

            return this.RPC('request', {
                request: request,
                public_key: public_key,
                signature: signature,
            });
        } catch (e) {
            throw e;
        }
    }

    RawRequest(request = {}, public_key = '', signature = '') {
        try {
            return this.RPC('rawrequest', {
                request: request,
                public_key: public_key,
                signature: signature,
            });
        } catch (e) {
            throw e;
        }
    }

    SendTransaction(transaction = {}, public_key = '', signature = '') {
        try {
            if(typeof transaction === 'object') transaction = JSON.stringify(transaction);
            return this.RPC('sendtransaction', {
                transaction: transaction,
                public_key: public_key,
                signature: signature,
            });

        } catch (e) {
            throw e;
        }
    }

    SendTransactionWithResult(signedTransaction, waitMicroSeconds = 60000000, blockSearchPadding = 10) {
        try {
            return this.SendTransaction(signedTransaction.data, signedTransaction.public_key, signedTransaction.signature).then(async res => {
                let err = res.code !== CODE.OK;

                // Saseul backwards compatibility
                if (res.hasOwnProperty('data')) {
                    // after v2.1.1
                    err = err || res.data !== 'Transaction is added';
                } else if (res.hasOwnProperty('msg')) {
                    // before v2.1.1
                    err = err || res.msg !== 'Transaction is added';
                } else {
                    err = true;
                }

                if (err) throw res;
                return await this.Checker.TransactionResult(signedTransaction, waitMicroSeconds, blockSearchPadding).catch(e => {
                    throw e;
                });
            }).catch(e => {
                throw e;
            });

        } catch (e) {
            throw e;
        }
    }

    SendRawTransaction(transaction = {}, public_key = '', signature = '') {
        try {
            return this.RPC('sendrawtransaction', {
                transaction: transaction,
                public_key: public_key,
                signature: signature,
            });
        } catch (e) {
            throw e;
        }
    }

    Broadcast(chain_type='main', round_key='') {
        try {
            return this.RPC('broadcast',{
                chain_type: chain_type,
                round_key: round_key
            });
        } catch (e) {
            throw e;
        }
    }

    Info() {
        try {
            return this.RPC('info');
        } catch (e) {
            throw e;
        }
    }

    Main() {
        try {
            return this.RPC('main');
        } catch (e) {
            throw e;
        }
    }

    Peer(prefix='', register=0, host='', authentication=0, height=0) {
        try {
            return this.RPC('peer',{
                prefix: prefix,
                register: register,
                host: host,
                authentication: authentication,
                height: height
            });
        } catch (e) {
            throw e;
        }
    }

    Ping() {
        try {
            return this.RPC('ping');
        } catch (e) {
            throw e;
        }
    }

    Round(chain_type='main',height=null) {
        try {
            return this.RPC('round',{
                chain_type: chain_type,
                height: height
            });
        } catch (e) {
            throw e;
        }
    }

    Status(signed_query={}) {
        try {
            return this.RPC('status',{
                signed_query: JSON.stringify(signed_query),
            });
        } catch (e) {
            throw e;
        }
    }

    Weight(signedTransaction = {}) {
        try {
            return this.RPC('weight',{
                transaction: JSON.stringify(signedTransaction.data),
                public_key: signedTransaction.public_key,
                signature: signedTransaction.signature,
            });
        } catch (e) {
            throw e;
        }
    }

    Checker = {
        /**
         * Get byte fee of the network
         * @returns {Promise<string>}
         * @constructor
         */
        ByteFee: () => {
            try {
                // TODO. fetch from Fee contract
                let feeAmount = '1000000000';

                // let feeAmount = null;
                // const contractType = 'Fee';
                // const ctype = 'contract';
                // const cid = Hasher.IdHash([contractType, Config.RootSpace()]).padEnd(Hasher.STATUS_KEY_SIZE, '0');
                // const contractIndex = `${Config.ContractPrefix()}${cid}`;
                // const signedRequestGetCode = Factory.Request('GetCode', {target: cid, ctype: ctype}, this.private_key);
                // const getCode = await this.Request(
                //     signedRequestGetCode.data,
                //     signedRequestGetCode.public_key,
                //     signedRequestGetCode.signature
                // ).catch(e => {
                //     return {};
                // });
                //
                // if(getCode.data === undefined || getCode.data === null) throw `GetCode "${contractType}" failed. `;
                // if(!getCode.data[cid] && !getCode.data[contractIndex]) throw `Contract "${contractType}" doesn\'t exist. `;
                //
                // const contractData = getCode.data[contractIndex] ?? getCode.data[cid];
                // const contract = JSON.parse(contractData);
                // const resourceIncreaseUpdate = contract.updates.find(item => {
                //     return item.hasOwnProperty("$write_local") &&
                //         item['$write_local'][0] === 'recycle_resource' &&
                //         item['$write_local'][2].hasOwnProperty('$add');
                // });
                //
                // if(!resourceIncreaseUpdate) return feeAmount;
                //
                // const byteFeeSearchArray = JSON.stringify(resourceIncreaseUpdate).split(JSON.stringify(this.#ABI.Contract.Param('size')) + ',');
                // const size = this.#ABI.Contract.Param('size');
                // let byteFee = byteFeeSearchArray[1].split(',')[0].replace(/"/g, ``);
                // let fee = this.#ABI.Math.PreciseMul(size, byteFee, 0);
                // let feeExists = JSON.stringify(resourceIncreaseUpdate).indexOf(JSON.stringify(fee));
                //
                // if(feeExists < 0) {
                //     byteFee = byteFeeSearchArray[0].split(',')[byteFeeSearchArray[0].split(',').length - 1].replace(/"/g, ``);
                //     fee = this.#ABI.Math.PreciseMul(byteFee, size, 0);
                //     feeExists = JSON.stringify(resourceIncreaseUpdate).indexOf(JSON.stringify(fee));
                // }
                // if(feeExists >= 0) feeAmount = byteFee;

                return feeAmount;

            } catch (e) {
                throw e;
            }
        },
        /**
         * Get result of send-transaction
         * @param signedTransaction : signedTransaction
         * @param waitMicroSeconds : microseconds
         * @param blockSearchPadding : number
         * @returns {Promise<unknown>}
         * @constructor
         */
        TransactionResult: (signedTransaction, waitMicroSeconds = Config.CONFIRM_INTERVAL, blockSearchPadding = 10) => {
            try {
                if(!Number.isInteger(blockSearchPadding)) throw `blockSearchPadding must be an integer.`;
                if(!Number.isInteger(waitMicroSeconds)) throw `waitMicroSeconds must be an integer.`;
                if(!Number.isInteger(signedTransaction.timestamp)) throw `signedTransaction.timestamp must be an integer.`;
                if(!Hasher.IsHex(signedTransaction.hash)) throw `signedTransaction.hash must be a hex string.`;

                const recursiveCheckResult = async () => {
                    try {
                        const status = {
                            pending: 'pending',
                            reject: 'reject',
                            accept: 'accept',
                        };
                        const latestBlock = await this.Round();
                        if(latestBlock.data.block.s_timestamp < signedTransaction.timestamp) return { status: status.pending };
                        else {
                            const signedRequestGetTransaction = Factory.Request('GetTransaction', {target: signedTransaction.hash}, this.private_key);
                            const getTransaction = await this.Request(
                                signedRequestGetTransaction.data,
                                signedRequestGetTransaction.public_key,
                                signedRequestGetTransaction.signature
                            ).catch(e => {
                                return {};
                            });
                            let data = getTransaction.data || {};
                            if(data.transaction === undefined || data.transaction === null) data = {};
                            data.hash = signedTransaction.hash;
                            data.block = null;

                            if(data.transaction !== undefined && data.transaction !== null){
                                let searchBlockTarget = latestBlock.data.block.height + blockSearchPadding;

                                while(data.block === null && searchBlockTarget + blockSearchPadding >= latestBlock.data.block.height) {
                                    const signedRequestGetBlock = Factory.Request('GetBlock', {target: searchBlockTarget, full: true}, this.private_key);
                                    const getBlock = await this.Request(
                                        signedRequestGetBlock.data,
                                        signedRequestGetBlock.public_key,
                                        signedRequestGetBlock.signature
                                    ).catch(e => {
                                        return {};
                                    });
                                    if(
                                        getBlock.data &&
                                        getBlock.data.transactions &&
                                        getBlock.data.transactions.hasOwnProperty(signedTransaction.hash)
                                    ) {
                                        data.block = getBlock.data;
                                    } else searchBlockTarget--;
                                }
                                data.status = status.accept;
                            } else {
                                data.status = status.reject;
                            }

                            return data;
                        }
                    } catch (e) {
                        throw e;
                    }
                }

                return new Promise(async (resolve, reject) => {
                    try {
                        let transactionResult = { status: 'pending' };
                        const limit = Clock.Utime() + Number(waitMicroSeconds);
                        while(transactionResult.status === 'pending' && Clock.Utime() < limit) {
                            transactionResult = await recursiveCheckResult();
                            if(transactionResult.status !== 'pending') break;
                        }
                        if(transactionResult.status !== undefined && transactionResult.status !== null) resolve(transactionResult);
                        else reject(transactionResult);
                    } catch (e) {
                        throw e;
                    }
                });
            } catch (e) {
                throw e;
            }
        }
    }
}