
const CONSTRAINTS = require('./CONSTRAINTS');

var Constraint = function (props) {
    this.name = props.name;
    this.type = props.type;
    this.reference = props.reference;
};

Constraint.prototype.getDefinition = function () {
    var def = [this.type];

    def.push('(' + this.name + ')');

    if (typeof(this.reference) === 'object') {
        def.push(CONSTRAINTS.REFERENCES);
        def.push(this.reference.name + '(' + this.reference.primaryKey + ')');
    }

    return def.join(' ');
};

module.exports = Constraint;

