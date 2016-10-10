"use strict";
class Customer {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone
        };
    }
}
exports.Customer = Customer;

//# sourceMappingURL=customer.js.map
