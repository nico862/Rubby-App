export interface UserParams {
  urn: string;
  email: string;
}

export class User {
  urn: string;
  email: string;
  id: string;

  constructor(params: UserParams) {
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
