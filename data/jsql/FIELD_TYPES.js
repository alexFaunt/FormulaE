
module.exports = {
    INT: 'INT',
    DATE: 'DATE',
    VARCHAR: function (chars) {
        return 'VARCHAR(' + chars + ')';
    }
};