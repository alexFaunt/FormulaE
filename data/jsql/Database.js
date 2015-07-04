
const mysql = require('mysql');

const COMMANDS = require('./COMMANDS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const CONDITIONS = require('./CONDITIONS');

var Database = function (name, server, user) {
    this.name = name;
    this.server = server;
    this.user = user;
    this.tables = {};
    this.created = false;

    this.commands = [
        [COMMANDS.DROP, OBJECT_TYPES.DATABASE, CONDITIONS.IF_EXISTS, name].join(' '),
        [COMMANDS.CREATE, OBJECT_TYPES.DATABASE, name].join(' '),
        [COMMANDS.USE, name].join(' '),
        [COMMANDS.SET, 'FOREIGN_KEY_CHECKS=0'].join(' ')
    ];
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

    this.commands.push(table.getCommand({
        command: COMMANDS.DROP,
        condition: CONDITIONS.IF_EXISTS
    }));

    this.commands.push(table.getCommand({
        command: COMMANDS.CREATE
    }));
};

/**
 * Create the whole DB
 * @return {[type]}
 */
Database.prototype.create = function () {
    var promise = this.execute(this.commands);
    this.created = true;
    this.commands = [];
    return promise;
};



module.exports = Database;

