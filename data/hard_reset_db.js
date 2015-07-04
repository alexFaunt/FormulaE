/****** Setup *******/


// DO THIS PROPERLY
// MAKE - TABLE
// MAKE IT OUTPUT ITS OWN SQL BASED ON ITS PROBS
// DATABASE.ADDTABLE(TABLE)
// DOC WHILE YOU GO


const Database = require('./jsql/Database');

const Table = require('./jsql/Table');

const Field = require('./jsql/Field');

const FIELD_TYPES = require('./jsql/FIELD_TYPES');

const COMMANDS = require('./jsql/COMMANDS');

const CONSTRAINTS = require('./jsql/CONSTRAINTS');


// /******* Define the database *********/

var database = new Database('formulae', 'localhost', 'root');

var seasons = new Table({
    name: 'seasons',
    fields: [
        new Field({
            name: 'id',
            type: FIELD_TYPES.INT
        })
    ],
    constraints: {
        id: CONSTRAINTS.PRIMARY_KEY
    }
});

// database.clearAll();

database.createTable(seasons);

// // Tables!
// TABLES.SEASONS = database.addTable('seasons', {
//     id: {
//         type: FIELD_TYPES.INT,
//         attrs: [
//             FIELD_ATTRS.NOT_NULL,
//             FIELD_ATTRS.PRIMARY_KEY
//         ]
//     },
//     year: FIELD_TYPES.INT
// });

// TABLES.DRIVERS = database.addTable('drivers', {
//     id: {
//         type: FIELD_TYPES.INT,
//         attrs: [
//             FIELD_ATTRS.NOT_NULL,
//             FIELD_ATTRS.PRIMARY_KEY
//         ]
//     },
//     first_name: FIELD_TYPES.VARCHAR(255),
//     second_name: FIELD_TYPES.VARCHAR(255)
// });

// TABLES.TEAMS = database.addTable('teams', {
//     id: {
//         type: FIELD_TYPES.INT,
//         attrs: [
//             FIELD_ATTRS.NOT_NULL,
//             FIELD_ATTRS.PRIMARY_KEY
//         ]
//     },
//     name: FIELD_TYPES.VARCHAR(255)
// });

// TABLES.SEASONS_TEAMS_DRIVERS = 'seasons_teams_drivers';
// database.addTable(TABLES.SEASONS_TEAMS_DRIVERS, {
//     season_id: {
//         foreignKey: TABLES.SEASONS.name
//     },
//     team_id: {
//         foreignKey: TABLES.TEAMS.name
//     },
//     driver_id: {
//         foreignKey: TABLES.DRIVERS.name
//     }
// });



// // /******* List all the commands *********/

// // // Drop all types of table

// database.executeOnAll(COMMANDS.DROP);

// database.executeOnAll(COMMANDS.CREATE);