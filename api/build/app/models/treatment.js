"use strict";
class Treatment {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            name: this.name,
            price: this.price
        };
    }
}
exports.Treatment = Treatment;

//# sourceMappingURL=treatment.js.map
