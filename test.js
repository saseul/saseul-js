const SASEUL = require('./index');

let test = {
    "SASEUL.Util.time": SASEUL.Util.time(),
    "SASEUL.Util.utime": SASEUL.Util.utime(),
    "SASEUL.Util.randomHexString": SASEUL.Util.randomHexString(16),
    "SASEUL.Util.hexToByte": SASEUL.Util.hexToByte("4d8ba12d63613dda822a69bc5ac1c589"),
    "SASEUL.Util.byteToHex": SASEUL.Util.byteToHex([ 77, 139, 161,  45, 99, 97,  61, 218, 130, 42, 105, 188,  90, 193, 197, 137 ]),
    "SASEUL.Util.stringToByte": SASEUL.Util.stringToByte("Lorem ipsum"),
    "SASEUL.Util.stringToUnicode": SASEUL.Util.stringToUnicode("다람쥐헌쳇바퀴에타고파"),
    "SASEUL.Util.isHex": SASEUL.Util.isHex("62b7341d7271ea3b5ad12011a9467d8ba2736623"),

    "SASEUL.Enc.string": SASEUL.Enc.string({}),
    "SASEUL.Enc.hash": SASEUL.Enc.hash({}),
    "SASEUL.Enc.shortHash": SASEUL.Enc.shortHash({}),
    "SASEUL.Enc.checksum": SASEUL.Enc.checksum('62b7341d7271ea3b5ad12011a9467d8ba2736623'),
    "SASEUL.Enc.hextime": SASEUL.Enc.hextime(1681133629023000),
    "SASEUL.Enc.timeHash": SASEUL.Enc.timeHash({}, 1681133629023000),
    "SASEUL.Enc.timeHashValidity": SASEUL.Enc.timeHashValidity('05f8fb6cc7231844136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'),
    "SASEUL.Enc.idHash": SASEUL.Enc.idHash({}),
    "SASEUL.Enc.idHashValidity": SASEUL.Enc.idHashValidity('62b7341d7271ea3b5ad12011a9467d8ba2736623be3b'),
    "SASEUL.Enc.cid": SASEUL.Enc.cid("62b7341d7271ea3b5ad12011a9467d8ba2736623be3b", "Lorem ipsum"),
    "SASEUL.Enc.txHash": SASEUL.Enc.txHash({}),
    "SASEUL.Enc.isHex": SASEUL.Enc.isHex('62b7341d7271ea3b5ad12011a9467d8ba2736623'),
    "SASEUL.Enc.parseCode": SASEUL.Enc.parseCode({}),

    "SASEUL.Sign.keyPair": SASEUL.Sign.keyPair(),
    "SASEUL.Sign.privateKey": SASEUL.Sign.privateKey(),
    "SASEUL.Sign.publicKey": SASEUL.Sign.publicKey('cd654a234b59a64c20781243d161f8b40b9e87d4ea2be1904e66497e22ccefa9'),
    "SASEUL.Sign.address": SASEUL.Sign.address('107acd459a0522abc4bab6719e30622bd9e08a9a54cd75dd76ce3f5f9dae846d'),
    "SASEUL.Sign.addressValidity": SASEUL.Sign.addressValidity('4c717ef70937f957bbec120e2750192b9faeb139a48b'),
    "SASEUL.Sign.signature": SASEUL.Sign.signature({}, 'cd654a234b59a64c20781243d161f8b40b9e87d4ea2be1904e66497e22ccefa9'),
    "SASEUL.Sign.signatureValidity": SASEUL.Sign.signatureValidity({}, '107acd459a0522abc4bab6719e30622bd9e08a9a54cd75dd76ce3f5f9dae846d', '5bee79b196bf77077f9f5c97c3775ce90dd1676e25bbad21268edcbe2a607c253dad3b367e89f8d3b0605304ab299b88b78e73ed1fb6019bd60c9f2d2cdc4506'),
    "SASEUL.Sign.keyValidity": SASEUL.Sign.keyValidity('cd654a234b59a64c20781243d161f8b40b9e87d4ea2be1904e66497e22ccefa9'),

    "SASEUL.Rpc.endpoint": SASEUL.Rpc.endpoint('https://blanc.saseul.net'),
    "SASEUL.Rpc.endpoints": SASEUL.Rpc.endpoints(["https://main.saseul.net", "https://sub.saseul.net", "https://blanc.saseul.net"]),
    "SASEUL.Rpc.timeout": SASEUL.Rpc.timeout(5000),
    "SASEUL.Rpc.headers": SASEUL.Rpc.headers({ Origin: "https://example.com" }),
    "SASEUL.Rpc.tracker": SASEUL.Rpc.tracker(),
    "SASEUL.Rpc.trackerFromAll": SASEUL.Rpc.trackerFromAll(),
    "SASEUL.Rpc.peer": SASEUL.Rpc.peer(),
    "SASEUL.Rpc.peerFromAll": SASEUL.Rpc.peerFromAll(),
    "SASEUL.Rpc.ping": SASEUL.Rpc.ping(),
    "SASEUL.Rpc.round": SASEUL.Rpc.round(),
    "SASEUL.Rpc.bestRound": SASEUL.Rpc.bestRound(),
    "SASEUL.Rpc.signedRequest": SASEUL.Rpc.signedRequest({ type: "GetBalance", address: "4c717ef70937f957bbec120e2750192b9faeb139a48b" }, SASEUL.Sign.privateKey()),
    "SASEUL.Rpc.simpleRequest": SASEUL.Rpc.simpleRequest({ type: "GetBalance", address: "4c717ef70937f957bbec120e2750192b9faeb139a48b" }),
    "SASEUL.Rpc.signedTransaction": SASEUL.Rpc.signedTransaction({ type: "Send", to: "4c717ef70937f957bbec120e2750192b9faeb139a48b", amount: "1" }, SASEUL.Sign.privateKey()),
    "SASEUL.Rpc.request": SASEUL.Rpc.request(SASEUL.Rpc.simpleRequest({ type: "GetBalance", address: "4c717ef70937f957bbec120e2750192b9faeb139a48b" })),
    "SASEUL.Rpc.raceRequest": SASEUL.Rpc.raceRequest(SASEUL.Rpc.simpleRequest({ type: "GetBalance", address: "4c717ef70937f957bbec120e2750192b9faeb139a48b" })),
    "SASEUL.Rpc.sendTransaction": SASEUL.Rpc.sendTransaction(SASEUL.Rpc.signedTransaction({ type: "Send", to: "4c717ef70937f957bbec120e2750192b9faeb139a48b", amount: "1" }, SASEUL.Sign.privateKey())),
    "SASEUL.Rpc.broadcastTransaction": SASEUL.Rpc.broadcastTransaction(SASEUL.Rpc.signedTransaction({ type: "Send", to: "4c717ef70937f957bbec120e2750192b9faeb139a48b", amount: "1" }, SASEUL.Sign.privateKey())),
    "SASEUL.Rpc.estimatedFee": SASEUL.Rpc.estimatedFee(SASEUL.Rpc.signedTransaction({ type: "Send", to: "4c717ef70937f957bbec120e2750192b9faeb139a48b", amount: "1" }, SASEUL.Sign.privateKey())),
};

function runTest() {
    for (let i in test) {
        if (isPromise(test[i])) {
            test[i].then(r => {
                console.dir(i);
                console.dir(r);
            }).catch(e => {
                console.dir(i);
                console.error(e);
            });
        } else {
            console.log(i);
            console.dir(test[i]);
        }
    }
}

function isPromise(target) {
    return target instanceof Promise || (target !== null && typeof target === 'object' && typeof target.then === 'function');
}

runTest();