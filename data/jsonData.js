
var data = {};

/**
 * Purely the Id and the times of the season
 */
data.seasons = [
    ['null', 2014, 2015],
    ['null', 2015, 2016]
];

/**
 * Everything about a driver
 * @type {Object}
 */
data.drivers = [
    ['null', '"Sebastien"', '"Buemi"'],
    ['null', '"Oliver"', '"Turvey"'],
    ['null', '"Nelson"', '"Piquet Jr."'],
    ['null', '"Sam"', '"Bird"']
];

/**
 * The teams that exist - ever
 * @type {Object}
 */
data.teams = [
    ['null', '"Virgin Racing"'],
    ['null', '"Edams Renault"'],
    ['null', '"NEXTEV"']
];

/**
 * Seasons Teams sign up, with drivers
 * @type {Object}
 */
data.seasons_teams_drivers = [
    [1, 2, 1]
];

/**
 * List of countries key'd by their 3 letter code ... ENG
 * @type {Object}
 */
data.countries = [
    ['"ENG"', '"England"'],
    ['"BRA"', '"Brazil"'],
    ['"SWI"', '"Switzerland"']
];

/**
 * Tracks that exist
 * @type {Object}
 */
data.tracks = [
    ['null', '"ENG"', '"Silverstone"']
];

/**
 * Types of event - e.g. qualifying race
 * @type {Object}
 */
data.event_types = [
    ['null', '"FP1"'],
    ['null', '"FP2"'],
    ['null', '"FP3"'],
    ['null', '"Qualifying"'],
    ['null', '"Race"']
];

/**
 * Race meetings - rounds, e.g. round 11
 * @type {Object}
 */
data.rounds = [
    ['null', 1, 1, 1,'"20140301"', '"20140401"'],
    ['null', 1, 2, 1,'"20140401"', '"20140501"']
];

/**
 *  An event is part of a round, e.g. qualifying in round 10
 * @type {Object}
 */
data.events = [
    ['null', 1, 1,'"20140501"']
];

/**
 * Status of driver in race e.g. finished - retired
 * @type {Object}
 */
data.status_types = [
    ['null', '"Finished"'],
    ['null', '"Retired"']
];

/**
 * A drivers results in a given event.
 * @type {Object}
 */
data.event_driver_result = [
    [1, 1, 1, 1, 100]
];


module.exports = data;




