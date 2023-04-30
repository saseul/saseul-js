;(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = exports = factory(require("./core"));
    } else if (typeof define === "function" && define.amd) {
        define(["./core"], factory);
    } else {
        factory(root.SASEUL);
    }
}(this, function (SASEUL) {
    /* start source */
    (function () {
        var saseul = SASEUL, util = SASEUL.Util, enc = SASEUL.Enc, sign = SASEUL.Sign, rpc = SASEUL.Rpc,
            sc = saseul.SmartContract = {
            ZERO_ADDRESS: '00000000000000000000000000000000000000000000',

            Operator: {
                /* BasicOperator */
                legacy_condition: function (abi, err_msg ='Conditional error') { return [abi, err_msg]; },
                condition: function (abi, err_msg ='Conditional error') { return {"$condition": [abi, err_msg]}; },
                response: function (abi) { return {"$response": [abi]}; },
                weight: function () { return {"$weight": []}; },
                if: function (condition = false, ifTrue = null, ifFalse = null) { return {"$if": [condition, ifTrue, ifFalse]}; },
                and: function (vars = []) { return {"$and": vars}; },
                or: function (vars = []) { return {"$or": vars}; },
                get: function (obj = {}, key = '') { return {"$get": [obj, key]}; },

                /* ArithmeticOperator */
                add: function (vars = []) { return {"$add": vars}; },
                sub: function (vars = []) { return {"$sub": vars}; },
                mul: function (vars = []) { return {"$mul": vars}; },
                div: function (vars = []) { return {"$div": vars}; },
                precise_add: function (left = null, right = null, scale = 0) { return {"$precise_add": [left, right, scale]}; },
                precise_sub: function (left = null, right = null, scale = 0) { return {"$precise_sub": [left, right, scale]}; },
                precise_mul: function (left = null, right = null, scale = 0) { return {"$precise_mul": [left, right, scale]}; },
                precise_div: function (left = null, right = null, scale = 0) { return {"$precise_div": [left, right, scale]}; },
                scale: function (value = null) { return {"$scale": [value]}; },

                /* CastOperator */
                get_type: function (obj) { return {"$get_type": [obj]}; },
                is_numeric: function (vars = []) { return {"$is_numeric": vars}; },
                is_int: function (vars = []) { return {"$is_int": vars}; },
                is_string: function (vars = []) { return {"$is_string": vars}; },
                is_null: function (vars = []) { return {"$is_null": vars}; },
                is_bool: function (vars = []) { return {"$is_bool": vars}; },
                is_array: function (vars = []) { return {"$is_array": vars}; },
                is_double: function (vars = []) { return {"$is_double": vars}; },

                /* ComparisonOperator */
                eq: function (left = 0, right = 0) { return {"$eq": [left, right]}; },
                ne: function (left = 0, right = 0) { return {"$ne": [left, right]}; },
                gt: function (left = 0, right = 0) { return {"$gt": [left, right]}; },
                lt: function (left = 0, right = 0) { return {"$lt": [left, right]}; },
                gte: function (left = 0, right = 0) { return {"$gte": [left, right]}; },
                lte: function (left = 0, right = 0) { return {"$lte": [left, right]}; },
                in: function (target = null, cases = []) { return {"$in": [target, cases]}; },

                /* ReadWriteOperator */
                load_param: function (vars) { if (typeof vars === 'string') { return {"$load_param": [vars]}; } else { return {"$load_param": vars}; } },
                read_universal: function (attr = null, key = null, defaultValue = null) { return {"$read_universal": [attr, key, defaultValue]}; },
                read_local: function (attr = null, key = null, defaultValue = null) { return {"$read_local": [attr, key, defaultValue]}; },
                write_universal: function (attr = null, key = null, value = null) { return {"$write_universal": [attr, key, value]}; },
                write_local: function (attr = null, key = null, value = null) { return {"$write_local": [attr, key, value]}; },

                /* UtilOperator */
                concat: function (vars=[]) { return {"$concat": vars}; },
                strlen: function (value = '') { return {"$strlen": [value]}; },
                reg_match: function (reg = null, value = '') { return {"$reg_match": [reg, value]}; },
                encode_json: function (target = null) { return {"$encode_json": [target]}; },
                decode_json: function (target = '') { return {"$decode_json": [target]}; },
                hash: function (vars = []) { return {"$hash": [vars]}; },
                short_hash: function (vars = []) { return {"$short_hash": [vars]}; },
                id_hash: function (vars = []) { return {"$id_hash": [vars]}; },
                sign_verify: function (obj = null, public_key = '', signature = '') { return {"$sign_verify": [obj, public_key, signature]}; },

                /* ChainOperator */
                get_block: function (target, full) { return {"$get_block": [target, full]}; },
                get_resource_block: function (target, full) { return {"$get_resource_block": [target, full]}; },
                get_transaction: function (target) { return {"$get_transaction": [target]}; },
                list_universal: function (attr, page, count) { return {"$list_universal": [attr, page, count]}; },
            },

            Contract: function (writer, nonce) {
                this._methods = {};
                this._writer = writer;
                this._nonce = nonce;

                this.method = function (name) {
                    return this._methods[name];
                }

                this.writer = function (writer) {
                    if (typeof writer !== 'undefined') {
                        typeof writer === 'string' && (sign.addressValidity(writer) || writer === enc.ZERO_ADDRESS)
                            ? this._writer = writer : console.error('Invalid writer address. ');
                    }
                }

                this.nonce = function (nonce) {
                    if (typeof nonce !== 'undefined') {
                        typeof nonce === 'string' ? this._nonce = nonce
                            : console.error('The \'nonce\' parameter should be of string.');
                    }
                }

                this.methods = function (full = false) {
                    let methods = {};

                    if (full) {
                        for (let i in this._methods) {
                            methods[i] = this._methods[i].compile();
                        }
                    } else {
                        for (let i in this._methods) {
                            methods[i] = this._methods[i].type();
                        }
                    }

                    return methods;
                }

                this.addMethod = function (data) {
                    data.writer(this._writer);
                    data.nonce(this._nonce);
                    this._methods[data.name()] = data;
                }

                this.publish = function (private_key) {
                    this.register(private_key, 'Publish');
                }

                this.register = function (private_key, type = 'Register') {
                    let broadcast = function (method) {
                        let timestamp = util.utime() + 1000000;
                        let item = {"type": type, "code": method.compile(), "timestamp": timestamp};
                        let thash = enc.txHash(item);
                        let signed_tx = rpc.signedTransaction(item, private_key);

                        let check = function () {
                            console.log('Checking results... ' + thash);
                            rpc.round().then(function (rs) {
                                if (typeof rs.data !== 'undefined' && rs.data.main.block.s_timestamp > timestamp) {
                                    rpc.request(rpc.signedRequest({
                                        "type": "GetCode",
                                        "ctype": method.type(),
                                        "target": method.mid()
                                    }), sign.privateKey()).then(function (code) {
                                        for (let i in code.data) {
                                            if (code.data[i] === null) {
                                                console.log("Failed. Resending code... " + thash);
                                                broadcast(method);
                                            } else {
                                                console.log("Success! " + thash);
                                            }}
                                    })
                                } else {
                                    setTimeout(check, 2000);
                                }
                            });
                        }

                        rpc.broadcastTransaction(signed_tx).then(function (rs) {
                            if (rs.code === 200) {
                                console.log(rs.data);
                                setTimeout(check, 2000);
                            } else if (rs.code !== 999) {
                                console.log("Failed. Resending code... " + thash);
                                broadcast(method);
                            } else {
                                console.dir(rs);
                            }
                        }).catch(function (e) { console.dir(e); });
                    }

                    for (let i in this._methods) {
                        broadcast(this._methods[i]);
                    }
                }
            },

            Method: function (data) {
                this._type = 'request';
                this._machine = '0.2.0';
                this._name = '';
                this._version = '';
                this._space = '';
                this._writer = '';
                this._parameters = {};
                this._executions = [];

                if (typeof data === 'object') {
                    if (typeof data.type !== 'undefined') {
                        typeof data.type === 'string' && data.type === 'contract' ? this._type = 'contract'
                            : this._type = 'request';
                    }

                    if (typeof data.t !== 'undefined') {
                        typeof data.t === 'string' && data.t === 'contract' ? this._type = 'contract'
                            : this._type = 'request';
                    }

                    if (typeof data.machine !== 'undefined') {
                        typeof data.machine === 'string' ? this._machine = data.machine
                            : console.error('The \'machine\' parameter should be of string.');
                    }

                    if (typeof data.m !== 'undefined') {
                        typeof data.m === 'string' ? this._machine = data.m
                            : console.error('The \'machine\' parameter should be of string.');
                    }

                    if (typeof data.name !== 'undefined') {
                        typeof data.name === 'string' ? this._name = data.name
                            : console.error('The \'name\' parameter should be of string.');
                    }

                    if (typeof data.n !== 'undefined') {
                        typeof data.n === 'string' ? this._name = data.n
                            : console.error('The \'name\' parameter should be of string.');
                    }

                    if (typeof data.version !== 'undefined') {
                        typeof data.version === 'string' ? this._version = data.version
                            : console.error('The \'version\' parameter should be of string.');
                    }

                    if (typeof data.v !== 'undefined') {
                        typeof data.v === 'string' ? this._version = data.v
                            : console.error('The \'version\' parameter should be of string.');
                    }

                    if (typeof data.space !== 'undefined') {
                        typeof data.space === 'string' ? this._space = data.space
                            : console.error('The \'space\' parameter should be of string.');
                    }

                    if (typeof data.s !== 'undefined') {
                        typeof data.s === 'string' ? this._space = data.s
                            : console.error('The \'space\' parameter should be of string.');
                    }

                    if (typeof data.writer !== 'undefined') {
                        typeof data.writer === 'string' && (sign.addressValidity(data.writer) || data.writer === enc.ZERO_ADDRESS)
                            ? this._writer = data.writer : console.error('Invalid writer address. ');
                    }

                    if (typeof data.w !== 'undefined') {
                        typeof data.w === 'string' && (sign.addressValidity(data.w) || data.w === enc.ZERO_ADDRESS)
                            ? this._writer = data.w : console.error('Invalid writer address. ');
                    }

                    if (typeof data.parameters !== 'undefined') {
                        typeof data.parameters === 'object' && sc.parametersValidity(data.parameters)
                            ? this._parameters = data.parameters : console.error('Invalid parameters. ');
                    }

                    if (typeof data.p !== 'undefined') {
                        typeof data.p === 'object' && sc.parametersValidity(data.p)
                            ? this._parameters = data.p : console.error('Invalid parameters. ');
                    }

                    if (typeof data.executions !== 'undefined') {
                        typeof data.executions === 'object'
                            ? this._executions = data.executions : console.error('Invalid executions. ');
                    }

                    if (typeof data.e !== 'undefined') {
                        typeof data.e === 'object'
                            ? this._executions = data.e : console.error('Invalid executions. ');
                    }
                }

                this.cid = function () {
                    return enc.cid(this.writer(), this.space());
                }

                this.mid = function () {
                    return enc.hash([ this.writer(), this.space(), this.name() ]);
                }

                this.type = function (type) {
                    if (typeof type !== 'undefined') {
                        type === 'contract' ? this._type = 'contract'
                            : this._type = 'request';
                    }

                    return this._type;
                }

                this.machine = function (machine) {
                    if (typeof machine !== 'undefined') {
                        typeof machine === 'string' ? this._machine = machine
                            : console.error('The \'machine\' parameter should be of string.');
                    }

                    return this._machine;
                }

                this.name = function (name) {
                    if (typeof name !== 'undefined') {
                        typeof name === 'string' ? this._name = name
                            : console.error('The \'name\' parameter should be of string.');
                    }

                    return this._name;
                }

                this.version = function (version) {
                    if (typeof version !== 'undefined') {
                        typeof version === 'string' ? this._version = version
                            : console.error('The \'version\' parameter should be of string.');
                    }

                    return this._version;
                }

                this.nonce = function (nonce) {
                    if (typeof nonce !== 'undefined') {
                        typeof nonce === 'string' ? this._space = nonce
                            : console.error('The \'space\' parameter should be of string.');
                    }

                    return this._space;
                }

                this.space = function (nonce) {
                    return this.nonce(nonce);
                }

                this.writer = function (writer) {
                    if (typeof writer !== 'undefined') {
                        (sign.addressValidity(writer) || writer === enc.ZERO_ADDRESS) ? this._writer = writer
                            : console.error('Invalid writer address. ');
                    }

                    return this._writer;
                }

                this.parameters = function (parameters) {
                    if (typeof parameters !== 'undefined') {
                        typeof parameters === 'object' && sc.parametersValidity(parameters)
                            ? this._parameters = parameters : console.error('Invalid parameters. ');
                    }

                    return this._parameters;
                }

                this.executions = function (executions) {
                    if (typeof executions === 'object') {
                        this._executions = executions;
                    }

                    return this._executions;
                }

                this.addParameter = function (data) {
                    typeof data.default === 'undefined' ? data.default = null : false;
                    typeof data.cases === 'undefined' ? data.cases = null : false;
                    typeof data === 'object' && sc.parameterValidity(data)
                        ? this._parameters[data.name] = data : console.error('Invalid parameter. ');
                }

                this.addExecution = function (data) {
                    this._executions.push(data);
                }

                this.compile = function () {
                    let json;

                    if (Object.keys(this._parameters).length === 0) {
                        this._parameters = [];
                    }

                    json = JSON.stringify({
                        "t": this._type,
                        "m": this._machine,
                        "n": this._name,
                        "v": this._version,
                        "s": this._space,
                        "w": this._writer,
                        "p": this._parameters,
                        "e": this._executions,
                    });

                    return json.replaceAll('/', '\\/');
                }
            },

            LegacyMethod: function (data) {
                this._type = 'request';
                this._name = '';
                this._version = '';
                this._space = '';
                this._writer = '';
                this._parameters = {};
                this._conditions = [];
                this._updates = [];
                this._response = [];

                if (typeof data === 'object') {
                    if (typeof data.type !== 'undefined') {
                        typeof data.type === 'string' && data.type === 'contract' ? this._type = 'contract'
                            : this._type = 'request';
                    }

                    if (typeof data.name !== 'undefined') {
                        typeof data.name === 'string' ? this._name = data.name
                            : console.error('The \'name\' parameter should be of string.');
                    }

                    if (typeof data.version !== 'undefined') {
                        typeof data.version === 'string' ? this._version = data.version
                            : console.error('The \'version\' parameter should be of string.');
                    }

                    if (typeof data.nonce !== 'undefined') {
                        typeof data.nonce === 'string' ? this._space = data.nonce
                            : console.error('The \'space\' parameter should be of string.');
                    }

                    if (typeof data.space !== 'undefined') {
                        typeof data.space === 'string' ? this._space = data.space
                            : console.error('The \'space\' parameter should be of string.');
                    }

                    if (typeof data.writer !== 'undefined') {
                        typeof data.writer === 'string' && (sign.addressValidity(data.writer) || data.writer === enc.ZERO_ADDRESS)
                            ? this._writer = data.writer : console.error('Invalid writer address. ');
                    }

                    if (typeof data.parameters !== 'undefined') {
                        typeof data.parameters === 'object' && sc.parametersValidity(data.parameters)
                            ? this._parameters = data.parameters : console.error('Invalid parameters. ');
                    }

                    if (typeof data.conditions !== 'undefined') {
                        typeof data.conditions === 'object'
                            ? this._conditions = data.conditions : console.error('Invalid conditions. ');
                    }

                    if (typeof data.updates !== 'undefined') {
                        typeof data.updates === 'object'
                            ? this._updates = data.updates : console.error('Invalid updates. ');
                    }

                    if (typeof data.response !== 'undefined') {
                        this._response = data.response;
                    }
                }

                this.cid = function () {
                    return enc.cid(this.writer(), this.space());
                }

                this.mid = function () {
                    return enc.idHash([ this.name(), this.space() ]) + "00000000000000000000";
                }

                this.type = function (type) {
                    if (typeof type !== 'undefined') {
                        type === 'contract' ? this._type = 'contract'
                            : this._type = 'request';
                    }

                    return this._type;
                }

                this.name = function (name) {
                    if (typeof name !== 'undefined') {
                        typeof name === 'string' ? this._name = name
                            : console.error('The \'name\' parameter should be of string.');
                    }

                    return this._name;
                }

                this.version = function (version) {
                    if (typeof version !== 'undefined') {
                        typeof version === 'string' ? this._version = version
                            : console.error('The \'version\' parameter should be of string.');
                    }

                    return this._version;
                }

                this.nonce = function (nonce) {
                    if (typeof nonce !== 'undefined') {
                        typeof nonce === 'string' ? this._space = nonce
                            : console.error('The \'nonce\' parameter should be of string.');
                    }

                    return this._space;
                }

                this.space = function (nonce) {
                    return this.nonce(nonce);
                }

                this.writer = function (writer) {
                    if (typeof writer !== 'undefined') {
                        (sign.addressValidity(writer) || writer === enc.ZERO_ADDRESS) ? this._writer = writer
                            : console.error('Invalid writer address. ');
                    }

                    return this._writer;
                }

                this.parameters = function (parameters) {
                    if (typeof parameters !== 'undefined') {
                        typeof parameters === 'object' && sc.parametersValidity(parameters)
                            ? this._parameters = parameters : console.error('Invalid parameters. ');
                    }

                    return this._parameters;
                }

                this.conditions = function (conditions) {
                    if (typeof conditions === 'object') {
                        this._conditions = conditions;
                    }

                    return this._conditions;
                }

                this.updates = function (updates) {
                    if (typeof updates === 'object') {
                        this._updates = updates;
                    }

                    return this._updates;
                }

                this.response = function (response) {
                    if (typeof response !== 'undefined') {
                        this._response = response;
                    }

                    return this._response;
                }

                this.addParameter = function (data) {
                    typeof data.default === 'undefined' ? data.default = null : false;
                    typeof data.cases === 'undefined' ? data.cases = null : false;
                    typeof data === 'object' && sc.parameterValidity(data)
                        ? this._parameters[data.name] = data : console.error('Invalid parameter. ');
                }

                this.addCondition = function (data) {
                    this._conditions.push(data);
                }

                this.addUpdate = function (data) {
                    this._updates.push(data);
                }

                this.compile = function () {
                    let json;

                    if (Object.keys(this._parameters).length === 0) {
                        this._parameters = [];
                    }

                    if (this._type === 'contract') {
                        json = JSON.stringify({
                            "type": this._type,
                            "name": this._name,
                            "version": this._version,
                            "nonce": this._space,
                            "writer": this._writer,
                            "parameters": this._parameters,
                            "conditions": this._conditions,
                            "updates": this._updates,
                        });
                    } else {
                        json = JSON.stringify({
                            "type": this._type,
                            "name": this._name,
                            "version": this._version,
                            "nonce": this._space,
                            "writer": this._writer,
                            "parameters": this._parameters,
                            "conditions": this._conditions,
                            "response": this._response,
                        });
                    }

                    return json.replaceAll('/', '\\/');
                }
            },

            parametersValidity(object) {
                for (let i in object) {
                    if (this.parameterValidity(object[i]) === false) {
                        return false;
                    }
                }

                return true;
            },

            parameterValidity(data) {
                let _name = false,
                    _type = false,
                    _maxlength = false,
                    _requirements = false,
                    _cases = false;

                typeof data.name === 'string' ? _name = true : _name = false;
                typeof data.type === 'string' && sc.typeValidity(data.type) ? _type = true : _type = false;
                typeof data.maxlength === 'number' ? _maxlength = true : _maxlength = false;
                typeof data.requirements === 'boolean' ? _requirements = true : _requirements = false;
                typeof data.cases === 'undefined' || typeof data.cases === 'object' || data.cases === null ? _cases = true : _cases = false;

                return _name && _type && _maxlength && _requirements && _cases;
            },

            typeValidity(type) {
                return type === 'string' || type === 'int' || type === 'array' || type === 'bool' || type === 'double' || type === 'any';
            },
        };
    })();
    /* end source */

    return SASEUL.SmartContract;
}));