"use strict";
const squel = require("squel");
const urn_1 = require("../utils/urn");
const db = require("../database");
const models_1 = require("../models");
function fetchCustomersByUrns(urns) {
    if (urns.length === 0) {
        return Promise.resolve([]);
    }
    const ids = urns.map(urn_1.extractId);
    const query = squel.select(db.squelSelectOptions)
        .from("customers")
        .where("customer_id IN ?", ids);
    return db.doSelect(query).then((rows) => {
        return rows.map(mapRowToCustomer);
    });
}
function mapRowToCustomer(row) {
    const params = {
        urn: urn_1.convert("customer", row.customer_id),
        firstName: row.customer_fname,
        email: row.customer_email,
        lastName: row.customer_lname,
        phone: row.customer_phone
    };
    return new models_1.Customer(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchCustomersByUrns: fetchCustomersByUrns
};

//# sourceMappingURL=customer-service.js.map
