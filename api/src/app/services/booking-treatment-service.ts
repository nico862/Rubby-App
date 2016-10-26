import * as axios from "axios";

import config from "../config";
import { Booking, BookingTreatment, BookingTreatmentParams } from "../business-objects";
import { extractId } from "../utils/urn";

function fetchBookingTreatments(booking: Booking): Promise<any> {
  return new Promise((resolve, reject) => {
    axios.get(`${config.bookingsApi.endpoint}/bookings/${booking.urn}/booking-treatments`)
      .then(function (response: any) {
        resolve(response.data.map(mapToBookingTreatment));
      })
      .catch(function (error: Error) {
        reject(error);
      });
  });
}

function mapToBookingTreatment(data: any): BookingTreatment {
  const params: BookingTreatmentParams = {
    id: extractId("booking-treatment", data["@id"])[0],
    urn: data["@id"],
    bookingId: data.bookingId,
    treatmentUrn: data.treatmentUrn,
    therapistUrn: data.therapistUrn,
    timeCreated: data.timeCreated,
    timeUpdated: data.timeUpdated
  };

  return new BookingTreatment(params);
}

export default {
  fetchBookingTreatments
};
