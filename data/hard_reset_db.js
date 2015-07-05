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

db.tables.countries = {
    fields: {
        code: {
            type: FIELD_TYPES.VARCHAR(3)
        },
        name: {
            type: FIELD_TYPES.VARCHAR(32)
        }
    },
    constraints: {
        code: {
            type: CONSTRAINTS.PRIMARY_KEY
        }
    }
};

db.tables.tracks = {
    fields: {
        id: {
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
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
        id: {
            type: CONSTRAINTS.PRIMARY_KEY
        },
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
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
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
        id: {
            type: CONSTRAINTS.PRIMARY_KEY
        },
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
        id: {
            type: FIELD_TYPES.INT,
            attrs: [
                FIELD_ATTRS.NOT_NULL,
                FIELD_ATTRS.AUTO_INCREMENT
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
        id: [{
                type: CONSTRAINTS.PRIMARY_KEY
            },
            {
                type: CONSTRAINTS.FOREIGN_KEY,
                reference: db.tables.tracks
            }
        ]
    }
};

var database = new Database(db);
database.create();










