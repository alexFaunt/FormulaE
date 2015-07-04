
var Field = function (props) {
    this.name = props.name;
    this.type = props.type;
    this.attrs = props.attrs || [];
};

Field.prototype.getDefinition = function () {
    var def = [this.name, this.type];

    for (var i = 0, len = this.attrs.length; i < len; i += 1) {
        def.push(this.attrs[i]);
    }

    return def.join(' ');
};

module.exports = Field;

