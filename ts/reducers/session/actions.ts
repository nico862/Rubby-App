import {Dispatch} from "redux";

import * as types from "./action-types";
import * as sessionApi from "../../api/session";
import {handleApiError} from "../util";

export function initialiseApp() {
  return (dispatch: Dispatch<any>): void => {
    sessionApi.hasAccessToken()
      .then(result => {
        if (result) {
          dispatch(logInSuccess());
        }
        else {
          dispatch(logOutAction());
        }
      })
      .catch(() => {
        dispatch(logOutAction());
      });
  };
}

export function logIn(username: string, password: string) {
  return (dispatch: Dispatch<any>): void => {
    // login logic would go here, and when it"s done, we switch app roots
    dispatch(loginAttempt());

    sessionApi.logIn(username, password)
      .then(() => {
        dispatch(logInSuccess());
      })
      .catch(handleApiError.bind(null, dispatch, loginError));
  };
}

export function logOut() {
  return (dispatch: Dispatch<any>): void => {
    sessionApi.removeAccessTokens()
      .then( () => dispatch(logOutAction()) );
  };
}

export function logOutAction() {
  return {type: types.LOG_OUT};
}

function loginAttempt() {
  return {type: types.LOG_IN_ATTEMPT};
}

function logInSuccess() {
  return {type: types.LOG_IN_SUCCESS, payload: {}};
}

function loginError() {
  return {type: types.LOG_IN_FAIL, payload: {}};
}
