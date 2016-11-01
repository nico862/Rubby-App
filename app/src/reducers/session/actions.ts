import {Dispatch} from "react-redux";

import * as types from "./action-types";
import * as sessionApi from "../../api/session";
import {handleApiError} from "../util";

declare const fetch: (url: string, options?: Object) => Promise<any>;

export function initialiseApp() {
  return (dispatch: Dispatch<any>, getState: any): void => {
    sessionApi.hasAccessToken()
      .then(result => {
        if (result) {
          dispatch(logInSuccess());
        }
        else {
          dispatch(logOutAction());
        }
      })
      .catch(err => {
        dispatch(logOutAction());
      });
  };
}

export function login(username: string, password: string) {
  return (dispatch: Dispatch<any>, getState: any): void => {
    // login logic would go here, and when it"s done, we switch app roots
    dispatch(loginAttempt());

    sessionApi.logIn(username, password)
      .then(() => {
        dispatch(logInSuccess());
      })
      .catch(handleApiError.bind(null, dispatch, loginError));
  };
}

export function logout() {
  return (dispatch: Dispatch<any>, getState: any): void => {
    sessionApi.removeAccessTokens()
      .then( () => dispatch(logOutAction()) );
  };
}

export function logOutAction() {
  return {type: types.LOG_OUT, payload: {}};
}

function loginAttempt() {
  return {type: types.LOG_IN_ATTEMPT, payload: {}};
}

function logInSuccess() {
  return {type: types.LOG_IN_SUCCESS, payload: {}};
}

function loginError() {
  return {type: types.LOG_IN_FAIL, payload: {}};
}
