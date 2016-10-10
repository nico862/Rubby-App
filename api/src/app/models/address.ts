export interface AddressParams {
  urn: string;
  address1: string;
  address2: string;
  postcode: string;
}

export class Address {
  urn: string;
  address1: string;
  address2: string;
  postcode: string;

  constructor(params: AddressParams) {
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
