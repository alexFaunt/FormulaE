/****** Setup *******/

const Database = require('./Database');

/****** Connect *******/




/******* Define the database *********/


var database = new Database('formulae', 'localhost', 'root');

var TABLES = {
    SEASONS: 'seasons',
    DRIVERS: 'drivers'
};

database.addTable(TABLES.SEASONS, {
    id: Database.FIELD_TYPES.INT,
    year: Database.FIELD_TYPES.INT
});

database.addTable(TABLES.DRIVERS, {
    id: Database.FIELD_TYPES.INT,
    first_name: Database.FIELD_TYPES.VARCHAR(255),
    second_name: Database.FIELD_TYPES.VARCHAR(255)
});



/******* List all the commands *********/

// Drop all types of table

database.executeOnAll(Database.COMMANDS.DROP);

database.executeOnAll(Database.COMMANDS.CREATE);