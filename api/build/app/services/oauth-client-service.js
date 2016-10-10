"use strict";
const bcrypt = require("bcrypt");
const dynamoDb = require("../utils/dynamodb-access");
const errors_1 = require("../errors");
const CLIENT_NOT_FOUND = "CLIENT_NOT_FOUND";
const table = "RuubyPAOauthClients";
const tokenExpiryDays = 1;
function getClient(clientUrn, clientSecret) {
    const params = {
        TableName: table,
        Key: {
            id: clientUrn
        }
    };
    return dynamoDb.get(params)
        .then((data) => {
        if (!data) {
            throw new errors_1.ResourceNotFound(CLIENT_NOT_FOUND);
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(clientSecret, data.secret, (err, res) => {
                if (res) {
                    resolve({
                        clientId: data.id,
                    });
                }
                else {
                    reject(new errors_1.ResourceNotFound(CLIENT_NOT_FOUND));
                }
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    getClient: getClient,
    CLIENT_NOT_FOUND: CLIENT_NOT_FOUND
};

//# sourceMappingURL=oauth-client-service.js.map
