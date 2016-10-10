import * as moment from "moment";
import {Customer, Address, Salon, BookingTreatment } from "./index";

export interface BookingParams {
  urn: string;
  timeStarts: moment.Moment;
  timeEnds: moment.Moment;
  salonUrn: string;
  salon?: Salon;
  customerUrn: string;
  customer?: Customer;
  addressUrn: string;
  address?: Address;
  notes: string;
  status: string;
  timeCreated: moment.Moment;
  timeUpdated: moment.Moment;
}

export class Booking {
  urn: string;
  timeStarts: moment.Moment;
  timeEnds: moment.Moment;
  salonUrn: string;
  salon: Salon;
  customerUrn: string;
  customer: Customer;
  addressUrn: string;
  address: Address;
  bookingTreatments: BookingTreatment[];
  notes: string;
  status: string;
  timeCreated: moment.Moment;
  timeUpdated: moment.Moment;

  constructor(params: BookingParams) {
    for (let key in params) {
      this[key] = params[key];
    }
  }

  toJSON() {
    return {
      "@id": this.urn,
      timeStarts: this.timeStarts,
      timeEnds: this.timeEnds,
      customerUrn: this.customerUrn,
      salonUrn: this.salonUrn,
      addressUrn: this.addressUrn,
      bookingTreatments: this.bookingTreatments,
      notes: this.notes,
      status: this.status,
      timeCreated: this.timeCreated,
      timeUpdated: this.timeUpdated,
      salon: this.salon,
      customer: this.customer,
      address: this.address
    };
  }

}
