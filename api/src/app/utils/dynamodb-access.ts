import * as AWS from "aws-sdk";

import config from "../config";

interface AwsClientConfig extends AWS.ClientConfigPartial {
  endpoint?: string;
}

const awsConfig: AwsClientConfig = {
  region: "eu-west-1",
};

if (config.dynamoDB.endpoint) {
  awsConfig.endpoint = config.dynamoDB.endpoint;
}

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Puts item into DynamoDB
 * @param  {AWS.DynamoDB.PutParam} params Parameters for put operation
 * @return {Promise<any>}                 Promise that resolves to the data returned by the put operation
 */
export function put(params: AWS.DynamoDB.PutParam): Promise<any> {
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

/**
 * Gets item from DynamoDB
 * @param  {AWS.DynamoDB.GetParam} params Parameters for get operation
 * @return {Promise<any>}                 Promise that resolves to the data returned by the get operation
 */
export function get(params: AWS.DynamoDB.GetParam): Promise<any> {
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data.Item);
    });
  });
}

/**
 * Updates item in DynamoDB
 * @param  {AWS.DynamoDB.GetParam} params Parameters for update operation
 * @return {Promise<any>}                 Promise that resolves to the data returned by the update operation
 */
export function update(params: AWS.DynamoDB.UpdateParam): Promise<any> {
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data.Item);
    });
  });
}
