import * as AWS from "aws-sdk";
import * as moment from "moment";
import * as oauthServer from "oauth2-server";

import * as dynamoDb from "../utils/dynamodb-access";
import { ResourceNotFound } from "../errors";

const REFRESH_TOKEN_NOT_FOUND = "REFRESH_TOKEN_NOT_FOUND";

const table = "RuubyPAOauthRefreshTokens";

function getToken(token: string): Promise<oauthServer.RefreshToken> {
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
        clientId: data.clientUrn,
        userId: data.userUrn,
        expires: moment(data.expires).toDate()
      };
    });
}

function saveToken(token: string, clientUrn: string, userUrn: string, expires: moment.Moment): Promise<boolean> {
  const params: AWS.DynamoDB.PutParam = {
    TableName: table,
    Item: {
      id: token,
      clientUrn,
      userUrn,
      expires: expires.toISOString(),
    }
  };

  return dynamoDb.put(params)
    .then((data) => {
      return true;
    });
}

export default {
  getToken,
  saveToken,
  REFRESH_TOKEN_NOT_FOUND
};
