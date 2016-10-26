declare module "passport-http" {
  // export var  BasicStrategy: string;
  // export type BasicStrategy = any;
  import * as passport from "passport";

  export class BasicStrategy implements passport.Strategy {
    constructor(callback: {(username: string, password: string, callback: any): any} );
    authenticate(): boolean;
  }
}
