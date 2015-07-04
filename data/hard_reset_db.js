/****** Setup *******/


// DO THIS PROPERLY
// MAKE - TABLE
// MAKE IT OUTPUT ITS OWN SQL BASED ON ITS PROBS
// DATABASE.ADDTABLE(TABLE)
// DOC WHILE YOU GO


const Database = require('./jsql/Database');

const Field = require('./jsql/Field');

const Constraint = require('./jsql/Constraint');

const FIELD_TYPES = require('./jsql/FIELD_TYPES');

const CONSTRAINTS = require('./jsql/CONSTRAINTS');

const FIELD_ATTRS = require('./jsql/FIELD_ATTRS');


// /******* Define the database *********/

var db = {
    name: 'formulae',
    server: 'localhost',
    user: 'root',
    tables: {}
};

db.tables.seasons = {
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
};

db.tables.drivers = {
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
};

db.tables.teams = {
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
};

db.tables.seasons_teams_drivers = {
    fields: {
        season_id: new Field({
            type: db.tables.seasons.fields.id.type
        }),
        team_id: new Field({
            type: db.tables.teams.fields.id.type
        }),
        driver_id: new Field({
            type: db.tables.drivers.fields.id.type
        })
    },
    constraints: {
        season_id: new Constraint({
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.seasons
        }),

        team_id: new Constraint({
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.teams
        }),

        driver_id: new Constraint({
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.drivers
        })
    }
};

var database = new Database(db);
database.create();
