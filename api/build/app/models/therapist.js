"use strict";
class Therapist {
    constructor(params) {
        for (let key in params) {
            this[key] = params[key];
        }
    }
    toJSON() {
        return {
            "@id": this.urn,
            name: this.name
        };
    }
}
exports.Therapist = Therapist;

//# sourceMappingURL=therapist.js.map
