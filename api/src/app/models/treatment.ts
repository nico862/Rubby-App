export interface TreatmentParams {
  urn: string;
  name: string;
  price: number;
}

export class Treatment {
  urn: string;
  name: string;
  price: number;

  constructor(params: TreatmentParams) {
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
