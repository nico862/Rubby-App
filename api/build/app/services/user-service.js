"use strict";
const squel = require("squel");
const urn_1 = require("../utils/urn");
const db = require("../database");
const errors_1 = require("../errors");
const models_1 = require("../models");
const USER_NOT_FOUND = "USER_NOT_FOUND";
function findUserByEmailAndPassword(email, password) {
    const query = squel.select(db.squelSelectOptions)
        .from("members")
        .where("member_email = ? AND member_passwd = ?", email, password);
    return db.doSelect(query).then((rows) => {
        if (rows.length === 0) {
            throw new errors_1.ResourceNotFound(USER_NOT_FOUND);
        }
        ;
        const row = rows[0];
        return new models_1.User({
            urn: urn_1.convert("user", row.member_id),
            email: row.member_email,
        });
    });
}
function fetchUserByUrn(urn) {
    const id = urn_1.extractId(urn);
    const query = squel.select(db.squelSelectOptions)
        .from("members")
        .where("member_id = ?", id);
    return db.doSelect(query).then((rows) => {
        const row = rows[0];
        return new models_1.User({
            urn: urn_1.convert("user", row.member_id),
            email: row.member_email,
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    USER_NOT_FOUND: USER_NOT_FOUND,
    fetchUserByUrn: fetchUserByUrn,
    findUserByEmailAndPassword: findUserByEmailAndPassword
};

//# sourceMappingURL=user-service.js.map
