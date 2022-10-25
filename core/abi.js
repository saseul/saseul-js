'use strict'

const ArithmeticOperator = require('../smartMethod/arithmeticOperator');
const BasicOperator = require('../smartMethod/basicOperator');
const CastOperator = require('../smartMethod/castOperator');
const ChainOperator = require('../smartMethod/chainOperator');
const ComparisonOperator = require('../smartMethod/comparisonOperator');
const ReadOperator = require('../smartMethod/readOperator');
const UtilOperator = require('../smartMethod/utilOperator');
const WriteOperator = require('../smartMethod/writeOperator');
const EthereumOperator = require('../smartMethod/ethereumOperator');

module.exports = class ABI {

    constructor(option = { ethereum: false }) {
        try {
            if(typeof option !== 'object') throw 'Invalid option format. ';
            if(option.ethereum === true) {
                this.Ethereum = {
                    EthSignVerify: EthereumOperator.eth_sign_verify,
                    EthPublicKey: EthereumOperator.eth_public_key,
                    EthAddress: EthereumOperator.eth_address,
                    Sha3: EthereumOperator.sha3,
                }
            }
        } catch(e) {
            throw e;
        }
    }

    // Basic operators
    If = BasicOperator.if;
    And = BasicOperator.and;
    Or = BasicOperator.or;
    Get = BasicOperator.get;
    LegacyCondition = BasicOperator.legacy_condition;
    Condition = BasicOperator.condition;
    Response = BasicOperator.response;
    Weight = BasicOperator.weight;

    // Contract operators
    Contract = {
        Param: (vars) => {
            if (typeof vars === 'string') {
                return {"$load_param": [ vars ] };
            } else if (Array.isArray(vars)) {
                return {"$load_param": vars };
            } else {
                return vars;
            }
        },
        Condition: this.LegacyCondition,
    }

    // Arithmetic Operator: Math
    Math = {
        Add: ArithmeticOperator.add,
        Sub: ArithmeticOperator.sub,
        Mul: ArithmeticOperator.mul,
        Div: ArithmeticOperator.div,
        PreciseAdd: ArithmeticOperator.precise_add,
        PreciseSub: ArithmeticOperator.precise_sub,
        PreciseMul: ArithmeticOperator.precise_mul,
        PreciseDiv: ArithmeticOperator.precise_div,
        Scale: ArithmeticOperator.scale,
    }

    // Cast operators: Type
    Type = {
        GetType: CastOperator.get_type,
        IsNumeric: CastOperator.is_numeric,
        IsInt: CastOperator.is_int,
        IsString: CastOperator.is_string,
        IsNull: CastOperator.is_null,
        IsBool: CastOperator.is_bool,
        IsArray: CastOperator.is_array,
        IsDouble: CastOperator.is_double,
    }

    // Chain operators: Chain
    Chain = {
        GetBlock: ChainOperator.get_block,
        ListBlock: ChainOperator.list_block,
        BlockCount: ChainOperator.block_count,
        GetTransaction: ChainOperator.get_transaction,
        ListTransaction: ChainOperator.list_transaction,
        TransactionCount: ChainOperator.transaction_count,
        GetCode: ChainOperator.get_code,
        ListCode: ChainOperator.list_code,
        CodeCount: ChainOperator.code_count,
        BlockExists: ChainOperator.block_exists,
        IsValidator: ChainOperator.is_validator,
        ListUniversal: ChainOperator.list_universal,
        CountUniversal: ChainOperator.count_universal,
        GetResourceBlock: ChainOperator.get_resource_block,
        ListResourceBlock: ChainOperator.list_resource_block,
        ResourceBlockCount: ChainOperator.resource_block_count,
        GetBlocks: ChainOperator.get_blocks,
        GetResourceBlocks: ChainOperator.get_resource_blocks,
    }

    // Comparison operators: Compare
    Compare = {
        Eq: ComparisonOperator.eq,
        Ne: ComparisonOperator.ne,
        Gt: ComparisonOperator.gt,
        Lt: ComparisonOperator.lt,
        Gte: ComparisonOperator.gte,
        Lte: ComparisonOperator.lte,
        In: ComparisonOperator.in,
    }

    // Read operators: Read
    Read = {
        LoadParam: ReadOperator.load_param,
        ReadUniversal: ReadOperator.read_universal,
        ReadLocal: ReadOperator.read_local,
        Param: (vars) => {
            if (typeof vars === 'string') {
                return {"$load_param": [ vars ] };
            } else if (Array.isArray(vars)) {
                return {"$load_param": vars };
            } else {
                return vars;
            }
        }
    }

    // Write operators: Write
    Write = {
        WriteUniversal: WriteOperator.write_universal,
        WriteLocal: WriteOperator.write_local,
    }

    // Util operators: Util
    Util = {
        Concat: UtilOperator.concat,
        Strlen: UtilOperator.strlen,
        RegMatch: UtilOperator.reg_match,
        EncodeJson: UtilOperator.encode_json,
        DecodeJson: UtilOperator.decode_json,
        Hash: UtilOperator.hash,
        ShortHash: UtilOperator.short_hash,
        IdHash: UtilOperator.id_hash,
        SignVerify: UtilOperator.sign_verify,
    }
}