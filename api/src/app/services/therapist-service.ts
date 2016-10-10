import * as express from "express";
import * as squel from "squel";

import config from "../config";
import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { ResourceNotFound } from "../errors";
import { Therapist, TherapistParams } from "../models";

const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

function fetchTherapistsByUrns(salonUrn: string, urns: string[]): Promise<Therapist[]> {
  const ids = urns.map(extractId);
  const salonId = extractId(salonUrn);

  const query = squel.select(squelSelectOptions)
      .from(`salon_${salonId}.salon_workstations`)
      .where("workstation_id IN ?", ids);
    return db.doSelect(query).then((rows: any) => {
      return rows.map((data: any) => mapRowToTherapist(salonId, data));
    });
}

function mapRowToTherapist(salonId: string, row: any): Therapist {
  const params: TherapistParams = {
    urn: convert("therapist", row.workstation_id, salonId),
    name: row.workstation_name
  };
  return new Therapist(params);
}

export default {
  fetchTherapistsByUrns
};
