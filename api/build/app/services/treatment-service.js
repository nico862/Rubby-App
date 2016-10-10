"use strict";
const squel = require("squel");
const urn_1 = require("../utils/urn");
const db = require("../database");
const models_1 = require("../models");
const squelSelectOptions = {
    tableAliasQuoteCharacter: "",
    replaceSingleQuotes: true,
};
function fetchTreatmentsByUrns(salonUrn, urns) {
    const ids = urns.map(urn_1.extractId);
    const salonId = urn_1.extractId(salonUrn);
    const query = squel.select(squelSelectOptions)
        .from(`salon_${salonId}.salon_services`)
        .where("service_id IN ?", ids);
    return db.doSelect(query).then((rows) => {
        return rows.map((data) => mapRowToTreatment(salonId, data));
    });
}
function mapRowToTreatment(salonId, row) {
    const params = {
        urn: urn_1.convert("treatment", row.service_id, salonId),
        name: row.service_name,
        price: row.service_price
    };
    return new models_1.Treatment(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchTreatmentsByUrns: fetchTreatmentsByUrns
};

//# sourceMappingURL=treatment-service.js.map
