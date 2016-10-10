"use strict";
class BookingTreatment {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            bookingId: this.bookingId,
            treatmentUrn: this.treatmentUrn,
            therapistUrn: this.therapistUrn,
            therapist: this.therapist,
            timeCreated: this.timeCreated,
            timeUpdated: this.timeUpdated,
            treatment: this.treatment
        };
    }
}
exports.BookingTreatment = BookingTreatment;

//# sourceMappingURL=booking-treatment.js.map
