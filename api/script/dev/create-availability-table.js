const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8010"
});

const dynamodb = new AWS.DynamoDB();

createTable({
    TableName : "TherapistAvailability",
    KeySchema: [
        {
            AttributeName: "therapistUrn",
            KeyType: "HASH"
        },
        {
            AttributeName: "timeStarts",
            KeyType: "RANGE"
        },
    ],
    AttributeDefinitions: [
        {
            AttributeName: "therapistUrn",
            AttributeType: "S"
        },
        {
            AttributeName: "timeStarts",
            AttributeType: "S"
        },
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
