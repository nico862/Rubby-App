import Immutable from "seamless-immutable";
import { Reducer } from "redux";

import * as types from "./action-types";

const initialState = Immutable({
  rootLayout: "wait"
});

export default function app(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return state.merge({
        rootLayout: "main",
        isLoggingIn: false,
        token: action.payload,
        isAuthenticated: true
      });

    case types.LOGOUT:
      return state.merge({
        rootLayout: "login",
        isLoggingIn: false,
        isAuthenticated: false
      });

    default:
      return state;
  }
}