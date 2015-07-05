/****** Setup *******/

const Database = require('./jsql/Database');

const FIELD_TYPES = require('./jsql/FIELD_TYPES');

const CONSTRAINTS = require('./jsql/CONSTRAINTS');

// TODO - make constraints a child of a field
// COMBINE ATTR WITH CONSTRAINTS


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
            constraints: [
                CONSTRAINTS.PRIMARY_KEY,
                CONSTRAINTS.AUTO_INCREMENT
            ]
        },
        year_start: {
            type: FIELD_TYPES.INT
        },
        year_end: {
            type: FIELD_TYPES.INT
        }
    }
};

db.tables.drivers = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            constraints: [
                CONSTRAINTS.PRIMARY_KEY,
                CONSTRAINTS.AUTO_INCREMENT
            ]
        },
        first_name: {
            type: FIELD_TYPES.VARCHAR(32)
        },
        second_name: {
            type: FIELD_TYPES.VARCHAR(32)
        }
    }
};

db.tables.teams = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            constraints: [
                CONSTRAINTS.PRIMARY_KEY,
                CONSTRAINTS.AUTO_INCREMENT
            ]
        },
        name: {
            type: FIELD_TYPES.VARCHAR(32)
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

db.tables.countries = {
    fields: {
        code: {
            type: FIELD_TYPES.VARCHAR(3),
            constraints: [
                CONSTRAINTS.PRIMARY_KEY
            ]
        },
        name: {
            type: FIELD_TYPES.VARCHAR(32)
        }
    }
};

db.tables.tracks = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            constraints: [
                CONSTRAINTS.PRIMARY_KEY,
                CONSTRAINTS.AUTO_INCREMENT
            ]
        },
        country_id: {
            type: db.tables.countries.fields.code.type
        },
        name: {
            type: FIELD_TYPES.VARCHAR(32)
        }
    },
    constraints: {
        country_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.countries
        }
    }
};

db.tables.events = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            constraints: [
                CONSTRAINTS.PRIMARY_KEY,
                CONSTRAINTS.AUTO_INCREMENT
            ]
        },
        track_id: {
            type: db.tables.tracks.fields.id.type
        },
        season_id: {
            type: db.tables.seasons.fields.id.type
        }
    },
    constraints: {
        track_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.tracks
        },
        season_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.seasons
        }
    }
};

db.tables.results = {
    fields: {
        event_id: {
            type: db.tables.events.fields.id.type,
            constraints: [
                CONSTRAINTS.PRIMARY_KEY
            ]
        },
        pos_1: {
            type: db.tables.drivers.fields.id.type
        }
    },
    constraints: {
        event_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.events
        },
        pos_1: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.drivers
        }
    }
};

var database = new Database(db);
database.create();










