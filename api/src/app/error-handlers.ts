import * as express from "express";

import {logger} from "./logger";
import { ValidationError, ResourceNotFound } from "./errors";

const OAuth2Error: any = require("oauth2-server");

export function errorLogger(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.error(err.message, err);
  next(err);
}

export function resourceErrorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction): express.Response {

  console.log("Error: " + err.typeof);
  if (err instanceof OAuth2Error) {
    return res.status(400).json({"error-message": err.message});
  }
  if (err instanceof ResourceNotFound) {
    return res.status(404).json({"error-message": err.message });
  }
  next(err);
}

export function errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(500).json({"error-message" : "The server encountered an unexpected condition which prevented it from fulfilling the request."});
}