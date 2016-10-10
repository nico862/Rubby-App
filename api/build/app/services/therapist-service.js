"use strict";
const squel = require("squel");
const urn_1 = require("../utils/urn");
const db = require("../database");
const models_1 = require("../models");
const squelSelectOptions = {
    tableAliasQuoteCharacter: "",
    replaceSingleQuotes: true,
};
function fetchTherapistsByUrns(salonUrn, urns) {
    const ids = urns.map(urn_1.extractId);
    const salonId = urn_1.extractId(salonUrn);
    const query = squel.select(squelSelectOptions)
        .from(`salon_${salonId}.salon_workstations`)
        .where("workstation_id IN ?", ids);
    return db.doSelect(query).then((rows) => {
        return rows.map((data) => mapRowToTherapist(salonId, data));
    });
}
function mapRowToTherapist(salonId, row) {
    const params = {
        urn: urn_1.convert("therapist", row.workstation_id, salonId),
        name: row.workstation_name
    };
    return new models_1.Therapist(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchTherapistsByUrns: fetchTherapistsByUrns
};

//# sourceMappingURL=therapist-service.js.map
