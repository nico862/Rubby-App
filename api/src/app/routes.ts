import * as express from "express";

import * as bookingsController from "./controllers/bookings-controller";
import * as calendarController from "./controllers/calendar-controller";
import * as therapistController from "./controllers/therapist-controller";
import OAuthModel from "./models/oauth-model";
import * as errorHandlers from "./error-handlers";
import config from "./config";

const OAuthServer = require("express-oauth-server");

export interface OAuthApp extends express.Application {
  oauth: any;
}

/**
 * Configure the app routes
 * @param {express.Application} app An Express app
 */
export function configure(app: express.Application) {
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
  const router = express.Router();

  router.all("/oauth/token", app["oauth"].token());

  router.route("/therapist")
    .get(app["oauth"].authenticate(), therapistController.showTherapist);

  router.route("/bookings/")
    .get(app["oauth"].authenticate(), bookingsController.listBookings);

  router.route("/calendar")
    .get(app["oauth"].authenticate(), calendarController.showCalendar);

  router.route("/calendar/:date")
    .get(app["oauth"].authenticate(), calendarController.getDayAvailability);

  router.route("/availability")
    .post(app["oauth"].authenticate(), calendarController.insertDayAvailability);

  router.route("/availability/:availabilityUrn")
    .delete(app["oauth"].authenticate(), calendarController.deleteDayAvailability);

  const packageInfo = require(`${config.pathToRoot}package.json`);
  router.route("/status")
    .get((req, res) => {
      res.json({
        status: "OK",
        version: packageInfo.version,
      });
    });

  app.use(config.baseUrlPath, router);
};
