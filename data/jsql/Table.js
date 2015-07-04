/**
 * ------- TODO -------
 *
 *  Need to generate Fields + Constraints As the table gets created, because otherwise
 *  primaryKey is not set which gets set on Table Creation
 *  See this currently runs, but the REFERENCES Table(undefinted) <<< that is the problem
 *  Plus it means DB constructor is just JSON
 *
 */

const COMMANDS = require('./COMMANDS');

const CONSTRAINTS = require('./CONSTRAINTS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

var Table = function (props) {
    this.name = props.name;
    this.fields = props.fields;
    this.constraints = props.constraints || {};
    this.primaryKey = null;
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

    for (var fieldName in this.fields) {
        if (this.fields.hasOwnProperty(fieldName)) {
            definitions.push(this.fields[fieldName].getDefinition(fieldName));
        }
    }

    return definitions.concat(this.getConstraints());
};

Table.prototype.getConstraints = function () {
    var constraints = [];

    for (var field in this.constraints) {
        if (this.constraints.hasOwnProperty(field)) {

            constraints.push(this.constraints[field].getDefinition(field));

            if (this.constraints[field].type === CONSTRAINTS.PRIMARY_KEY){
                this.primaryKey = field;
            }
        }
    }

    return constraints;
};


module.exports = Table;

