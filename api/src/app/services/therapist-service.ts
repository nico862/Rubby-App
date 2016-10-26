import * as squel from "squel";

import { extractId } from "../utils/urn";
import * as db from "../database";
import { Therapist } from "../business-objects";
import { mapRowToTherapist } from "./model-helper";

const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

function findTherapistByUrn(therapistUrn: string): Promise<Therapist> {
  const [salonId, workstationId] = extractId("therapist", therapistUrn);

  const query = squel.select(squelSelectOptions)
    .from(`salon_${salonId}.salon_workstations`)
    .where("workstation_id = ?", workstationId);

  return db.doSelect(query).then((rows: any) => {
    return mapRowToTherapist(salonId, rows[0]);
  });
}

function fetchTherapistsByUrns(salonUrn: string, urns: string[]): Promise<Therapist[]> {
  const ids = urns.map(extractId.bind(null, ["therapist"])).map(arr => arr[1]);
  const salonId = extractId("salon", salonUrn)[0];

  const query = squel.select(squelSelectOptions)
      .from(`salon_${salonId}.salon_workstations`)
      .where("workstation_id IN ?", ids);

  return db.doSelect(query).then((rows: any) => {
    return rows.map((data: any) => mapRowToTherapist(salonId, data));
  });
}

function findTherapistsForSalon(urn: string): Promise<Therapist[]> {
  const salonId = extractId("salon", urn)[0];

  const query = squel.select(db.squelSelectOptions)
      .from(`salon_${salonId}.salon_workstations`)
      .where("workstation_active = ?", 1);

  return db.doSelect(query).then((rows: any) => {
    return rows.map((data: any) => mapRowToTherapist(salonId, data));
  });
}

export default {
  fetchTherapistsByUrns,
  findTherapistsForSalon,
  findTherapistByUrn,
};
