
const _ = require('lodash');

const mysql = require('mysql');

const COMMANDS = require('./COMMANDS');

const OBJECT_TYPES = require('./OBJECT_TYPES');

const CONSTRAINTS = require('./CONSTRAINTS');

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

    this.connection.connect();
};

/**
 * Burn everything and reset it from what we know about the db
 * @return {}
 */
Database.prototype.create = function () {
    // Prep for db creation
    var commands = [
        [COMMANDS.DROP, OBJECT_TYPES.DATABASE, CONSTRAINTS.IF_EXISTS, this.name].join(' '),
        [COMMANDS.CREATE, OBJECT_TYPES.DATABASE, this.name].join(' '),
        [COMMANDS.USE, this.name].join(' ')
    ];

    // Create all the tables
    for (var table in this.tables) {
        if (this.tables.hasOwnProperty(table)) {
            commands = commands.concat(this.getCreateTableCommand(this.tables[table]));
        }
    }

    // Save a promise for executing things after its ready
    this.ready = this.execute(commands);

    this.ready.then(function () {
        console.log('Creation completed!');
    });

    return this.ready;
};

/** Log or throw! **/
var onSqlResponse = function (msg, resolve, reject, err, response) {
    if (err) {
        console.error('error in ' + msg);
        console.error(err);
        reject(err);
        throw err;
    }

    resolve(response);
};

Database.prototype.queryPromise = function (msg, resolve, reject) {
    this.connection.query(msg, onSqlResponse.bind(this, msg, resolve, reject));
};

var error = function () {
    console.log('error');
};

/**
 * Send commands to the sql instance
 * @param  {String[]} Either a string or array of strings
 */
Database.prototype.execute = function (commands) {

    if (typeof(commands) === 'string') {
        commands = [commands];
    }

    var promises = [];

    for (var i = 0, len = commands.length; i < len; i += 1) {

        console.log(commands[i]);

        promises.push(new Promise(this.queryPromise.bind(this, commands[i])), error);
    }

    return Promise.all(promises)
        .then(function (args) {
            if (_.isArray(args) && args.length) {
                return args[0];
            }
            return args;
        });
};


// Create the table
Database.prototype.getCreateTableCommand = function (table) {
    var commands = [];

    commands.push(table.getCommand({
        command: COMMANDS.DROP,
        condition: CONSTRAINTS.IF_EXISTS
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


/**
 * Given json data - populate the DB with the tables
 * @param  {JSON} data
 * @return {Promise}
 */
Database.prototype.populate = function (data) {
    var commands = [];
    for (var table in data) {
        if (data.hasOwnProperty(table)) {
            commands = commands.concat(this.tables[table].insert(data[table]));
        }
    }

    return this.ready
        .then(this.execute.bind(this, commands))
        .then(function () {
            console.log('Populate Success');
        }, error);
};

// Read Interface.

Database.prototype.select = function (targets) {
    var command = [COMMANDS.SELECT];

    // For all the tables
    for (var tableName in targets) {
        if (targets.hasOwnProperty(tableName)) {
            var fields = targets[tableName];
            var cols = [];

            // Get their columns
            for (var column in fields) {
                if (fields.hasOwnProperty(column)) {
                    cols.push(column);
                }
            }

            command.push(cols.join(','));
            command.push(CONSTRAINTS.FROM);
            command.push(tableName);
        }
    }

    return this.ready
        .then(this.execute.bind(this, command.join(' ')));
};

Database.prototype.selectDriver = function () {
    return this.select({
        drivers: {
            first_name: true,
            second_name: true
        }
    });
};


module.exports = Database;

