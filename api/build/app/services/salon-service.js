"use strict";
const squel = require("squel");
const urn_1 = require("../utils/urn");
const db = require("../database");
const models_1 = require("../models");
const squelSelectOptions = {
    tableAliasQuoteCharacter: "",
    replaceSingleQuotes: true,
};
function fetchSalonsByUrns(urns) {
    if (urns.length === 0) {
        return Promise.resolve([]);
    }
    const ids = urns.map(urn_1.extractId);
    const query = squel.select(squelSelectOptions)
        .from("members_salons")
        .where("salon_unique_id IN ?", ids);
    return db.doSelect(query).then((rows) => {
        return rows.map(mapRowToSalon);
    });
}
function mapRowToSalon(row) {
    const params = {
        urn: urn_1.convert("salon", row.salon_unique_id),
        name: row.salon_name,
        isMobile: row.salon_mobile === 1
    };
    return new models_1.Salon(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchSalonsByUrns: fetchSalonsByUrns
};

//# sourceMappingURL=salon-service.js.map
