import * as squel from "squel";

import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { Treatment, TreatmentParams } from "../business-objects";

const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

function fetchTreatmentsByUrns(salonUrn: string, urns: string[]): Promise<Treatment[]> {
  const ids = urns.map(extractId.bind(null, ["treatment"])).map(arr => arr[1]);
  const salonId = extractId("salon", salonUrn)[0];

  const query = squel.select(squelSelectOptions)
    .from(`salon_${salonId}.salon_services`)
    .where("service_id IN ?", ids);

  return db.doSelect(query).then((rows: any) => {
    return rows.map((data: any) => mapRowToTreatment(salonId, data));
  });
}

function mapRowToTreatment(salonId: string, row: any): Treatment {
  const params: TreatmentParams = {
    urn: convert("treatment", [salonId, row["service_id"]]),
    name: row["service_name"],
    price: row["service_price"]
  };

  return new Treatment(params);
}

export default {
  fetchTreatmentsByUrns
};
