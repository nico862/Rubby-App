import * as express from "express";
import * as moment from "moment";
import "moment-timezone";
import * as httpStatus from "http-status";

import * as calendarModel from "../models/calendar-model";
import * as httpUtils from "../utils/http";
import config from "../config";

export function showCalendar(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];

  calendarModel.getCalendarForTherapist(therapistUrn)
    .then(data => res.json(data))
    .catch(console.log);
}

export function getDayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];
  const date = moment.tz(req.params.date, config.timezone);
  const reqParams: httpUtils.RequestParams = {
    protocol: req.protocol,
    host: req.get("host"),
  };

  calendarModel.getAvailabilityForTherapistForDay(reqParams, therapistUrn, date)
    .then(data => res.json(data))
    .catch(next);
}

export function insertDayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];
  const params = req.body;

  calendarModel.createAvailability(therapistUrn, params)
    .then(availability => {
      res.status(httpStatus.CREATED);
      res.location(httpUtils.location(req, `/availability/${availability.urn}`));
      res.end();
    })
    .catch(next);
}

export function deleteDayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const availabilityUrn = req.params.availabilityUrn;

  calendarModel.deleteAvailability(availabilityUrn)
    .then(() => {
      res.status(httpStatus.NO_CONTENT);
      res.end();
    })
    .catch(next);
}
