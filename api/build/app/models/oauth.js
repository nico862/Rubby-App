"use strict";
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config_1 = require("../config");
const services_1 = require("../services");
const secretKey = config_1.default.jwt.tokenSecret;
const accessTokenExpiresDuration = moment.duration(config_1.default.jwt.expires);
const refreshTokenExpiresDuration = moment.duration(config_1.default.jwt.expires).add(3600, "seconds");
class OAuthModel {
    constructor() {
        this.accessTokenLifetime = moment().add(accessTokenExpiresDuration).toDate();
    }
    getAccessToken(bearerToken) {
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
    }
    ;
    saveAuthorizationCode(authorizationCode) {
        return { authorizationCode: authorizationCode };
    }
    saveToken(tokenObject, client, user) {
        // Use JWT for access tokens
        const accessToken = jwt.sign({
            user: user.id
        }, secretKey, {
            expiresIn: accessTokenExpiresDuration.asSeconds(),
        });
        // save refresh token
        return services_1.oAuthRefreshTokenService.saveToken(tokenObject.refreshToken, client.id, user.id, moment().add(refreshTokenExpiresDuration))
            .then(() => {
            return {
                accessToken: accessToken,
                accessTokenExpiresAt: this.accessTokenLifetime,
                refreshToken: tokenObject.refreshToken,
                client: client,
                user: user
            };
        });
    }
    validateScope(user, client, scope) {
        return true;
    }
    getClient(clientId, clientSecret) {
        console.log("in getClient (clientId: " + clientId +
            ", clientSecret: " + clientSecret + ")");
        return services_1.oAuthClientService.getClient(clientId, clientSecret)
            .then(client => {
            return {
                grants: ["authorization_code", "password"]
            };
        })
            .catch((err) => {
            return;
        });
    }
    ;
    getUser(username, password) {
        console.log("in getUser (username: " + username +
            ", password: " + password + ")");
        return services_1.userService.findUserByEmailAndPassword(username, password)
            .then((user) => {
            console.log("User id: " + user.id);
            return user;
        })
            .catch((err) => {
            return;
        });
    }
    ;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OAuthModel;

//# sourceMappingURL=oauth.js.map
