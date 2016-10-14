import * as express from "express";

import * as bookingModel from "../models/bookings-model";

export function index(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];
  const start = moment().startOf("day").subtract(2, "months");
  const end = moment().startOf("day").add(2, "months");

  bookingModel.getBookingsForTherapist(therapistUrn, {start, end})
    .then(data => res.json(data))
    .catch(next);
}
