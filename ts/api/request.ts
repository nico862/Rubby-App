import * as httpStatus from "http-status";
import * as _ from "lodash";
import * as semver from "semver";
import * as React from "react";

import * as tokenStorage from "./token-storage";
import config from "../config";
import formUrlencoded = require("form-urlencoded");

declare const fetch: (urlOrRequest: string | any, options?: any) => Promise<any>;

export const REQUEST_ERROR = "unknown-error";
export const REQUEST_APP_VERSION_UPGRADE = "require-upgrade";
export const REQUEST_ACCESS_TOKEN_EXPIRED = "access-token-expired";
export const REQUEST_REFRESH_TOKEN_EXPIRED = "refresh-token-expired";

const accessTokenExpired = new RegExp("access token has expired");
const refreshTokenExpired = "REFRESH_TOKEN_NOT_FOUND";

export default class ApiRequest {
  constructor(private path?: string, private options?: any) {}

  makeRequest(): any {
    if (!this.path) throw new Error("You must supply a path for the request");

    return this._authenticatedRequest()
      .then(this._validateResponse)
      .catch((err: Error) => {
        switch (err.message) {
          case REQUEST_ACCESS_TOKEN_EXPIRED:
            return this.authenticateRefreshToken()
              .then(this._authenticatedRequest.bind(this))
              .then(this._validateResponse)
              .catch(err => { console.log("HERE " + err.message); throw err; });

          default:
            throw err;
        }
      });
  }

  authenticatePassword(username: string, password: string) {
    const postParams = {
      username,
      password,
      grant_type: "password",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${ config.api.clientAuth }`
      },
      body: formUrlencoded(postParams)
    };

    console.log(`Making request to ${ config.api.host }/oauth/token with options: `, options);

    return fetch(`${ config.api.host }/oauth/token`, options)
      .then(this._validateResponse)
      .then(res => res.json())
      .then(tokenStorage.storeTokens);
  }

  authenticateRefreshToken(): React.Promise<boolean> {
    return tokenStorage.getTokens()
      .then(tokens => {
        const postParams = {
          refresh_token: tokens.refreshToken,
          grant_type: "refresh_token",
        };

        // need to cast this promise as a React promise!
        const request = fetch(`${ config.api.host }/oauth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${ config.api.clientAuth }`
          },
          body: formUrlencoded(postParams)
        }) as any as React.Promise<any>;

        return request
          .then(this._validateResponse)
          .then(res => res.json())
          .then(tokenStorage.storeTokens);
      });
  }

  private _validateResponse(res: any): any {
    if (semver.lt(config.appVersion, res.headers.get("X-Min-App-Version"))) {
      // app version is not recent enough for the server API
      throw new Error(REQUEST_APP_VERSION_UPGRADE);
    }

    if (res.ok) {
      return res;
    }
    else if (res.status === httpStatus.UNAUTHORIZED) {
      return res.json().then((data: any) => {
        if (data["error"] === "invalid_token" && data["error_description"].match(accessTokenExpired)) {
          throw new Error(REQUEST_ACCESS_TOKEN_EXPIRED);
        }
      });
    }
    else if (res.status === httpStatus.SERVICE_UNAVAILABLE) {
      console.log("Service unavailable");
      return res.json().then((data: any) => {
        if (data["error"] === "server_error" && data["error_description"] === refreshTokenExpired) {
          throw new Error(REQUEST_REFRESH_TOKEN_EXPIRED);
        }
      });
    }

    throw new Error(REQUEST_ERROR);
  }

  private _authenticatedRequest(): React.Promise<any> {
    return tokenStorage.getTokens()
      .then(tokens => {
        const options = _.clone(this.options);

        if (!options.headers) options.headers = {};

        options.headers["Authorization"] = `Bearer ${tokens.accessToken}`;

        console.log("Making request to " + this.path + " with options: ", options);

        return fetch(`${ config.api.host }${ this.path }`, options);
      });
  }
}
