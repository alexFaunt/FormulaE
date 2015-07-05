/****** Setup *******/

const Database = require('./jsql/Database');

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
        id: {
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
            ]
        },
        year_start: {
            type: FIELD_TYPES.INT
        },
        year_end: {
            type: FIELD_TYPES.INT
        }
    },
    constraints: {
        id: {
            type: CONSTRAINTS.PRIMARY_KEY
        }
    }
};

db.tables.drivers = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
            ]
        },
        first_name: {
            type: FIELD_TYPES.VARCHAR(32)
        },
        second_name: {
            type: FIELD_TYPES.VARCHAR(32)
        }
    },
    constraints: {
        id: {
            type: CONSTRAINTS.PRIMARY_KEY
        }
    }
};

db.tables.teams = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
            ]
        },
        name: {
            type: FIELD_TYPES.VARCHAR(32)
        }
    },
    constraints: {
        id: {
            type: CONSTRAINTS.PRIMARY_KEY
        }
    }
};

db.tables.seasons_teams_drivers = {
    fields: {
        season_id: {
            type: db.tables.seasons.fields.id.type
        },
        team_id: {
            type: db.tables.teams.fields.id.type
        },
        driver_id: {
            type: db.tables.drivers.fields.id.type
        }
    },
    constraints: {
        season_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.seasons
        },

        team_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.teams
        },

        driver_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.drivers
        }
    }
};

var database = new Database(db);
database.create();
