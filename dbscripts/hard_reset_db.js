/****** Setup *******/

const mysql = require('mysql');

/****** Connect *******/

var DB_NAME = 'formulae';

var COMMANDS = {
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

// Declare that we have a db
var db = {};

// do a command
var createCommand = function (command, type, name) {

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

    for (var prop in db[type][name]) {
        if (db[type][name].hasOwnProperty(prop)){
            argArr.push(prop + ' ' + db[type][name][prop]);
        }
    }

    cmd.push('(' + argArr.join(',') + ')');

    return cmd.join(' ');
};

var creatCommandOnAllOfType = function (command, type) {
    var commands = [];
    for (var name in db[type]) {
        commands.push(createCommand(command, type, name));
    }
    return commands;
};

// Do it to everything
var createCommandOnAll = function (command) {
    var commands = [];

    for (var type in db) {
        commands = commands.concat(creatCommandOnAllOfType(command, type));
    }

    return commands;
}


/** Log or throw! **/
var responseHandler = function (msg, err) {
    if (err) {
        throw err;
    }

    console.log(msg);
};


// Okay do it all!
var commitCommands = function (commands) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root'
    });

    connection.connect();

    for (var i = 0, len = commands.length; i < len; i += 1) {
        console.log('attempt: ' + commands[i]);
        connection.query(commands[i], responseHandler.bind(this, commands[i]));
    }

    connection.end();
}



/******* Define the database *********/

var TABLES = {
    SEASONS: 'seasons',
    DRIVERS: 'drivers'
};

db[TYPES.TABLE] = {};

db[TYPES.TABLE][TABLES.SEASONS] = {
    id: FIELD_TYPES.INT,
    year: FIELD_TYPES.INT
};

db[TYPES.TABLE][TABLES.DRIVERS] = {
    id: FIELD_TYPES.INT,
    first_name: FIELD_TYPES.VARCHAR(255),
    second_name: FIELD_TYPES.VARCHAR(255)
}



/******* List all the commands *********/

var sqlCmds = ['USE ' + DB_NAME];

// Drop all types of table
sqlCmds = sqlCmds.concat(creatCommandOnAllOfType(COMMANDS.DROP, TYPES.TABLE));

// Create everything.
sqlCmds = sqlCmds.concat(createCommandOnAll(COMMANDS.CREATE));


/* GO GO GO */
commitCommands(sqlCmds);



