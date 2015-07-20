
const Response = require('./Response');
const Router = require('./Router');

const routes = [{
    route: '/test',
    method: Router.METHODS.GET,
    handler: function(req, res) {
        res.json({
            message: "NEED A WAY TO FETCH STUFF FROM DB"
        });
    }
}, {
    route: '/drivers',
    method: Router.METHODS.GET,
    handler: function(req, res) {
        this.db.selectDriver().then(function (drivers) {
            console.log(drivers);

            res.json(new Response(drivers));

        }, function () {
            console.log('error');
        });
    }
}];

module.exports = routes;