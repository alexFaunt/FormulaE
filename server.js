// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');           // call express
var app = express();                        // define our app using express
var bodyParser = require('body-parser');

var Database = require('./data/jsql/Database');

var tables = require('./data/tables');
var data = require('./data/jsonData');

var config = {
    name: 'formulae',
    server: 'localhost',
    user: 'root',
    tables: tables
};

var db = new Database(config);

db.create();

db.populate(data);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------

router.route('/test')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req, res) {
        res.json({
            message: "NEED A WAY TO FETCH STUFF FROM DB"
        });
    });


// all of our routes will be prefixed with /api
app.use('/api', router);




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

