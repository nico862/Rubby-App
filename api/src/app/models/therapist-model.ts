import { salonService, therapistService } from "../services";
import { Therapist, Salon } from "../business-objects";

export interface SalonTherapist {
  salon: Salon;
  therapist: Therapist;
}

function mapSalonAndTherapistData (therapist: Therapist): Promise<SalonTherapist> {
  return salonService.getSalonForTherapist(therapist.urn)
    .then(salon => {
      return {salon, therapist};
    });
}

export function salonAndTherapist(therapistUrn: string): Promise<SalonTherapist> {
  return therapistService.findTherapistByUrn(therapistUrn)
    .then(mapSalonAndTherapistData);
}
