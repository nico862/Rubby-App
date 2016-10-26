import * as Immutable from "seamless-immutable";

import * as types from "./action-types";

const initialState = Immutable({
  rootLayout: "wait"
});

export default function app(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.LOGIN_ATTEMPT:
      return state.merge({
        isLoggingIn: true,
        error: null,
      });

    case types.LOGIN_SUCCESS:
      return state.merge({
        rootLayout: "main",
        isLoggingIn: false,
        token: action.payload,
        isAuthenticated: true,
        error: null,
      });

    case types.LOGIN_FAIL:
      return state.merge({
        isLoggingIn: false,
        error: action.payload,
      });

    case types.ROOT_CHANGED:
      return state.merge({
        rootLayout: action.payload,
        isAuthenticated: false
      });

    default:
      return state;
  }
}
