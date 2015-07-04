
const mysql = require('mysql');

const COMMANDS = require('./COMMANDS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const CONDITIONS = require('./CONDITIONS');

var Database = function (name, server, user) {
    this.name = name;
    this.server = server;
    this.user = user;
    this.tables = {};
};

/** Log or throw! **/
var onSqlResponse = function (msg, resolve, reject, err) {
    if (err) {
        console.error('error in ' + msg);
        console.error(err);
        reject(err);
        throw err;
        return;
    }

    console.log(msg);
    resolve();
};

var queryPromise = function (connection, msg, resolve, reject) {
    connection.query(msg, onSqlResponse.bind(this, msg, resolve, reject));
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
    commands.unshift('SET FOREIGN_KEY_CHECKS=0');

    var promises = [];

    for (var i = 0, len = commands.length; i < len; i += 1) {
        promises.push(new Promise(queryPromise.bind(this, connection, commands[i])));
    }

    connection.end();

    return Promise.all(promises);
};

// Create the table
Database.prototype.createTable = function (table) {
    this.tables[table.name] = table;

    // Drop it if it exists
    // Then recreate it
    return this.dropTable(table).then(this.execute.bind(this, table.getCommand({
        command: COMMANDS.CREATE
    })));
};

/**
 * Drop table
 * @param  {string} table
 * @return {[type]}
 */
Database.prototype.dropTable = function (table) {
    return this.execute(table.getCommand({
        command: COMMANDS.DROP,
        condition: CONDITIONS.IF_EXISTS
    }));
};

/**
 *
 * @param  {String} - name of the table
 * @return {[type]}
 */
Database.prototype.getTable = function (name) {
    return this.tables[name];
};

/**
 * Drop the whole DB
 * @return {[type]}
 */
Database.prototype.drop = function () {
    return this.execute([
        COMMANDS.DROP,
        OBJECT_TYPES.DATABASE,
        CONDITIONS.IF_EXISTS,
        this.name
    ].join(' '));
};

/**
 * Create the whole DB
 * @return {[type]}
 */
Database.prototype.create = function () {
    return this.execute([
        COMMANDS.CREATE,
        OBJECT_TYPES.DATABASE,
        this.name
    ].join(' '));
};



module.exports = Database;

