import * as express from "express";

import * as therapistModel from "../models/therapist-model";

export function showTherapist(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const therapistUrn = res.locals.oauth.token.user.therapist["@id"];

  therapistModel.salonAndTherapist(therapistUrn)
    .then(res.json.bind(res))
    .catch(next);
}
