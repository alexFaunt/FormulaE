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

/******* Helpers so i can be lazy *******/

/**
 * A standard int field
 * @type {Object}
 */
var fieldInt = {
    type: FIELD_TYPES.INT
};

/**
 * A var char field, simple
 * @return {[type]}
 */
var fieldVarChar = function (size) {
    return {
        type: FIELD_TYPES.VARCHAR(size)
    };
};

/**
 * An integer primary key auto incrementing
 * @type {Object}
 */
var fieldIntAutoPk = {
    type: FIELD_TYPES.INT,
    constraints: [
        CONSTRAINTS.PRIMARY_KEY,
        CONSTRAINTS.AUTO_INCREMENT
    ]
};

/******* End Helpers so i can be lazy *******/



/**
 * Purely the Id and the times of the season
 */
db.tables.seasons = {
    fields: {
        id: fieldIntAutoPk,
        year_start: fieldInt,
        year_end: fieldInt
    },
    data: null /////////////////////////////// TODO - populate Data in each. Also add methods, addData
};

/**
 * Everything about a driver
 * @type {Object}
 */
db.tables.drivers = {
    fields: {
        id: fieldIntAutoPk,
        first_name: fieldVarChar(32),
        second_name: fieldVarChar(32)
    }
};

/**
 * The teams that exist - ever
 * @type {Object}
 */
db.tables.teams = {
    fields: {
        id: fieldIntAutoPk,
        name: fieldVarChar(32)
    }
};

/**
 * Seasons Teams sign up, with drivers
 * @type {Object}
 */
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

/**
 * List of countries key'd by their 3 letter code ... ENG
 * @type {Object}
 */
db.tables.countries = {
    fields: {
        code: {
            type: FIELD_TYPES.VARCHAR(3),
            constraints: [
                CONSTRAINTS.PRIMARY_KEY
            ]
        },
        name: fieldVarChar(32)
    }
};

/**
 * Tracks that exist
 * @type {Object}
 */
db.tables.tracks = {
    fields: {
        id: fieldIntAutoPk,
        country_id: {
            type: db.tables.countries.fields.code.type
        },
        name: fieldVarChar(32)
    },
    constraints: {
        country_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.countries
        }
    }
};

/**
 * Types of event - e.g. qualifying race
 * @type {Object}
 */
db.tables.event_types = {
    fields: {
        id: fieldIntAutoPk,
        name: fieldVarChar(32)
    }
};

/**
 * Race meetings - rounds, e.g. round 11
 * @type {Object}
 */
db.tables.rounds = {
    fields: {
        id: fieldIntAutoPk,
        season_id: {
            type: db.tables.seasons.fields.id.type
        },
        round_number: fieldInt,
        track_id: {
            type: db.tables.tracks.fields.id.type
        },
        date_start: {
            type: FIELD_TYPES.DATE
        },
        date_end: {
            type: FIELD_TYPES.DATE
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

/**
 *  An event is part of a round, e.g. qualifying in round 10
 * @type {Object}
 */
db.tables.events = {
    fields: {
        id: fieldIntAutoPk,
        round_id: {
            type: db.tables.rounds.fields.id.type
        },
        event_type: {
            type: db.tables.event_types.fields.id.type
        },
        date: {
            type: FIELD_TYPES.DATE
        }
    }
};

/**
 * Status of driver in race e.g. finished - retired
 * @type {Object}
 */
db.tables.status_types = {
    fields: {
        id: fieldIntAutoPk,
        name: fieldVarChar(32)
    }
};

/**
 * A drivers results in a given event.
 * @type {Object}
 */
db.tables.event_driver_result = {
    fields: {
        event_id: {
            type: db.tables.events.fields.id.type
        },
        driver_id: {
            type: db.tables.drivers.fields.id.type
        },
        position: fieldInt,
        status: {
            type: db.tables.status_types.fields.id.type
        },
        laps_completed: fieldInt
    },
    constraints: {
        event_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.events
        },
        driver_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: db.tables.drivers
        }
    }
};

// MAKE A DB FROM MY JSON
var database = new Database(db);

// START FROM SCRATCH!
database.create();

// database.populate();








