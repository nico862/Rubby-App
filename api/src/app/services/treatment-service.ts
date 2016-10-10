import * as express from "express";
import * as squel from "squel";

import config from "../config";
import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { ResourceNotFound } from "../errors";
import { Treatment, TreatmentParams } from "../models";

const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

function fetchTreatmentsByUrns(salonUrn: string, urns: string[]): Promise<Treatment[]> {
  const ids = urns.map(extractId);
  const salonId = extractId(salonUrn);
  const query = squel.select(squelSelectOptions)
      .from(`salon_${salonId}.salon_services`)
      .where("service_id IN ?", ids);
    return db.doSelect(query).then((rows: any) => {
      return rows.map((data: any) => mapRowToTreatment(salonId, data));
    });
}

function mapRowToTreatment(salonId: string, row: any): Treatment {
  const params: TreatmentParams = {
    urn: convert("treatment", row.service_id, salonId),
    name: row.service_name,
    price: row.service_price
  };

  return new Treatment(params);
}

export default {
  fetchTreatmentsByUrns
};
