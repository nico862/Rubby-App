import * as squel from "squel";

import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { Salon } from "../business-objects";
import { mapRowToSalon } from "./model-helper";

function fetchSalonsByUrns(urns: string[]): Promise<Salon[]> {
  if (urns.length === 0) {
    return Promise.resolve([]);
  }

  const ids = urns.map(extractId.bind(null, ["salon"])).map(arr => arr[0]);

  const query = squel.select(db.squelSelectOptions)
      .from("members_salons")
      .where("salon_unique_id IN ?", ids);

  return db.doSelect(query).then((rows: any) => {
    return rows.map(mapRowToSalon);
  });
}

function findSalonsForUser(urn: string): Promise<Salon[]> {
  const id = extractId("user", urn)[0];

  const query = squel.select(db.squelSelectOptions)
    .from("members_salons")
    .where("member_id = ?", id);

  return db.doSelect(query).then((rows: any[]) => {
    return rows.map(row => {
      return new Salon({
        urn: convert("salon", [row["salon_unique_id"]]),
        name: row["salon_name"],
        isMobile: (row["is_mobile_salon"] === 1)
      });
    });
  });
}

function getSalonForTherapist(therapistUrn: string) {
  const salonId = extractId("therapist", therapistUrn)[0];

  const query = squel.select(db.squelSelectOptions)
      .from("members_salons")
      .where("salon_unique_id = ?", salonId);

  return db.doSelect(query).then((rows: any) => {
    return mapRowToSalon(rows[0]);
  });
}

export default {
  fetchSalonsByUrns,
  findSalonsForUser,
  getSalonForTherapist,
};
