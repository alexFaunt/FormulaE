
const CONSTRAINTS = require('./CONSTRAINTS');

const Constraint = require('./Constraint');

var Field = function (props) {
    this.name = props.name;
    this.type = props.type;

    this.constraints = [];
    this.addFieldConstraints(props.constraints || []);

};

/**
 * Take Json in and create Field objects +
 * add them.
 */
Field.prototype.addFieldConstraints = function (constraints) {

    for (var i = 0, len = constraints.length; i < len; i += 1) {

        var cons = new Constraint({
            type: constraints[i]
        });

        // Create a new constraint
        this.constraints.push(cons);

        // If it was primary key - save it
        if (cons.type === CONSTRAINTS.PRIMARY_KEY) {
            this.primaryKey = true;
        }
    }
};

Field.prototype.getDefinition = function () {
    var def = [this.name, this.type];

    for (var i = 0, len = this.constraints.length; i < len; i += 1) {
        def.push(this.constraints[i].getDefinition());
    }

    return def.join(' ');
};

module.exports = Field;

