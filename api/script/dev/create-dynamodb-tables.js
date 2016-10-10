const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8010"
});

const dynamodb = new AWS.DynamoDB();

createTable({
    TableName : "RuubyPAOauthClients",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
});

createTable({
    TableName : "RuubyPAOauthRefreshTokens",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
});

function createTable (params) {
    dynamodb.createTable(params, (err, data) => {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}