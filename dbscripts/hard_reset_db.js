/****** Setup *******/

const Database = require('Database');

/****** Connect *******/




/******* Define the database *********/


var database = new Database('formulae', 'localhost', 'root');

var TABLES = {
    SEASONS: 'seasons',
    DRIVERS: 'drivers'
};

database[Database.TYPES.TABLE][TABLES.SEASONS] = {
    id: Database.FIELD_TYPES.INT,
    year: Database.FIELD_TYPES.INT
};

database[Database.TYPES.TABLE][TABLES.DRIVERS] = {
    id: Database.FIELD_TYPES.INT,
    first_name: Database.FIELD_TYPES.VARCHAR(255),
    second_name: Database.FIELD_TYPES.VARCHAR(255)
};



/******* List all the commands *********/

// Drop all types of table
var sqlCmds = database.creatCommandOnAllOfType(Database.COMMANDS.DROP, Database.TYPES.TABLE);

// Create everything.
sqlCmds = sqlCmds.concat(database.createCommandOnAll(Database.COMMANDS.CREATE));


/* GO GO GO */
database.commitCommands(sqlCmds);



