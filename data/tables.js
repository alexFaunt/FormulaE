/****** Setup *******/

const FIELD_TYPES = require('./jsql/FIELD_TYPES');

const CONSTRAINTS = require('./jsql/CONSTRAINTS');

// TODO - make constraints a child of a field
// COMBINE ATTR WITH CONSTRAINTS


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

var tables = {};

/**
 * Purely the Id and the times of the season
 */
tables.seasons = {
    fields: {
        id: fieldIntAutoPk,
        year_start: fieldInt,
        year_end: fieldInt
    }
};

/**
 * Everything about a driver
 * @type {Object}
 */
tables.drivers = {
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
tables.teams = {
    fields: {
        id: fieldIntAutoPk,
        name: fieldVarChar(32)
    }
};

/**
 * Seasons Teams sign up, with drivers
 * @type {Object}
 */
tables.seasons_teams_drivers = {
    fields: {
        season_id: {
            type: tables.seasons.fields.id.type
        },
        team_id: {
            type: tables.teams.fields.id.type
        },
        driver_id: {
            type: tables.drivers.fields.id.type
        }
    },
    constraints: {
        season_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.seasons
        },

        team_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.teams
        },

        driver_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.drivers
        }
    }
};

/**
 * List of countries key'd by their 3 letter code ... ENG
 * @type {Object}
 */
tables.countries = {
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
tables.tracks = {
    fields: {
        id: fieldIntAutoPk,
        country_id: {
            type: tables.countries.fields.code.type
        },
        name: fieldVarChar(32)
    },
    constraints: {
        country_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.countries
        }
    }
};

/**
 * Types of event - e.g. qualifying race
 * @type {Object}
 */
tables.event_types = {
    fields: {
        id: fieldIntAutoPk,
        name: fieldVarChar(32)
    }
};

/**
 * Race meetings - rounds, e.g. round 11
 * @type {Object}
 */
tables.rounds = {
    fields: {
        id: fieldIntAutoPk,
        season_id: {
            type: tables.seasons.fields.id.type
        },
        round_number: fieldInt,
        track_id: {
            type: tables.tracks.fields.id.type
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
            reference: tables.tracks
        },
        season_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.seasons
        }
    }
};

/**
 *  An event is part of a round, e.g. qualifying in round 10
 * @type {Object}
 */
tables.events = {
    fields: {
        id: fieldIntAutoPk,
        round_id: {
            type: tables.rounds.fields.id.type
        },
        event_type: {
            type: tables.event_types.fields.id.type
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
tables.status_types = {
    fields: {
        id: fieldIntAutoPk,
        name: fieldVarChar(32)
    }
};

/**
 * A drivers results in a given event.
 * @type {Object}
 */
tables.event_driver_result = {
    fields: {
        event_id: {
            type: tables.events.fields.id.type
        },
        driver_id: {
            type: tables.drivers.fields.id.type
        },
        position: fieldInt,
        status: {
            type: tables.status_types.fields.id.type
        },
        laps_completed: fieldInt
    },
    constraints: {
        event_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.events
        },
        driver_id: {
            type: CONSTRAINTS.FOREIGN_KEY,
            reference: tables.drivers
        }
    }
};



module.exports = tables;




