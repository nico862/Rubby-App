import * as axios from "axios";
import * as url from "url";
import * as moment from "moment";

import {logger} from "../logger";
import config from "../config";
import { Booking, BookingParams } from "../business-objects";

export interface BookingSearchOptions {
  start: moment.Moment;
  end: moment.Moment;
}

function fetchBookingsForTherapist(therapistUrn: string, options?: BookingSearchOptions): Promise<Booking[]> {
  // get bookings for all salons fetched
  return new Promise((resolve, reject) => {
    const reqUrl = url.parse(`${config.bookingsApi.endpoint}/bookings`);
    reqUrl.query = {therapistUrn};

    if (options) {
      if (options.start && options.end) {
        reqUrl.query.overlaps = `${options.start.toISOString()} TO ${options.end.toISOString()}`;
      }
    }

    logger.debug(`Fetching URL: ${url.format(reqUrl)}`);

    axios.get(url.format(reqUrl))
      .then(function (response: any) {
        resolve(response.data.map(mapToBooking));
      })
      .catch(function (error: Error) {
        reject(error);
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
  fetchBookingsForTherapist
};
