const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8010"
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// member id in ruuby 'db\members_salons' - 447
var params = {
    TableName: 'TherapistAvailability',
    Item: {
        therapistUrn: 'urn:ruuby:therapist:315942482-4',
        timeStarts:   '2016-10-28T10:00:00.000Z',
        timeEnds:     '2016-10-28T11:00:00.000Z'
    }
};

docClient.put(params, function(err, data) {
  if (err) {
    console.log(`Could not create therapist availability: ${err}`);
  }

  console.log(`Therapist availability created: ${data}`);
});


var params = {
    TableName: 'TherapistAvailability',
    Item: {
        therapistUrn: 'urn:ruuby:therapist:315942482-4',
        timeStarts:   '2016-10-28T13:00:00.000Z',
        timeEnds:     '2016-10-28T13:45:00.000Z'
    }
};

docClient.put(params, function(err, data) {
  if (err) {
    console.log(`Could not create therapist availability: ${err}`);
  }

  console.log(`Therapist availability created: ${data}`);
});
