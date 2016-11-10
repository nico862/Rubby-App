import * as si from "seamless-immutable";

import * as types from "./action-types";

const initialState = si.from({
  rootLayout: "wait"
});

export default function app(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.LOG_IN_ATTEMPT:
      return state.merge({
        isLoggingIn: true,
        error: null,
      });

    case types.LOG_IN_SUCCESS:
      return state.merge({
        isLoggingIn: false,
        isAuthenticated: true,
        error: null,
      });

    case types.LOG_IN_FAIL:
      return state.merge({
        isLoggingIn: false,
        error: "Email adddress and password are not recognised",
      });

    case types.LOG_OUT:
      return state.merge({
        isAuthenticated: false,
      });

    case types.REQUIRE_UPGRADE:
      return state.merge({
        requireUpgrade: true,
      });

    default:
      return state;
  }
}
