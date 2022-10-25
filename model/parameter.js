'use strict'

const Type = require('../type');
const PHP = require('../php/php');

module.exports = class Parameter {

    name;
    type;
    maxlength;
    requirements;
    default;

    constructor(initialInfo = {}) {
        this.name = initialInfo.name ?? null;
        this.type = initialInfo.type ?? Type.ANY;
        this.maxlength = initialInfo.maxlength ?? 0;
        this.requirements = initialInfo.requirements ?? true;
        this.default = initialInfo.default ?? null;
        this.cases = initialInfo.cases ?? null;
    }

    Name(name = null) {
        try {
            if(name !== null && typeof name !== 'string') throw 'name must be a string. ';
            this.name = name ?? this.name;

            return this.name;
        } catch (e) {
            throw e;
        }
    }

    Type(type = null) {
        try {
            if(type !== null && typeof type !== 'string') throw 'type must be a string. ';
            this.type = type ?? this.type;

            return this.type;
        } catch (e) {
            throw e;
        }
    }

    MaxLength(maxlength = null) {
        try {
            if(maxlength !== null && !Number.isInteger(maxlength)) throw 'maxlength must be an integer. ';
            this.maxlength = maxlength ?? this.maxlength;

            return this.name;
        } catch (e) {
            throw e;
        }
    }

    Requirements(requirements = null) {
        try {
            if(requirements !== null && typeof requirements !== 'boolean') throw 'requirements must be a boolean. ';
            this.requirements = requirements ?? this.requirements;

            return this.name;
        } catch (e) {
            throw e;
        }
    }

    Default(defaultValue = null) {
        try {
            this.default = defaultValue ?? this.default;

            return this.default;
        } catch (e) {
            throw e;
        }
    }

    Cases(cases = null) {
        try {
            if(!Array.isArray(cases)) throw 'cases must be an array. ';
            this.cases = cases ?? this.cases;

            return this.cases;
        } catch (e) {
            throw e;
        }
    }

    ObjValidity() {
        return (typeof this.name === 'string') &&
            (typeof this.type === 'string') &&
            (Number.isInteger(this.maxlength)) &&
            (typeof this.requirements === 'boolean') &&
            (this.cases === null || Array.isArray(this.cases));
    }

    StructureValidity(value) {
        try {
            if(this.requirements === true && value === null) {
                throw `${this.name} must be given. `;
            }

            if(value === null) {
                value = this.default;
            }

            if(this.cases !== null && !this.cases.includes(value)) {
                let cases = this.cases.join(', ');
                throw `${this.name} must be one of the following: ${cases}`;
            }

            if(String(value).length > this.maxlength) {
                throw `${this.name} must be shorter than ${this.maxlength}`;
            }

            return true;

        } catch (e) {
            return false;
        }
    }

    TypeValidity(value) {
        try {
            if(this.requirements === false) {
                return true;
            }

            switch (this.type) {
                case Type.INT:
                    if(!PHP.is_int(value)) throw `Parameter ${this.name} must be of integer type. `;
                    break;
                case Type.ARRAY:
                    if(!PHP.is_array(value)) throw `Parameter ${this.name} must be of array type. `;
                    break;
                case Type.STRING:
                    if(typeof value !== 'string') throw `Parameter ${this.name} must be of string type. `;
                    break;
                case Type.BOOLEAN:
                    if(typeof value !== 'boolean') throw `Parameter ${this.name} must be of boolean type. `;
                    break;
                case Type.DOUBLE:
                    if(!PHP.is_double(value)) throw `Parameter ${this.name} must be of double type. `;
                    break;
                default: break;
            }

            return true;

        } catch (e) {
            return false;
        }
    }

    Obj() {
        return {
            name: this.name,
            type: this.type,
            maxlength: this.maxlength,
            requirements: this.requirements,
            default: this.default,
            cases: this.cases
        };
    }

}