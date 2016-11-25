import {Dispatch} from "redux";

import * as types from "./session/action-types";
import {logOutAction} from "./session/actions";
import {REQUEST_APP_VERSION_UPGRADE, REQUEST_REFRESH_TOKEN_EXPIRED} from "../api/request";

export function handleApiError(dispatch: Dispatch<any>, errorMethod: (err: Error) => any, err: Error) {
  console.log("ERROR: " + err);

  switch (err.message) {
    case REQUEST_APP_VERSION_UPGRADE:
      dispatch(promptUpgradeAction());

    case REQUEST_REFRESH_TOKEN_EXPIRED:
      dispatch(logOutAction());

    default:
      dispatch(errorMethod(err));
  }
}

export function promptUpgradeAction() {
  return {type: types.REQUIRE_UPGRADE};
}
