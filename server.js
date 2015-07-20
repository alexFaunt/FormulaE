// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express');           // call express
const app = express();                        // define our app using express
const bodyParser = require('body-parser');

const Database = require('./data/jsql/Database');

const tables = require('./data/tables');
const data = require('./data/jsonData');

const Router = require('./data/api/Router');
const routes = require('./data/api/routes');


const db = new Database({
    name: 'formulae',
    server: 'localhost',
    user: 'root',
    tables: tables
});

db.create();

db.populate(data);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================

const router = new Router({
    router: express.Router(),
    db: db,
    routes: routes
});

// all of our routes will be prefixed with /api
app.use('/api', router.getRouter());


// Try to close gracefully.
process.on('SIGTERM', function () {
    console.log("Closing");
    app.close();
});
app.on('close', function () {
    db.connection.destroy();
    console.log("Closed");
});

// Start
app.listen(port);
console.log('Magic happens on port ' + port);

