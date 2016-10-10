const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8010"
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const secret = bcrypt.hashSync("6468dd5c-8590-11e6-ae22-56b6b6499611", 2);

const clientParams = {
    TableName: "RuubyPAOauthClients",
    Item: {
        id: "ruubyPAMobileApp",
        secret
    }
};

docClient.put(clientParams, (err, data) => {
  if (err) {
    console.log(`Could not create client: ${err}`);
  }

  console.log(`Client created: ${data}`);
});
