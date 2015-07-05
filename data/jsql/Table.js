/**
 *
 */

const COMMANDS = require('./COMMANDS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const Field = require('./Field');

const Constraint = require('./Constraint');


var Table = function (props) {
    this.name = props.name;
    this.primaryKey = null;

    this.fields = {};
    this.addFields(props.fields);

    this.constraints = [];
    this.addTableConstraints(props.constraints);
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
        var def = this.getFieldsDefinition().concat(this.getTableConstraints());
        cmd.push('(' + def.join(', ') + ')');
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

    return definitions;
};

Table.prototype.getPrimaryKey = function () {
    if (this.primaryKey) {
        return this.primaryKey;
    }

    for (var field in this.fields) {
        if (this.fields.hasOwnProperty(field)) {
            if (this.fields[field].primaryKey) {
                this.primaryKey = field;
                return field;
            }
        }
    }
};

/**
 * Take Json in and create Field objects +
 * add them.
 */
Table.prototype.addTableConstraints = function (constraints) {
    for (var fieldName in constraints) {
        if (constraints.hasOwnProperty(fieldName)) {
            var consArray = constraints[fieldName];

            // If its not an array - wrap it
            if (Object.prototype.toString.call(consArray) !== '[object Array]') {
                consArray = [consArray];
            }

            for (var i = 0, len = consArray.length; i < len; i += 1) {
                consArray[i].fieldName = fieldName;

                // Create a new constraint
                var cons = new Constraint(consArray[i]);
                this.constraints.push(cons);
            }
        }
    }
};

/**
 * Get the constraints as an array
 */
Table.prototype.getTableConstraints = function () {
    var constraints = [];

    for (var i = 0, len = this.constraints.length; i < len; i += 1) {
        constraints.push(this.constraints[i].getDefinition());
    }

    return constraints;
};



module.exports = Table;

