"use strict";
const moment = require("moment");
const dynamoDb = require("../utils/dynamodb-access");
const errors_1 = require("../errors");
const REFRESH_TOKEN_NOT_FOUND = "REFRESH_TOKEN_NOT_FOUND";
const table = "RuubyPAOauthRefreshTokens";
const tokenExpiryDays = 1;
function getToken(token) {
    const params = {
        TableName: table,
        Key: {
            id: token
        }
    };
    return dynamoDb.get(params)
        .then((data) => {
        if (!data) {
            throw new errors_1.ResourceNotFound(REFRESH_TOKEN_NOT_FOUND);
        }
        return {
            clientId: data.clientUrn,
            userId: data.userUrn,
            expires: moment(data.expires).toDate()
        };
    });
}
function saveToken(token, clientUrn, userUrn, expires) {
    const params = {
        TableName: table,
        Item: {
            id: token,
            clientUrn: clientUrn,
            userUrn: userUrn,
            expires: expires.toISOString(),
        }
    };
    return dynamoDb.put(params)
        .then((data) => {
        return true;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getToken: getToken,
    saveToken: saveToken,
    REFRESH_TOKEN_NOT_FOUND: REFRESH_TOKEN_NOT_FOUND
};

//# sourceMappingURL=oauth-refresh-token-service.js.map
