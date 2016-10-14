const URN_PREFIX = "urn:ruuby";

const uuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}--[0-9a-f]{4}--[0-9a-f]{4}--[0-9a-f]{12}$");

export function convert(resource: string, identifier: string[]): string {
  const suffix = identifier.join("-");
  return `${URN_PREFIX}:${resource}:${suffix}`;
}

export function extractId(resource: string, urn: string): string[] {
  const urnRegex = new RegExp(`${URN_PREFIX}:${resource}:(.+)$`);

  const match = urn.match(urnRegex);
  if (match === null) return null;

  const uuidMatch = match[1].match(uuidRegex);
  if (uuidMatch !== null) {
    // is a uuid
    return [match[1]];
  }
  else {
    return match[1].split("-");
  }
}
