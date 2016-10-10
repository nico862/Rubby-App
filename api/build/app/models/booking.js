"use strict";
class Booking {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            timeStarts: this.timeStarts,
            timeEnds: this.timeEnds,
            customerUrn: this.customerUrn,
            salonUrn: this.salonUrn,
            addressUrn: this.addressUrn,
            bookingTreatments: this.bookingTreatments,
            notes: this.notes,
            status: this.status,
            timeCreated: this.timeCreated,
            timeUpdated: this.timeUpdated,
            salon: this.salon,
            customer: this.customer,
            address: this.address
        };
    }
}
exports.Booking = Booking;

//# sourceMappingURL=booking.js.map
