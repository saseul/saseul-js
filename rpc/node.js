'use strict'

const Sender = require("./sender");

module.exports = class Node {

    default_peers = [];

    constructor(default_peers = []) {
        try {
            if(!Array.isArray(default_peers)) throw 'default_peers must be an array';
            this.default_peers = default_peers;

        } catch (e) {
            throw e;
        }
    }

    async HostRound(host) {
        try {
            const round = await new Sender(host).Round();
            return {
                host,
                round
            }
        } catch (e) {
            throw e;
        }
    }

    async GetHost(hosts = [], candidateCount = 10) {
        try {
            let waitCount = 0;
            let candidates = [];
            if(hosts.length === 0) hosts = this.default_peers;
            if(!hosts) throw 'host unavailable.';
            if(hosts.length === 0) throw 'host is not set.';

            return await new Promise((resolve, reject) => {
                for(let i = 0; i < hosts.length; i++) {
                    try {
                        this.HostRound(hosts[i]).then(res => {
                            candidates.push({
                                host: res.host,
                                height: res.round.data.block.height
                            });
                            waitCount++;
                        });
                    } catch (e) {
                        continue;
                    }
                }
                const interval = setInterval(() => {
                    if(waitCount >= candidateCount || (hosts.length < candidateCount && waitCount >= hosts.length - 1 && waitCount > 0)) {
                        clearInterval(interval);
                        candidates = candidates.sort((a, b) => {
                            return b.height - a.height;
                        });
                        resolve(candidates[0]);
                    }
                }, 10);
            });
        } catch (e) {
            throw e;
        }
    }

    async GetPeers() {
        try {
            const host = await this.GetHost();
            const node = new Sender(host.host);
            const peersObj = (await node.Peer()).data.peers;
            const peers = [];

            for (const peersObjKey in peersObj) {
                let host = peersObj[peersObjKey].host;
                peers.push(host);
            }

            return peers;
        } catch (e) {
            throw e;
        }
    }

}