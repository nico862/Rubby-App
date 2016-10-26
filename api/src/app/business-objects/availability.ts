import * as moment from "moment";

export interface AvailabilityParams {
  urn: string;
  therapistUrn: string;
  timeStarts: moment.Moment;
  timeEnds: moment.Moment;
}

export class Availability {
  urn: string;
  therapistUrn: string;
  timeStarts: moment.Moment;
  timeEnds: moment.Moment;

  constructor(params: AvailabilityParams) {
    for (let key in params) {
      this[key] = params[key];
    }
  }

  toJSON() {
    return {
      "@id": this.urn,
      therapistUrn: this.therapistUrn,
      timeStarts: this.timeStarts.toISOString(),
      timeEnds: this.timeEnds.toISOString(),
    };
  }
}
