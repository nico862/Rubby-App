import * as squel from "squel";

import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { Customer, CustomerParams } from "../business-objects";

function fetchCustomersByUrns(urns: string[]): Promise<any> {
  if (urns.length === 0) {
    return Promise.resolve([]);
  }

  const ids = urns.map(extractId.bind(null, ["customer"])).map(arr => arr[0]);

  const query = squel.select(db.squelSelectOptions)
      .from("customers")
      .where("customer_id IN ?", ids);

  return db.doSelect(query).then((rows: any) => {
    return rows.map(mapRowToCustomer);
  });
}

function mapRowToCustomer(row: any): Customer {
  const params: CustomerParams = {
    urn: convert("customer", [row.customer_id]),
    firstName: row.customer_fname,
    email: row.customer_email,
    lastName: row.customer_lname,
    phone: row.customer_phone
  };

  return new Customer(params);
}


export default {
  fetchCustomersByUrns
};
