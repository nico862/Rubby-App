"use strict";
class Salon {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            name: this.name,
            isMobile: this.isMobile
        };
    }
}
exports.Salon = Salon;

//# sourceMappingURL=salon.js.map
