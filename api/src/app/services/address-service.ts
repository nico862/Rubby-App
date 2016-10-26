import * as squel from "squel";

import * as db from "../database";
import { extractId, convert } from "../utils/urn";
import { Address, AddressParams } from "../business-objects";

const squelSelectOptions: any = {
  tableAliasQuoteCharacter: "",
  replaceSingleQuotes: true,
};

function fetchCustomerAddressesByUrns(urns: string[]): Promise<any> {
  if (urns.length === 0) {
    return Promise.resolve([]);
  }

  const ids = urns.map(extractId.bind(null, ["address"])).map(arr => arr[0]);

  const query = squel.select(squelSelectOptions)
      .from("customers_addresses")
      .where("customers_addresses_id IN ?", ids);

      return db.doSelect(query).then((rows: any) => {
        return rows.map(mapRowToAddress);
      });
}

function mapRowToAddress(row: any): Address {
  const params: AddressParams = {
    urn: convert("address", [row.customers_addresses_id]),
    address1: row.address1,
    address2: row.address2,
    postcode: row.postcode
  };

  return new Address(params);
}

export default {
  fetchCustomerAddressesByUrns
};
