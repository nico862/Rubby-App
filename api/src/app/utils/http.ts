import * as express from "express";

export function location(req: express.Request, path: string) {
  return `${req.protocol}://${req.get("host")}${path}`;
}
