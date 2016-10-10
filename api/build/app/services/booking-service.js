"use strict";
const axios = require("axios");
const squel = require("squel");
const url = require("url");
const moment = require("moment");
const config_1 = require("../config");
const urn_1 = require("../utils/urn");
const models_1 = require("../models");
const db = require("../database");
function fetchBookingsForUser(userUrn, options) {
    const userId = urn_1.extractId(userUrn);
    // get salons for user
    const query = squel.select(db.squelSelectOptions)
        .from("members_salons")
        .where("member_id = ?", userId);
    return db.doSelect(query)
        .then((rows) => {
        return rows.map((row) => row.salon_unique_id);
    })
        .then((salonIds) => {
        // get bookings for all salons fetched
        return new Promise((resolve, reject) => {
            const reqUrl = url.parse(`${config_1.default.bookingsApi.endpoint}/bookings`);
            reqUrl.query = { salonUrn: salonIds.map((id) => urn_1.convert("salon", id)) };
            if (options) {
                if (options.start && options.end) {
                    reqUrl.query.overlaps = `${options.start.toISOString()} TO ${options.end.toISOString()}`;
                }
            }
            axios.get(url.format(reqUrl))
                .then(function (response) {
                resolve(response.data.map(mapToBooking));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    });
}
function mapToBooking(data) {
    const params = {
        urn: data["@id"],
        timeStarts: moment(data.timeStarts),
        timeEnds: moment(data.timeEnds),
        salonUrn: data.salonUrn,
        addressUrn: data.addressUrn,
        customerUrn: data.customerUrn,
        notes: data.notes,
        status: data.status,
        timeCreated: data.timeCreated,
        timeUpdated: data.timeUpdated
    };
    return new models_1.Booking(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchBookingsForUser: fetchBookingsForUser
};

//# sourceMappingURL=booking-service.js.map
