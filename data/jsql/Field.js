
var Field = function (props) {
    this.type = props.type;
    this.attrs = props.attrs || [];
};

Field.prototype.getDefinition = function (name) {
    var def = [name, this.type];

    for (var i = 0, len = this.attrs.length; i < len; i += 1) {
        def.push(this.attrs[i]);
    }

    return def.join(' ');
};

module.exports = Field;

