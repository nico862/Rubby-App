import { AsyncStorage } from "react-native";
import * as reactRedux from "react-redux";

import * as types from "./action-types";
import * as sessionApi from "../../api/session";

declare const fetch: (url: string, options?: Object) => Promise<any>;

export function logout() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any): void => {
      console.log("logging out");
      AsyncStorage.removeItem("apiAccessToken")
        .then( () => dispatch(logoutAction()) );
  };
}

function changeRoot(root: string) {
  return {
    type: types.ROOT_CHANGED,
    payload: root
  };
}

export function appInitialized() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    sessionApi.hasAccessToken()
      .then(result => {
        if (result) {
          dispatch(loginSuccess({})); // REPLACE
        }
        else {
          dispatch(changeRoot("login"));
        }
      })
      .catch(err => {
        dispatch(changeRoot("login"));
      });
  };
}

export function login(username: string, password: string) {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    // login logic would go here, and when it"s done, we switch app roots
    dispatch(loginAttempt());

    sessionApi.logIn(username, password)
      .then(data => {
        dispatch(loginSuccess({}));
      })
     .catch(err => {
       dispatch(loginError());
     });
  };
}

function logoutAction() {
  return {type: types.ROOT_CHANGED, payload: "login"};
}

function loginAttempt() {
  return {type: types.LOGIN_ATTEMPT, payload: {}};
}

function loginSuccess(sessionData: any) {
  return {
    type: types.LOGIN_SUCCESS,
    payload: sessionData
  };
}

function loginError() {
  const payload = "Email adddress and password are not recognised";

  return {
    type: types.LOGIN_FAIL,
    payload
  };
}
