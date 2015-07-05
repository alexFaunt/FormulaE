
const mysql = require('mysql');

const COMMANDS = require('./COMMANDS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const CONDITIONS = require('./CONDITIONS');

const Table = require('./Table');

var Database = function (props) {
    this.name = props.name;
    this.server = props.server;
    this.user = props.user;

    this.tables = {};
    this.addTables(props.tables);

    this.connection = mysql.createConnection({
        host: this.server,
        user: this.user
    });
};

/**
 * Burn everything and reset it from what we know about the db
 * @return {}
 */
Database.prototype.create = function () {
    // Prep for db creation
    var commands = [
        [COMMANDS.DROP, OBJECT_TYPES.DATABASE, CONDITIONS.IF_EXISTS, this.name].join(' '),
        [COMMANDS.CREATE, OBJECT_TYPES.DATABASE, this.name].join(' '),
        [COMMANDS.USE, this.name].join(' ')
    ];

    // Create all the tables
    for (var table in this.tables) {
        if (this.tables.hasOwnProperty(table)) {
            commands = commands.concat(this.getCreateTableCommand(this.tables[table]));
        }
    }

    // Save a promise for executing things after its created
    this.created = this.execute(commands);

    return this.created;
};

/** Log or throw! **/
var onSqlResponse = function (msg, resolve, reject, err) {
    if (err) {
        console.error('error in ' + msg);
        console.error(err);
        reject(err);
        throw err;
    }

    console.log(msg);
    resolve();
};

var queryPromise = function (msg, resolve, reject) {
    this.connection.query(msg, onSqlResponse.bind(this, msg, resolve, reject));
};

/**
 * Send commands to the sql instance
 * @param  {String[]} Either a string or array of strings
 */
Database.prototype.execute = function (commands) {
    if (typeof(commands) === 'string') {
        commands = [commands];
    }


    this.connection.connect();

    var promises = [];

    for (var i = 0, len = commands.length; i < len; i += 1) {
        promises.push(new Promise(queryPromise.bind(this, commands[i])));
    }

    this.connection.end();

    return Promise.all(promises);
};


// Create the table
Database.prototype.getCreateTableCommand = function (table) {
    var commands = [];

    commands.push(table.getCommand({
        command: COMMANDS.DROP,
        condition: CONDITIONS.IF_EXISTS
    }));

    commands.push(table.getCommand({
        command: COMMANDS.CREATE
    }));

    return commands;
};

/**
 * Given an object of tables, create a table class + add it to the db
 * No generation of code here.
 */
Database.prototype.addTables = function (tables) {
    for (var tableName in tables) {
        if (tables.hasOwnProperty(tableName)) {
            var table = tables[tableName];

            // Set the name
            table.name = tableName;

            // Create Table object
            this.tables[tableName] = new Table(table, this.tables);

            // When it's worked out what primary key it is, set it back so other things
            // can reference it.
            table.primaryKey = this.tables[tableName].getPrimaryKey();
        }
    }
};

module.exports = Database;

