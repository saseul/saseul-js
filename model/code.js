'use strict'

const Hasher = require("../util/hasher");

module.exports = class Code {

    type = 'code';
    name;
    version;
    writer;
    space;
    machine;
    parameters = {};
    executions = [];

    Cid()
    {
        return Hasher.SpaceId(this.Writer(), this.Space());
    }

    Compile()
    {
        return {
            type: this.type,
            name: this.name,
            version: this.version,
            nonce: this.space,
            writer: this.writer,
            parameters: this.parameters,
            conditions: this.executions,
        };
    }

    Name(name= null)
    {
        this.name = name ?? this.name;

        return this.name;
    }

    Version(version= null)
    {
        this.version = version ?? this.version;

        return this.version;
    }

    Space(space = null)
    {
        this.space = space ?? this.space;

        return this.space;
    }

    Writer(writer= null)
    {
        this.writer = writer ?? this.writer;

        return this.writer;
    }

    Type(type = null)
    {
        this.type = type ?? this.type;

        return this.type;
    }

    Machine(machine = null)
    {
        this.machine = machine ?? this.machine;

        return this.machine;
    }

    AddParameter(parameter) {
        if (parameter.ObjValidity() && !this.parameters[parameter.Name()]) {
            this.parameters[parameter.Name()] = parameter.Obj();
        }
    }

    Parameters(parameters = null) {
        this.parameters = parameters ?? this.parameters;

        return this.parameters;
    }

    AddExecution(execution) {
        this.executions.push(execution);
    }

    Executions(executions = null) {
        this.executions = executions ?? this.executions;

        return this.executions;
    }
}