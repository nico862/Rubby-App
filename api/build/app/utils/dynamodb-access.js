"use strict";
const AWS = require("aws-sdk");
const config_1 = require("../config");
const awsConfig = {
    region: "eu-west-1",
};
if (config_1.default.dynamoDB.endpoint) {
    awsConfig.endpoint = config_1.default.dynamoDB.endpoint;
}
AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();
/**
 * Puts item into DynamoDB
 * @param  {AWS.DynamoDB.PutParam} params Parameters for put operation
 * @return {Promise<any>}                 Promise that resolves to the data returned by the put operation
 */
function put(params) {
    return new Promise((resolve, reject) => {
        docClient.put(params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
exports.put = put;
/**
 * Gets item from DynamoDB
 * @param  {AWS.DynamoDB.GetParam} params Parameters for get operation
 * @return {Promise<any>}                 Promise that resolves to the data returned by the get operation
 */
function get(params) {
    return new Promise((resolve, reject) => {
        docClient.get(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.Item);
        });
    });
}
exports.get = get;
/**
 * Updates item in DynamoDB
 * @param  {AWS.DynamoDB.GetParam} params Parameters for update operation
 * @return {Promise<any>}                 Promise that resolves to the data returned by the update operation
 */
function update(params) {
    return new Promise((resolve, reject) => {
        docClient.update(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.Item);
        });
    });
}
exports.update = update;

//# sourceMappingURL=dynamodb-access.js.map
