
const urnPrefix = "urn:ruuby";

export function convert(resource: string, identifier: string, salonUniqueId: string = ""): string {
  const suffix = (salonUniqueId === "" ? identifier : `${salonUniqueId}-${identifier}`);
  return `${urnPrefix}:${resource}:${suffix}`;
}

export function extractId(urn: string): string {
  // if this is true then we have a guid
  if ((urn.match(/-/g) || []).length > 1) {
    const regex = /.*:(.*)/g; // Find the last digits e.g. urn:ruuby:treatment:296513579-41 shout find 41
    const match = regex.exec(urn);
    const result = match[1];
    return result;

  } else { // else we either have a salon id followed by the database id, or just the database id
    const regex = /\d+(?!.*\d)/g; // find the last digits e.g. urn:ruuby:treatment:296513579-41 should find 41
    const match = regex.exec(urn);
    const result = match[0];
    return result;
  }


}
