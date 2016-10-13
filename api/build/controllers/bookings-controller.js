"use strict";
const moment = require("moment");
const services_1 = require("../services");
function assignAddresses(bookings) {
    const urns = bookings.map(booking => booking.addressUrn).filter(urn => urn !== undefined);
    return services_1.addressService.fetchCustomerAddressesByUrns(urns).then((addresses) => {
        bookings.forEach(booking => booking.address = addresses.find((address) => booking.addressUrn === address.urn));
    }).then(() => bookings);
}
function assignCustomers(bookings) {
    const urns = bookings.map(booking => booking.customerUrn);
    return services_1.customerService.fetchCustomersByUrns(urns).then((customers) => {
        bookings.forEach(booking => booking.customer = customers.find((customer) => booking.customerUrn === customer.urn));
    }).then(() => bookings);
}
function assignSalons(bookings) {
    const urns = bookings.map(booking => booking.salonUrn);
    return services_1.salonService.fetchSalonsByUrns(urns).then((salons) => {
        bookings.forEach(booking => booking.salon = salons.find((salon) => booking.salonUrn === salon.urn));
    }).then(() => bookings);
}
function assignTreatmentToBookingTreatments(salonUrn, bookingTreatments) {
    const urns = bookingTreatments.map(bookingTreatment => bookingTreatment.treatmentUrn);
    return services_1.treatmentService.fetchTreatmentsByUrns(salonUrn, urns)
        .then((treatments) => {
        bookingTreatments.forEach(bookingTreatment => bookingTreatment.treatment = treatments.find((treatment) => treatment.urn === bookingTreatment.treatmentUrn));
    })
        .then(() => bookingTreatments);
}
function assignTherapistToBookingTreatments(salonUrn, bookingTreatments) {
    const urns = bookingTreatments.map(bookingTreatment => bookingTreatment.therapistUrn);
    return services_1.therapistService.fetchTherapistsByUrns(salonUrn, urns)
        .then((therapists) => {
        bookingTreatments.forEach(bookingTreatment => bookingTreatment.therapist = therapists.find((therapist) => therapist.urn === bookingTreatment.therapistUrn));
    })
        .then(() => bookingTreatments);
}
function assignBookingTreatments(bookings) {
    const promises = bookings.map((booking) => {
        return services_1.bookingTreatmentService.fetchBookingTreatments(booking)
            .then((bookingTreatments) => {
            booking.bookingTreatments = bookingTreatments;
        })
            .then(() => assignTreatmentToBookingTreatments(booking.salonUrn, booking.bookingTreatments))
            .then(() => assignTherapistToBookingTreatments(booking.salonUrn, booking.bookingTreatments));
    });
    return Promise.all(promises).then(() => bookings);
}
function assignFields(bookings) {
    return Promise.all([
        assignBookingTreatments(bookings),
        assignSalons(bookings),
        assignCustomers(bookings),
        assignAddresses(bookings)
    ]).then(() => bookings);
}
function divideByCompleted(bookings) {
    const now = moment();
    const dividedBookings = {
        completed: [],
        upcoming: [],
    };
    bookings.forEach(booking => {
        if (booking.timeEnds.isBefore(now)) {
            dividedBookings.completed.push(booking);
        }
        else {
            dividedBookings.upcoming.push(booking);
        }
    });
    return dividedBookings;
}
function sortBookings(bookings) {
    return bookings.sort((a, b) => {
        if (a.timeEnds < b.timeEnds)
            return 1;
        if (a.timeEnds > b.timeEnds)
            return -1;
        return 0;
    });
}
function index(req, res, next) {
    const user = res.locals.oauth.token.user;
    const start = moment().startOf("day").subtract(2, "months");
    const end = moment().startOf("day").add(2, "months");
    services_1.bookingService.fetchBookingsForUser(user.id, { start, end })
        .then(sortBookings)
        .then(assignFields)
        .then((bookings) => res.json(divideByCompleted(bookings)))
        .catch(console.log);
}
exports.index = index;
