import * as express from "express";
import * as axios from "axios";
import * as squel from "squel";
import * as url from "url";
import * as moment from "moment";

import config from "../config";
import { extractId, convert } from "../utils/urn";
import { Booking, BookingParams } from "../models";
import * as db from "../database";

export interface BookingSearchOptions {
  start: moment.Moment;
  end: moment.Moment;
}

function fetchBookingsForUser(userUrn: string, options?: BookingSearchOptions): Promise<any> {
  const userId = extractId(userUrn);

  // get salons for user
  const query = squel.select(db.squelSelectOptions)
      .from("members_salons")
      .where("member_id = ?", userId);

  return db.doSelect(query)
    .then((rows: any) => {
      return rows.map((row: any) => row.salon_unique_id);
    })
    .then((salonIds) => {
      // get bookings for all salons fetched
      return new Promise((resolve, reject) => {
        const reqUrl = url.parse(`${config.bookingsApi.endpoint}/bookings`);
        reqUrl.query = {salonUrn: salonIds.map((id: string) => convert("salon", id))};

        if (options) {
          if (options.start && options.end) {
            reqUrl.query.overlaps = `${options.start.toISOString()} TO ${options.end.toISOString()}`;
          }
        }

        axios.get(url.format(reqUrl))
          .then(function (response: any) {
            resolve(response.data.map(mapToBooking));
          })
          .catch(function (error: Error) {
            reject(error);
          });
      });
  });
}

function mapToBooking(data: any): Booking {
 const params: BookingParams = {
    urn: data["@id"],
    timeStarts: moment(data.timeStarts),
    timeEnds: moment(data.timeEnds),
    salonUrn: data.salonUrn,
    addressUrn: data.addressUrn,
    customerUrn: data.customerUrn,
    notes: data.notes,
    status: data.status,
    timeCreated: data.timeCreated,
    timeUpdated: data.timeUpdated
  };

  return new Booking(params);
}

export default {
  fetchBookingsForUser
};
