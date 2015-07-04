/****** Setup *******/


// DO THIS PROPERLY
// MAKE - TABLE
// MAKE IT OUTPUT ITS OWN SQL BASED ON ITS PROBS
// DATABASE.ADDTABLE(TABLE)
// DOC WHILE YOU GO


const Database = require('./jsql/Database');

const Table = require('./jsql/Table');

const Field = require('./jsql/Field');

const Constraint = require('./jsql/Constraint');

const FIELD_TYPES = require('./jsql/FIELD_TYPES');

const CONSTRAINTS = require('./jsql/CONSTRAINTS');

const FIELD_ATTRS = require('./jsql/FIELD_ATTRS');


// /******* Define the database *********/

var database = new Database('formulae', 'localhost', 'root');

database.drop();

database.create();

var seasons = new Table({
    name: 'seasons',
    fields: {
        id: new Field({
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
            ]
        }),
        year_start: new Field({
            type: FIELD_TYPES.INT
        }),
        year_end: new Field({
            type: FIELD_TYPES.INT
        })
    },
    constraints: {
        id: new Constraint({
            type: CONSTRAINTS.PRIMARY_KEY
        })
    }
});
database.createTable(seasons);

var drivers = new Table({
    name: 'drivers',
    fields: {
        id: new Field({
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
            ]
        }),
        first_name: new Field({
            type: FIELD_TYPES.VARCHAR(32)
        }),
        second_name: new Field({
            type: FIELD_TYPES.VARCHAR(32)
        })
    },
    constraints: {
        id: new Constraint({
            type: CONSTRAINTS.PRIMARY_KEY
        })
    }
});
database.createTable(drivers);

var teams = new Table({
    name: 'teams',
    fields: {
        id: new Field({
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
            ]
        }),
        name: new Field({
            type: FIELD_TYPES.VARCHAR(32)
        })
    },
    constraints: {
        id: new Constraint({
            type: CONSTRAINTS.PRIMARY_KEY
        })
    }
});
database.createTable(teams);

var seasons_teams_drivers = new Table({
    name: 'seasons_teams_drivers',
    fields: {
        season_id: new Field({
            type: seasons.fields.id.type
        }),
        team_id: new Field({
            type: teams.fields.id.type
        }),
        driver_id: new Field({
            type: drivers.fields.id.type
        })
    },
    constraints: {
        season_id: new Constraint({
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: seasons
        }),

        team_id: new Constraint({
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: teams
        }),

        driver_id: new Constraint({
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: drivers
        })
    }
});
database.createTable(seasons_teams_drivers);


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