'use strict'
const CONFIG = require('./config');
const TYPE = require('./type');
const CODE = require('./code');

const ABI = require('./core/abi');
const Code = require('./model/code');
const Method = require("./model/method");
const Contract = require('./model/contract');
const Request = require('./model/request');
const Parameter = require('./model/parameter');
const SignedTransaction = require('./model/signedTransaction');
const SignedRequest = require('./model/signedRequest');
const SignedData = require('./model/signedData');

const ArithmeticOperator = require('./smartMethod/arithmeticOperator');
const BasicOperator = require('./smartMethod/basicOperator');
const CastOperator = require('./smartMethod/castOperator');
const ChainOperator = require('./smartMethod/chainOperator');
const ComparisonOperator = require('./smartMethod/comparisonOperator');
const ReadOperator = require('./smartMethod/readOperator');
const UtilOperator = require('./smartMethod/utilOperator');
const WriteOperator = require('./smartMethod/writeOperator');
const EthereumOperator = require('./smartMethod/ethereumOperator');

const Factory = require('./rpc/factory');
const Sender = require('./rpc/sender');
const Node = require('./rpc/node');

const Enc = require('./util/enc');
const Clock = require('./util/clock');
const Hasher = require('./util/hasher');
const Signer = require('./util/signer');
const Account = require('./util/account');
const Math = require('./util/math');
const Etc = require('./util/etc');
const Common = require("./core/common");
const {network} = require("locutus/php");

module.exports = class Saseul {

    /**
     * Initiate Saseul instance
     * @param option: {
     *     network_name: [String] SASEUL NETWORK (optional)
     *     system_nonce: [String] (optional)
     *     default_peers: [Array] (optional)
     *     genesis_address: [String] (optional)
     *     manager_addresses: [Array] (optional)
     *     abi: [Object] (optional)
     * }
     */
    constructor(option = {
        network_name: null,
        system_nonce: null,
        default_peers: [],
        genesis_address: null,
        manager_addresses: [],
        abi: null
    }) {
        try {
            if(!!option.abi && typeof option.abi !== 'object') throw 'abi must be an object.';
            if(!!option.default_peers && !Array.isArray(option.default_peers)) throw 'default_peers must be an array.';
            if(!!option.abi) this.Core.ABI = new ABI(option.abi);
            if(!!option.network_name) this.CONFIG.NETWORK = option.network_name;
            if(!!option.system_nonce) this.CONFIG._system_nonce = option.system_nonce;
            if(!!option.genesis_address) this.CONFIG._genesis_address = option.genesis_address;
            if(option.default_peers && option.default_peers?.length > 0) this.Rpc.Node = new Node(option.default_peers);
            if(option.manager_addresses && option.manager_addresses?.length > 0) this.CONFIG._manager_addresses = option.manager_addresses;
        } catch (e) {
            throw e;
        }
    }

    CONFIG = CONFIG;
    TYPE = TYPE;
    CODE = CODE;

    Core = {
        ABI: new ABI(),
        Common: Common
    }
    Model = {
        Code: Code,
        Method: Method,
        Contract: Contract,
        Request: Request,
        Parameter: Parameter,
        SignedData: SignedData,
        SignedRequest: SignedRequest,
        SignedTransaction: SignedTransaction,
    }
    SmartMethod = {
        ArithmeticOperator: ArithmeticOperator,
        BasicOperator: BasicOperator,
        CastOperator: CastOperator,
        ChainOperator: ChainOperator,
        ComparisonOperator: ComparisonOperator,
        ReadOperator: ReadOperator,
        UtilOperator: UtilOperator,
        WriteOperator: WriteOperator,
        EthereumOperator: EthereumOperator,
    }
    Rpc = {
        Factory: Factory,
        Sender: Sender,
        Node: Node,
        Code: Code,
    }
    Util = {
        Enc: Enc,
        Clock: Clock,
        Hasher: Hasher,
        Signer: Signer,
        Account: Account,
        Math: Math,
        Etc: Etc,
    }
}