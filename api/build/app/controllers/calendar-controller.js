"use strict";
const moment = require("moment");
const services_1 = require("../services");
const calendar_1 = require("../transformers/calendar");
const config_1 = require("../config");
function index(req, res, next) {
    const user = res.locals.oauth.token.user;
    const start = moment().startOf("day");
    const end = start.clone().add(config_1.default.calendar.daysAhead, "days");
    services_1.bookingService.fetchBookingsForUser(user.id, { start: start, end: end })
        .then(bookings => {
        res.json(calendar_1.getDates(start, end, bookings));
    })
        .catch(console.log);
}
exports.index = index;
function dayAvailability(req, res, next) {
    const user = res.locals.oauth.token.user;
    const day = moment("2016-10-07").startOf("day");
    services_1.bookingService.fetchBookingsForUser(user.id, { start: day, end: day })
        .then(bookings => {
        res.json(calendar_1.getDayAvailability(day, bookings));
    })
        .catch(console.log);
}
exports.dayAvailability = dayAvailability;

//# sourceMappingURL=calendar-controller.js.map
