"use strict";
class Address {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            address1: this.address1,
            address2: this.address2,
            postcode: this.postcode
        };
    }
}
exports.Address = Address;

//# sourceMappingURL=address.js.map
