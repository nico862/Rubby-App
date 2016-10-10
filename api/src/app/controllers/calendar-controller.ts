import * as express from "express";
import * as moment from "moment";

import { bookingService } from "../services";
import { getDates, getDayAvailability } from "../transformers/calendar";
import config from "../config";

export function index(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const user = res.locals.oauth.token.user;

  const start = moment().startOf("day");
  const end = start.clone().add(config.calendar.daysAhead, "days");

  bookingService.fetchBookingsForUser(user.id, {start, end})
    .then(bookings => {
      res.json(getDates(start, end, bookings));
    })
    .catch(console.log);
}

export function dayAvailability(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const user = res.locals.oauth.token.user;

  const day = moment("2016-10-07").startOf("day");

  bookingService.fetchBookingsForUser(user.id, {start: day, end: day})
    .then(bookings => {
      res.json(getDayAvailability(day, bookings));
    })
    .catch(console.log);
}