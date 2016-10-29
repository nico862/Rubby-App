import config from "../config";

export interface RequestParams {
  protocol: string;
  hostname: string;
  port: number;
}

export function location(req: RequestParams, path: string) {
  return `${ req.protocol }://${ req.hostname }:${ req.port }${ config.baseUrlPath }${ path }`;
}
