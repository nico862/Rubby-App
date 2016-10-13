"use strict";
const squel = require("squel");
const db = require("../database");
const urn_1 = require("../utils/urn");
const models_1 = require("../models");
const squelSelectOptions = {
    tableAliasQuoteCharacter: "",
    replaceSingleQuotes: true,
};
function fetchCustomerAddressesByUrns(urns) {
    if (urns.length === 0) {
        return Promise.resolve([]);
    }
    const ids = urns.map(urn_1.extractId);
    console.log("ids", ids);
    const query = squel.select(squelSelectOptions)
        .from("customers_addresses")
        .where("customers_addresses_id IN ?", ids);
    return db.doSelect(query).then((rows) => {
        return rows.map(mapRowToAddress);
    });
}
function mapRowToAddress(row) {
    const params = {
        urn: urn_1.convert("address", row.customers_addresses_id),
        address1: row.address1,
        address2: row.address2,
        postcode: row.postcode
    };
    return new models_1.Address(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchCustomerAddressesByUrns: fetchCustomerAddressesByUrns
};

//# sourceMappingURL=address-service.js.map
