
module.exports = {
    INT: 'int',
    VARCHAR: function (chars) {
        return 'varchar(' + chars + ')';
    }
};