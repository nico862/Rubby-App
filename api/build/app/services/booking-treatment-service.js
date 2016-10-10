"use strict";
const axios = require("axios");
const config_1 = require("../config");
const models_1 = require("../models");
const urn_1 = require("../utils/urn");
function fetchBookingTreatments(booking) {
    return new Promise((resolve, reject) => {
        axios.get(`${config_1.default.bookingsApi.endpoint}/bookings/${booking.urn}/booking-treatments`)
            .then(function (response) {
            resolve(response.data.map(mapToBookingTreatment));
        })
            .catch(function (error) {
            reject(error);
        });
    });
}
function mapToBookingTreatment(data) {
    const params = {
        id: urn_1.extractId(data["@id"]),
        urn: data["@id"],
        bookingId: data.bookingId,
        treatmentUrn: data.treatmentUrn,
        therapistUrn: data.therapistUrn,
        timeCreated: data.timeCreated,
        timeUpdated: data.timeUpdated
    };
    return new models_1.BookingTreatment(params);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetchBookingTreatments: fetchBookingTreatments
};

//# sourceMappingURL=booking-treatment-service.js.map
