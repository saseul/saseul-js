# SaseulJS - SASEUL Javascript API Library

[![NPM Version][npm-version-image]][npm-url]

[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

[![NPM Downloads][npm-downloads-image]][npm-downloads-url]


# Release Note

- `2.7.0 ~` Compatible with SASEUL(`2.1.6 ~`)
- `< 2.6.10` Compatible with SASEUL(`< 2.1.5`)


# Getting Started

SaseulJS is a collection of libraries that allow developers to interact with a local or remote SASEUL node using HTTP.

## Installing SaseulJS

You need to get SaseulJS into your project before using. This can be done by following methods:

- npm: `npm install saseul`

After installing SaseulJS, you need to create a Saseul instance. You can set `Saseul.CONFIG.NETWORK` property while creating the Saseul instance.

```javascript
// Node.js: const SaseulJS = require('saseul');

const Saseul = new SaseulJS('SASEUL PUBLIC NETWORK');
```



# License

[GPL-3.0](LICENSE.md)





[npm-downloads-image]: https://badgen.net/npm/dm/saseul
[npm-downloads-url]: https://npmcharts.com/compare/saseul?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/saseul
[npm-install-size-url]: https://packagephobia.com/result?p=saseul
[npm-url]: https://npmjs.org/package/saseul
[npm-version-image]: https://badgen.net/npm/v/saseul