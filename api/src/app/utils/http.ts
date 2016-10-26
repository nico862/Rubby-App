import config from "../config";

export interface RequestParams {
  protocol: string;
  host: string;
}

export function location(req: RequestParams, path: string) {
  return `${ req.protocol }://${ req.host }${ config.baseUrlPath }${ path }`;
}
