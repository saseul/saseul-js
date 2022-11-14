const annotation = `/*
SASEUL JS
https://github.com/saseul/saseul-js
(c) 2016-2022 by ArtiFriends Inc. All rights reserved.
https://github.com/saseul/saseul-js/blob/master/LICENSE.md
*/
`;

const fs = require('fs');
const terser = require('terser');

(async function () {
    let core = __dirname + "/saseul/core.js";
    let enc = __dirname + "/saseul/enc.js";
    let sign = __dirname + "/saseul/sign.js";
    let rpc = __dirname + "/saseul/rpc.js";

    let cryptojs = __dirname + "/crypto.pack.min.js";
    let nacl = __dirname + "/nacl.min.js";

    let pack = __dirname + "/saseul.pack.min.js";
    let min = __dirname + "/saseul.min.js";

    let output = '';

    let _concat = async function (path) {
        let tmp = await fs.promises.readFile(path, { encoding: "utf-8" });
        tmp = await terser.minify(tmp);
        output+= tmp.code;
    }

    await _concat(core);
    await _concat(enc);
    await _concat(sign);
    await _concat(rpc);

    await fs.promises.writeFile(pack, annotation + output);

    await _concat(cryptojs);
    await _concat(nacl);

    await fs.promises.writeFile(min, annotation + output);
})();