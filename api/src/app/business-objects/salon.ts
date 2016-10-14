export interface SalonParams {
  urn: string;
  name: string;
  isMobile: boolean;
}

export class Salon {
  urn: string;
  name: string;
  isMobile: boolean;

  constructor(params: SalonParams) {
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
