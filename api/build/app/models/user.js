"use strict";
class User {
    constructor(params) {
        for (const key in params) {
            this[key] = params[key];
        }
        this.id = params.urn;
    }
    toJSON() {
        return {
            "@id": this.urn,
            email: this.email
        };
    }
}
exports.User = User;

//# sourceMappingURL=user.js.map
