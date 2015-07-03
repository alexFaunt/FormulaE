/****** Setup *******/

const mysql = require('mysql');

/****** Connect *******/

var COMMANDS = {
    USE: 'USE',
    CREATE: 'CREATE',
    DROP: 'DROP TABLE IF EXISTS'
};

var TYPES = {
    TABLE: 'TABLE'
};

var FIELD_TYPES = {
    INT: 'int',
    VARCHAR: function (chars) {
        return 'varchar(' + chars + ')';
    }
}

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
            argArr.push(prop + ' ' + this[type][name][prop]);
        }
    }

    cmd.push('(' + argArr.join(',') + ')');

    return cmd.join(' ');
};

Database.prototype.creatCommandOnAllOfType = function (command, type) {
    var commands = [];
    for (var name in this[type]) {
        commands.push(this.createCommand(command, type, name));
    }
    return commands;
};

// Do it to everything
Database.prototype.createCommandOnAll = function (command) {
    var commands = [];

    for (var type in TYPES) {
        commands = commands.concat(this.creatCommandOnAllOfType(command, type));
    }

    return commands;
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

/** Log or throw! **/
var onSqlResponse = function (msg, err) {
    if (err) {
        throw err;
    }

    console.log(msg);
};





/******* Define the database *********/


var database = new Database('formulae', 'localhost', 'root');

var TABLES = {
    SEASONS: 'seasons',
    DRIVERS: 'drivers'
};

database[TYPES.TABLE][TABLES.SEASONS] = {
    id: FIELD_TYPES.INT,
    year: FIELD_TYPES.INT
};

database[TYPES.TABLE][TABLES.DRIVERS] = {
    id: FIELD_TYPES.INT,
    first_name: FIELD_TYPES.VARCHAR(255),
    second_name: FIELD_TYPES.VARCHAR(255)
};



/******* List all the commands *********/

// Drop all types of table
var sqlCmds = database.creatCommandOnAllOfType(COMMANDS.DROP, TYPES.TABLE);

// Create everything.
sqlCmds = sqlCmds.concat(database.createCommandOnAll(COMMANDS.CREATE));


/* GO GO GO */
database.commitCommands(sqlCmds);



