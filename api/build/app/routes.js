"use strict";
const express = require("express");
const bookingsController = require("./controllers/bookings-controller");
const calendarController = require("./controllers/calendar-controller");
const oauth_1 = require("./models/oauth");
const errorHandlers = require("./error-handlers");
const OAuthServer = require("express-oauth-server");
/**
 * Configure the app routes
 * @param {express.Application} app An Express app
 */
function configure(app) {
    app.use(express.static(__dirname + "/public"));
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");
        // Request methods you wish to allow
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        // Pass to next layer of middleware
        next();
    });
    app.use(errorHandlers.errorLogger);
    app.use(errorHandlers.resourceErrorHandler);
    app.use(errorHandlers.errorHandler);
    const oauthModel = new oauth_1.default();
    app["oauth"] = new OAuthServer({
        model: oauthModel,
        debug: true,
        accessTokenLifetime: oauthModel.accessTokenLifetime
    });
    // Handle token grant requests
    app.all("/oauth/token", app["oauth"].token());
    app.route("/bookings")
        .get(app["oauth"].authenticate(), bookingsController.index);
    app.route("/calendar")
        .get(app["oauth"].authenticate(), calendarController.index);
}
exports.configure = configure;
;

//# sourceMappingURL=routes.js.map
