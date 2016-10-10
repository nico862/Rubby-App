import * as express from "express";

import * as bookingsController from "./controllers/bookings-controller";
import * as calendarController from "./controllers/calendar-controller";
import OAuthModel from "./models/oauth";
import * as errorHandlers from "./error-handlers";

const OAuthServer = require("express-oauth-server");

export interface OAuthApp extends express.Application {
  oauth: any;
}

/**
 * Configure the app routes
 * @param {express.Application} app An Express app
 */
export function configure(app: express.Application) {
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

  const oauthModel = new OAuthModel();

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

};
