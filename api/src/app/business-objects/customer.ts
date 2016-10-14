export interface CustomerParams {
  urn: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export class Customer {
  urn: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;

  constructor(params: CustomerParams) {
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
