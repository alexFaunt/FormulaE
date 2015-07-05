/**
 *
 */

const COMMANDS = require('./COMMANDS');

const CONSTRAINTS = require('./CONSTRAINTS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const Field = require('./Field');

const Constraint = require('./Constraint');

var Table = function (props) {
    this.name = props.name;
    this.primaryKey = null;

    this.fields = {};
    this.addFields(props.fields);

    this.constraints = {};
    this.addConstraints(props.constraints);
};

/**
 * Take Json in and create Field objects +
 * add them.
 */
Table.prototype.addFields = function (fields) {
    for (var fieldName in fields) {
        if (fields.hasOwnProperty(fieldName)) {
            fields[fieldName].name = fieldName;
            this.fields[fieldName] = new Field(fields[fieldName]);
        }
    }
};

/**
 * Take Json in and create Field objects +
 * add them.
 */
Table.prototype.addConstraints = function (constraints) {
    for (var name in constraints) {
        if (constraints.hasOwnProperty(name)) {
            constraints[name].name = name;

            // Create a new constraint
            this.constraints[name] = new Constraint(constraints[name]);

            // If it was primary key - save it
            if (this.constraints[name].type === CONSTRAINTS.PRIMARY_KEY) {
                this.primaryKey = name;
            }
        }
    }
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

/**
 * Get the definitions of the fields as an array
 */
Table.prototype.getFieldsDefinition = function () {
    var definitions = [];

    for (var fieldName in this.fields) {
        if (this.fields.hasOwnProperty(fieldName)) {
            definitions.push(this.fields[fieldName].getDefinition());
        }
    }

    return definitions.concat(this.getConstraints());
};

/**
 * Get the constraints as an array
 */
Table.prototype.getConstraints = function () {
    var constraints = [];

    for (var field in this.constraints) {
        if (this.constraints.hasOwnProperty(field)) {
            constraints.push(this.constraints[field].getDefinition());
        }
    }

    return constraints;
};


module.exports = Table;

