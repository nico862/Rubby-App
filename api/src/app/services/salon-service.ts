import * as express from "express";
import * as squel from "squel";

import config from "../config";
import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { ResourceNotFound } from "../errors";
import { Salon, SalonParams } from "../models";

const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

function fetchSalonsByUrns(urns: string[]): Promise<Salon[]> {
  if (urns.length === 0) {
    return Promise.resolve([]);
  }
  const ids = urns.map(extractId);

  const query = squel.select(squelSelectOptions)
      .from("members_salons")
      .where("salon_unique_id IN ?", ids);

    return db.doSelect(query).then((rows: any) => {
      return rows.map(mapRowToSalon);
    });
}

function mapRowToSalon(row: any): Salon {
  const params: SalonParams = {
    urn: convert("salon", row.salon_unique_id),
    name: row.salon_name,
    isMobile: row.salon_mobile === 1
  };

  return new Salon(params);
}

export default {
  fetchSalonsByUrns
};
