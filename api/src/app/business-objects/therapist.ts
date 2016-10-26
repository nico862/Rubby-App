export interface TherapistParams {
  urn: string;
  name: string;
}

export class Therapist {
  urn: string;
  name: string;

  constructor(params: TherapistParams) {
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
