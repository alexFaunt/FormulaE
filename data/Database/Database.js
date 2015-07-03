
const mysql = require('mysql');

var TYPES = {
    TABLE: 'TABLE'
};

var COMMANDS = {
    USE: 'USE',
    CREATE: 'CREATE',
    DROP: 'DROP TABLE IF EXISTS'
};

var FIELD_TYPES = {
    INT: 'int',
    VARCHAR: function (chars) {
        return 'varchar(' + chars + ')';
    }
};

var ATTRS = {
    NOT_NULL: 'NOT NULL',
    PRIMARY_KEY: 'PRIMARY KEY'
};

var Database = function (name, server, user) {
    this.name = name;
    this.server = server;
    this.user = user;
    this[TYPES.TABLE] = {};
};

// do a command
Database.prototype.createCommand = function (command, type, name) {

    const cmd = [];

    cmd.push(command);

    // If it's not drop add the type
    if (command !== COMMANDS.DROP) {
        cmd.push(type);
    }

    cmd.push(name);

    // If it's drop, we just need the name
    if (command === COMMANDS.DROP) {
        return cmd.join(' ');
    }

    const argArr = [];

    for (var prop in this[type][name]) {
        if (this[type][name].hasOwnProperty(prop)){

            var def = prop + ' ';

            // If its a simple type - we just need the string
            if (typeof this[type][name][prop] === 'string') {
                argArr.push(def + this[type][name][prop]);
                continue;
            }

            // More complicated version
            // Property name + the type
            // e.g. id int
            def += this[type][name][prop].type;

            // if theres attrs
            // e.g. id in NOT NULL FOREIGN KEY
            if (this[type][name][prop].attrs) {
                def += ' ' + this[type][name][prop].attrs.join(' ');
            }

            argArr.push(def);
        }
    }

    cmd.push('(' + argArr.join(',') + ')');

    return cmd.join(' ');
};

Database.prototype.createCommandOnAllOfType = function (command, type) {
    var commands = [];
    for (var name in this[type]) {
        if (this[type].hasOwnProperty(name)){
            commands.push(this.createCommand(command, type, name));
        }
    }
    return commands;
};

Database.prototype.executeOnAllOfType = function (command, type) {
    this.commitCommands(this.createCommandOnAllOfType(command, type));
};

// Do it to everything
Database.prototype.createCommandOnAll = function (command) {
    var commands = [];

    for (var type in TYPES) {
        if (TYPES.hasOwnProperty(type)){
            commands = commands.concat(this.createCommandOnAllOfType(command, type));
        }
    }

    return commands;
};

Database.prototype.executeOnAll = function (command) {
    this.commitCommands(this.createCommandOnAll(command));
};

// Okay do it all!
Database.prototype.commitCommands = function (commands) {
    const connection = mysql.createConnection({
        host: this.server,
        user: this.user
    });

    connection.connect();

    // use this db!
    commands.unshift(COMMANDS.USE + ' ' + this.name);

    for (var i = 0, len = commands.length; i < len; i += 1) {
        console.log('attempt: ' + commands[i]);
        connection.query(commands[i], onSqlResponse.bind(this, commands[i]));
    }

    connection.end();
};

Database.prototype.addTable = function (name, table) {
    this[TYPES.TABLE][name] = table;
};

/** Log or throw! **/
var onSqlResponse = function (msg, err) {
    if (err) {
        console.error('error in ' + msg);
        throw err;
    }

    console.log(msg);
};

Database.COMMANDS = COMMANDS;

Database.TYPES = TYPES;

Database.FIELD_TYPES = FIELD_TYPES;

Database.ATTRS = ATTRS;

module.exports = Database;

