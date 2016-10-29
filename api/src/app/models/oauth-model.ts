import * as jwt from "jsonwebtoken";
import * as moment from "moment";

import config from "../config";
import { userService, oAuthClientService, oAuthRefreshTokenService, salonService, therapistService } from "../services";
import { User } from "../business-objects";
import { SalonTherapist } from "./therapist-model";

const secretKey = config.jwt.tokenSecret;

export interface UserSalonTherapist extends SalonTherapist {
  user: User;
}

export default class OAuthModel {
  getAccessToken (accessToken: string): any {
    const user = jwt.verify(accessToken, secretKey, {
        ignoreExpiration: true // handled below
    });

    // expires is in the token and is in epoch seconds
    // moment requires milliseconds
    const accessTokenExpiresAt = moment(user.exp * 1000).toDate();

    return {accessToken, user, accessTokenExpiresAt};
  };

  getRefreshToken(refreshToken: string): Promise<any> {
    return oAuthRefreshTokenService.getToken(refreshToken)
      .then(data => {
        const refreshTokenExpiresAt = data.expires.toDate();

        const promises: [Promise<User>, Promise<any>] = [
          userService.fetchUserByUrn(data.userUrn),
          oAuthClientService.getClientById(data.clientId)
        ];

        return Promise.all(promises)
          .then(results => {
            const [userOnly, client] = results;

            return mapUserSalonAndTherapist(userOnly)
              .then(user => {
                return { refreshTokenExpiresAt, client, user, refreshToken };
              });
          });
      });
  }

  revokeToken(refreshToken: any): Promise<any> {
    const expires = moment().subtract(1, "hours");

    return oAuthRefreshTokenService.revokeToken(refreshToken.refreshToken, expires)
      .then(() => {
        return {
          refreshTokenExpiresAt: expires.toDate()
        };
      });
  }

  saveAuthorizationCode(authorizationCode: any): any {
    return {authorizationCode};
  }

  saveToken (tokenObject: any, client: any, user: UserSalonTherapist): any {
    // get expiry time as seconds
    const expiresIn = moment(tokenObject.accessTokenExpiresAt).diff(moment(), "seconds");

    // Use JWT for access tokens
    const accessToken = jwt.sign(user, secretKey, {expiresIn});

    // save refresh token
    return oAuthRefreshTokenService.saveToken(
      tokenObject.refreshToken,
      client.id,
      user.user.urn,
      moment(tokenObject.refreshTokenExpiresAt)
    )
      .then(() => {
        return {
          accessToken,
          accessTokenExpiresAt: tokenObject.accessTokenExpiresAt,
          refreshToken: tokenObject.refreshToken,
          refreshTokenExpiresAt: tokenObject.refreshTokenExpiresAt,
          client,
          user
        };
      });
  }

  validateScope(user: any, client: any, scope: any): any {
    return true;
  }

  getClient (id: string, clientSecret: string): Promise<any> {
    return oAuthClientService.getClientById(id, clientSecret)
      .then(client => {
        return {
          id,
          grants: ["authorization_code", "password", "refresh_token"]
        };
      })
      .catch(console.log);
  };

  getUser (username: string, password: string): Promise<UserSalonTherapist> {
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
