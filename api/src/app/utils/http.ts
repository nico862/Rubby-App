import * as express from "express";
import config from "../config";

export function location(req: express.Request, path: string) {
  return `${ req.protocol }://${ req.get("host") }${ config.baseUrlPath }${ path }`;
}
