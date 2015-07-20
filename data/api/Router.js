
/**
 * Simple wrapper for an express router
 * Takes in routes, and a db and binds it all together
 * allowing us to declare routes in a separate api file.
 */
var Router = function (opts) {
    this.db = opts.db;
    this.router = opts.router;

    for (var i = 0; i < opts.routes.length; i += 1) {
        opts.router.route(opts.routes[i].route)[opts.routes[i].method](opts.routes[i].handler.bind(this));
    }
};

Router.prototype.getRouter = function () {
    return this.router;
};


Router.METHODS = {
    GET: 'get'
};

module.exports = Router;