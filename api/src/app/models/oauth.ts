import * as jwt from "jsonwebtoken";
import * as express from "express";
import * as moment from "moment";

import config from "../config";
import { userService, oAuthClientService, oAuthRefreshTokenService } from "../services";

const secretKey = config.jwt.tokenSecret;
const accessTokenExpiresDuration = moment.duration(config.jwt.expires);
const refreshTokenExpiresDuration = moment.duration(config.jwt.expires).add(3600, "seconds");

export default class OAuthModel {
  accessTokenLifetime = moment().add(accessTokenExpiresDuration).toDate();

  getAccessToken (bearerToken: string): any {
    console.log("in getAccessToken (bearerToken: " + bearerToken + ")");

    const decoded = jwt.verify(bearerToken, secretKey, {
        ignoreExpiration: true // handled by OAuth2 server implementation
    });

    return {
      accessToken: bearerToken,
      user: {
        id: decoded.user
      },
    };
  };

  saveAuthorizationCode(authorizationCode: any): any {
    return {authorizationCode};
  }

  saveToken (tokenObject: any, client: any, user: any): any {
    // Use JWT for access tokens
    const accessToken = jwt.sign({
      user: user.id
    }, secretKey, {
      expiresIn: accessTokenExpiresDuration.asSeconds(),
    });

    // save refresh token
    return oAuthRefreshTokenService.saveToken(tokenObject.refreshToken, client.id, user.id, moment().add(refreshTokenExpiresDuration))
      .then(() => {
        return {
          accessToken: accessToken,
          accessTokenExpiresAt: this.accessTokenLifetime,
          refreshToken: tokenObject.refreshToken,
          client,
          user
        };
      });
  }

  validateScope(user: any, client: any, scope: any): any {
    return true;
  }

  getClient (clientId: string, clientSecret: string): Promise<any> {
    console.log("in getClient (clientId: " + clientId +
                ", clientSecret: " + clientSecret + ")");

    return oAuthClientService.getClient(clientId, clientSecret)
      .then(client => {
        return {
          grants: ["authorization_code", "password"]
        };
      })
      .catch((err) => {
        return;
      });
  };

  getUser (username: string, password: string): Promise<any> {
    console.log("in getUser (username: " + username +
                ", password: " + password + ")");

    return userService.findUserByEmailAndPassword(username, password)
      .then((user) => {
        console.log("User id: " + user.id);
        return user;
      })
      .catch((err: Error) => {
        return;
      });
  };
}
