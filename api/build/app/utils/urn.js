"use strict";
const urnPrefix = "urn:ruuby";
function convert(resource, identifier, salonUniqueId = "") {
    const suffix = (salonUniqueId === "" ? identifier : `${salonUniqueId}-${identifier}`);
    return `${urnPrefix}:${resource}:${suffix}`;
}
exports.convert = convert;
function extractId(urn) {
    // if this is true then we have a guid
    if ((urn.match(/-/g) || []).length > 1) {
        const regex = /.*:(.*)/g; // Find the last digits e.g. urn:ruuby:treatment:296513579-41 shout find 41
        const match = regex.exec(urn);
        const result = match[1];
        return result;
    }
    else {
        const regex = /\d+(?!.*\d)/g; // find the last digits e.g. urn:ruuby:treatment:296513579-41 should find 41
        const match = regex.exec(urn);
        const result = match[0];
        return result;
    }
}
exports.extractId = extractId;

//# sourceMappingURL=urn.js.map
