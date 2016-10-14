import * as AWS from "aws-sdk";
import * as moment from "moment";

import * as dynamoDb from "../utils/dynamodb-access";
import { Availability } from "../business-objects";
import { mapRowToAvailability } from "../services/model-helper";
import { convert, extractId } from "../utils/urn";

// export const UPDATE_DELETE_FAILED = "UPDATE_DELETE_FAILED";
// export const UPDATE_PUT_FAILED = "UPDATE_PUT_FAILED";

const table = "TherapistAvailability";

function getAvailableTimesForDay(therapistUrn: any, day: moment.Moment): Promise<Availability[]> {
  const params: AWS.DynamoDB.QueryParam = {
    TableName: table,
    KeyConditionExpression: "therapistUrn = :therapistUrn and begins_with(timeStarts, :date)",
    ExpressionAttributeValues: {
      ":therapistUrn": therapistUrn,
      ":date": day.format("YYYY-MM-DD"),
    }
  };

  return dynamoDb.query(params)
    .then(data => data.map(mapRowToAvailability));
}

function createAvailability(availability: Availability): Promise<Availability> {
  const params: AWS.DynamoDB.PutParam = {
    TableName: table,
    Item: {
      therapistUrn: availability.therapistUrn,
      timeStarts: availability.timeStarts.toISOString(),
      timeEnds: availability.timeEnds.toISOString(),
    }
  };

  return dynamoDb.put(params).then(() => {
    return availability;
  });
}

function deleteAvailability(availabilityUrn: string): Promise<any> {
  // urnParts[0] = salon id
  // urnParts[1] = workstation id
  // urnParts[2...] = parts of datetime
  const urnParts = extractId("availability", availabilityUrn);

  const params: AWS.DynamoDB.DeleteParam = {
    TableName: table,
    Key: {
      therapistUrn: convert("therapist", urnParts.slice(0, 2)),
      timeStarts: urnParts.slice(2).join("-"),
    }
  };

  return dynamoDb.deleteItem(params);
}

export default {
  getAvailableTimesForDay,
  createAvailability,
  deleteAvailability,
};
