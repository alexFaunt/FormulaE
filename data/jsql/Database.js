
const mysql = require('mysql');

const COMMANDS = require('./COMMANDS');

const CONSTRAINTS = require('./CONSTRAINTS');

const CONDITIONS = require('./CONDITIONS');

var Database = function (name, server, user) {
    this.name = name;
    this.server = server;
    this.user = user;
    this.tables = {};
};


/**
 * Send commands to the sql instance
 * @param  {String[]} Either a string or array of strings
 */
Database.prototype.execute = function (commands) {
    if (typeof(commands) === 'string') {
        commands = [commands];
    }

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

// TODO - return promise.all

    connection.end();
};

// Create the table
Database.prototype.createTable = function (table) {
    this.tables[table.name] = table;

    // Drop it if it exists
    this.execute(table.getCommand({
        command: COMMANDS.DROP,
        condition: CONDITIONS.IF_EXISTS
    }));

    // Create it
    this.execute(table.getCommand({
        command: COMMANDS.CREATE
    }));
};


/** Log or throw! **/
var onSqlResponse = function (msg, err) {
    if (err) {
        console.error('error in ' + msg);
        throw err;
    }

    console.log(msg);
};

module.exports = Database;

