import * as AWS from "aws-sdk";
import * as uuid from "node-uuid";
import * as moment from "moment";
import * as oauthServer from "oauth2-server";
import * as bcrypt from "bcrypt";

import * as dynamoDb from "../utils/dynamodb-access";
import { ResourceNotFound } from "../errors";

const CLIENT_NOT_FOUND = "CLIENT_NOT_FOUND";

const table = "RuubyPAOauthClients";
const tokenExpiryDays = 1;

function getClient(clientUrn: string, clientSecret: string): Promise<oauthServer.Client> {
  const params: AWS.DynamoDB.GetParam = {
    TableName: table,
    Key: {
      id: clientUrn
    }
  };

  return dynamoDb.get(params)
    .then((data) => {
      if (!data) {
        throw new ResourceNotFound(CLIENT_NOT_FOUND);
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(clientSecret, data.secret, (err, res) => {
          if (res) {
            resolve({
              clientId: data.id,
            });
          }
          else {
            reject(new ResourceNotFound(CLIENT_NOT_FOUND));
          }
        });
      });
    });
}

export default {
  getClient,
  CLIENT_NOT_FOUND
};
