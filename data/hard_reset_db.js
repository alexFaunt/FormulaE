/****** Setup *******/

const Database = require('./Database');

/****** Connect *******/




/******* Define the database *********/


var database = new Database('formulae', 'localhost', 'root');

var TABLES = {};

TABLES.SEASONS = 'seasons';
database.addTable(TABLES.SEASONS, {
    id: Database.FIELD_TYPES.INT,
    year: Database.FIELD_TYPES.INT
});

TABLES.DRIVERS = 'drivers';
database.addTable(TABLES.DRIVERS, {
    id: {
        type: Database.FIELD_TYPES.INT,
        attrs: [
             Database.ATTRS.NOT_NULL,
             Database.ATTRS.PRIMARY_KEY
        ]
    },
    first_name: Database.FIELD_TYPES.VARCHAR(255),
    second_name: Database.FIELD_TYPES.VARCHAR(255)
});

TABLES.TEAMS = 'teams';
database.addTable(TABLES.TEAMS, {
    id: Database.FIELD_TYPES.INT,
    name: Database.FIELD_TYPES.VARCHAR(255)
});



/******* List all the commands *********/

// Drop all types of table

database.executeOnAll(Database.COMMANDS.DROP);

database.executeOnAll(Database.COMMANDS.CREATE);