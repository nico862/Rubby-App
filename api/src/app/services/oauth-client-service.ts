import * as AWS from "aws-sdk";
import * as bcrypt from "bcrypt";

import * as dynamoDb from "../utils/dynamodb-access";
import { ResourceNotFound } from "../errors";

const CLIENT_NOT_FOUND = "CLIENT_NOT_FOUND";

const table = "RuubyPAOauthClients";

function getClientById(clientId: string, clientSecret?: string): Promise<any> {
  const params: AWS.DynamoDB.GetParam = {
    TableName: table,
    Key: {
      id: clientId
    }
  };

  return dynamoDb.get(params)
    .then(data => {
      if (!data) {
        throw new ResourceNotFound(CLIENT_NOT_FOUND);
      }

      if (!clientSecret) {
        return {id: data["id"]};
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(clientSecret, data.secret, (err, res) => {
          if (res) {
            resolve({
              id: data["id"],
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
  getClientById,
  CLIENT_NOT_FOUND
};
