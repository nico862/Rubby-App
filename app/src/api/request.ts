import * as httpStatus from "http-status";
import * as _ from "lodash";
import * as semver from "semver";

import * as tokenStorage from "./token-storage";
import config from "../config";
import formUrlencoded = require("form-urlencoded");

declare const fetch: (urlOrRequest: string | any, options?: any) => Promise<any>;

const REQUEST_TOKEN_EXPIRED =  "token-expired";
const REQUEST_ERROR = "unknown-error";
export const REQUEST_APP_VERSION_UPGRADE = "require-upgrade";

const tokenExpired = new RegExp("access token has expired");

export default class ApiRequest {
  constructor(private path?: string, private options?: any) {}

  makeRequest(): any {
    if (!this.path) throw new Error("You must supply a path for the request");

    return this._authenticatedRequest()
      .then(this._validateResponse)
      .catch((err: Error) => {
        switch (err.message) {
          case REQUEST_TOKEN_EXPIRED:
            return this.authenticateRefreshToken()
              .then(this._authenticatedRequest.bind(this))
              .then(this._validateResponse);

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

  authenticateRefreshToken(): Promise<any> {
    return tokenStorage.getTokens()
      .then(tokens => {
        const postParams = {
          refresh_token: tokens.refreshToken,
          grant_type: "refresh_token",
        };

        return fetch(`${ config.api.host }/oauth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${ config.api.clientAuth }`
          },
          body: formUrlencoded(postParams)
        })
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
        if (data["error"] === "invalid_token" && data["error_description"].match(tokenExpired)) {
          throw new Error(REQUEST_TOKEN_EXPIRED);
        }
      });
    }

    throw new Error(REQUEST_ERROR);
  }

  private _authenticatedRequest(): Promise<any> {
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
