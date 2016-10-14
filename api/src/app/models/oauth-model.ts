import * as jwt from "jsonwebtoken";
import * as moment from "moment";

import config from "../config";
import { userService, oAuthClientService, oAuthRefreshTokenService, salonService, therapistService } from "../services";
import { User } from "../business-objects";
import { SalonTherapist } from "./therapist-model";

const secretKey = config.jwt.tokenSecret;
const accessTokenExpiresDuration = moment.duration(config.jwt.expires);
const refreshTokenExpiresDuration = moment.duration(config.jwt.expires).add(3600, "seconds");

export interface UserSalonTherapist extends SalonTherapist {
  user: User;
}

export default class OAuthModel {
  accessTokenLifetime = moment().add(accessTokenExpiresDuration).toDate();

  getAccessToken (accessToken: string): any {
    console.log("in getAccessToken (bearerToken: " + accessToken + ")");

    const user = jwt.verify(accessToken, secretKey, {
        ignoreExpiration: true // handled by OAuth2 server implementation
    });

    return {accessToken, user};
  };

  saveAuthorizationCode(authorizationCode: any): any {
    return {authorizationCode};
  }

  saveToken (tokenObject: any, client: any, user: UserSalonTherapist): any {
    // Use JWT for access tokens
    const accessToken = jwt.sign(user, secretKey, {
      expiresIn: accessTokenExpiresDuration.asSeconds(),
    });

    // save refresh token
    return oAuthRefreshTokenService.saveToken(tokenObject.refreshToken, client.id, user.user.urn, moment().add(refreshTokenExpiresDuration))
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
      .catch(console.log);
  };

  getUser (username: string, password: string): Promise<UserSalonTherapist> {
    console.log("in getUser (username: " + username +
                ", password: " + password + ")");

    return userService.findUserByEmailAndPassword(username, password)
      .then(mapUserSalonAndTherapist)
      .catch(console.log);
  };
}

function mapUserSalonAndTherapist(user: User): Promise<UserSalonTherapist> {
  return salonService.findSalonsForUser(user.urn)
    .then(salons => {
      return therapistService.findTherapistsForSalon(salons[0].urn)
        .then(therapists => {
        return {
          user,
          salon: salons[0],
          therapist: therapists[0]
        };
      });
    });
}
