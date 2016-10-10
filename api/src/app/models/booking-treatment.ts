import * as moment from "moment";
import { Treatment, Therapist } from "./index";

export interface BookingTreatmentParams {
  id: string;
  urn: string;
  bookingId: string;
  treatmentUrn: string;
  treatment?: Treatment;
  therapistUrn: string;
  therapist?: Therapist;
  timeCreated: moment.Moment;
  timeUpdated: moment.Moment;
}

export class BookingTreatment {
  id: string;
  urn: string;
  bookingId: string;
  treatmentUrn: string;
  treatment: Treatment;
  therapistUrn: string;
  therapist: Therapist;
  timeCreated: moment.Moment;
  timeUpdated: moment.Moment;

  constructor(params: BookingTreatmentParams) {
    for (let key in params) {
      this[key] = params[key];
    }
  }

  toJSON() {
    return {
      "@id": this.urn,
      bookingId: this.bookingId,
      treatmentUrn: this.treatmentUrn,
      therapistUrn: this.therapistUrn,
      therapist: this.therapist,
      timeCreated: this.timeCreated,
      timeUpdated: this.timeUpdated,
      treatment: this.treatment
    };
  }

}
