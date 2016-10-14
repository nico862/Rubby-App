import * as express from "express";
import * as moment from "moment";
import "moment-timezone";
import * as httpStatus from "http-status";

import * as availabilityModel from "../models/calendar-model";
import {location} from "../utils/http";
import config from "../config";

export function index(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];

  availabilityModel.getCalendarForTherapist(therapistUrn)
    .then(data => res.json(data))
    .catch(console.log);
}

export function getDayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];
  const date = moment.tz(req.params.date, config.timezone);

  availabilityModel.getAvailabilityForTherapistForDay(req, therapistUrn, date)
    .then(data => res.json(data))
    .catch(next);
}

export function insertDayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];
  const params = req.body;

  availabilityModel.createAvailability(therapistUrn, params)
    .then(availability => {
      res.status(httpStatus.CREATED);
      res.location(location(req, `/availability/${availability.urn}`));
      res.end();
    })
    .catch(next);
}

export function deleteDayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const availabilityUrn = req.params.availabilityUrn;

  availabilityModel.deleteAvailability(availabilityUrn)
    .then(() => {
      res.status(httpStatus.NO_CONTENT);
      res.end();
    })
    .catch(next);
}
