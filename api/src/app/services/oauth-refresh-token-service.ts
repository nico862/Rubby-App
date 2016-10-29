import * as AWS from "aws-sdk";
import * as moment from "moment";

import * as dynamoDb from "../utils/dynamodb-access";
import { ResourceNotFound } from "../errors";

const REFRESH_TOKEN_NOT_FOUND = "REFRESH_TOKEN_NOT_FOUND";

const table = "RuubyPAOauthRefreshTokens";

function getToken(token: string): Promise<any> {
  const params: AWS.DynamoDB.GetParam = {
    TableName: table,
    Key: {
      id: token
    }
  };

  return dynamoDb.get(params)
    .then((data) => {
      if (!data) {
        throw new ResourceNotFound(REFRESH_TOKEN_NOT_FOUND);
      }

      return {
        clientId: data.clientId,
        userUrn: data.userUrn,
        expires: moment(data.expires)
      };
    });
}

function saveToken(token: string, clientId: string, userUrn: string, expires: moment.Moment): Promise<boolean> {
  const params: AWS.DynamoDB.PutParam = {
    TableName: table,
    Item: {
      id: token,
      clientId,
      userUrn,
      expires: expires.toISOString(),
    }
  };

  return dynamoDb.put(params)
    .then(data => {
      return true;
    });
}

function revokeToken(token: string, expires: moment.Moment) {
  const params: AWS.DynamoDB.UpdateParam = {
    TableName: table,
    Key: {
      id: token,
    },
    AttributeUpdates: {
      expires: {
        Action: "PUT",
        Value: expires.toISOString(),
      }
    },
  };

  return dynamoDb.deleteItem(params)
    .then(data => {
      return true;
    });
}

export default {
  getToken,
  saveToken,
  revokeToken,
  REFRESH_TOKEN_NOT_FOUND
};
