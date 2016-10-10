import * as express from "express";
import * as squel from "squel";

import config from "../config";
import { extractId, convert } from "../utils/urn";
import * as db from "../database";
import { ResourceNotFound } from "../errors";
import { Customer, CustomerParams } from "../models";

function fetchCustomersByUrns(urns: string[]): Promise<any> {
  const ids = urns.map(extractId);

  const query = squel.select(db.squelSelectOptions)
      .from("customers")
      .where("customer_id IN ?", ids);

  return db.doSelect(query).then((rows: any) => {
    return rows.map(mapRowToCustomer);
  });
}

function mapRowToCustomer(row: any): Customer {
  const params: CustomerParams = {
    urn: convert("customer", row.customer_id),
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
