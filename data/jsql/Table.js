

const COMMANDS = require('./COMMANDS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const CONSTRAINTS = require('./CONSTRAINTS');

var Table = function (props) {
    this.name = props.name;
    this.fields = props.fields;
    this.constraints = props.constraints || {};
};

/**
 * Go through the fields and return a string of the fields
 * @return {}
 */
Table.prototype.getCommand = function (opts) {


    // The command to return
    const cmd = [];

    // CREATE/DROP
    cmd.push(opts.command);

    cmd.push(OBJECT_TYPES.TABLE);

    if (opts.condition) {
        cmd.push(opts.condition);
    }

    // The name of the thing we're affecting
    cmd.push(this.name);

    // If it's CREATE, we need all the arguments for the fields
    if (opts.command === COMMANDS.CREATE) {
        cmd.push('(' + this.getFieldsDefinition().join(', ') + ')');
    }

    return cmd.join(' ');
};

Table.prototype.getFieldsDefinition = function () {
    var definitions = [];

    for (var i = 0, len = this.fields.length; i < len; i += 1) {
        definitions.push(this.fields[i].getDefinition());
    }

    return definitions.concat(this.getConstraints());
};

Table.prototype.getConstraints = function () {
    var constraints = [];

    for (var field in this.constraints) {
        if (this.constraints.hasOwnProperty(field)) {
            constraints.push(this.constraints[field] + '(' + field + ')');
        }
    }

    return constraints;
};


module.exports = Table;

