import { convert, extractId } from "../utils/urn";
import { Salon, SalonParams, Therapist, TherapistParams, Availability, AvailabilityParams } from "../business-objects";
import * as moment from "moment";

export function mapRowToTherapist(salonId: string, row: any): Therapist {
  const params: TherapistParams = {
    urn: convert("therapist", [salonId, row.workstation_id]),
    name: row.workstation_name
  };
  return new Therapist(params);
}

export function mapRowToSalon(row: any): Salon {
  const params: SalonParams = {
    urn: convert("salon", [row.salon_unique_id]),
    name: row.salon_name,
    isMobile: row.salon_mobile === 1
  };

  return new Salon(params);
}

export function mapRowToAvailability(row: any): Availability {
  const urnParts = extractId("therapist", row["therapistUrn"]);

  const params: AvailabilityParams = {
    urn: convert("availability", [...urnParts, row["timeStarts"]]),
    therapistUrn: row["therapistUrn"],
    timeStarts: moment(row["timeStarts"]),
    timeEnds: moment(row["timeEnds"]),
  };

  return new Availability(params);
}
