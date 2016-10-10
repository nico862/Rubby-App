import * as types from "./action-types";
import config from "../../config";

import * as moment from "moment";
import { AsyncStorage } from "react-native";
import * as reactRedux from "react-redux";

declare const fetch: (url: string, options?: Object) => Promise<any>;

export function logout() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    dispatch(logoutAction());
  };
}

export function appInitialized() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
// AsyncStorage.removeItem("apiAccessToken").then(() => {

    getStoredToken()
      .then((tokenData) => {
        if (tokenData) {
          console.log(tokenData);
          // handle expired data
          // if (tokenData.expires < moment()) {
          // }

          if (tokenData && tokenData.access_token) {
            console.log(tokenData);
            dispatch(loginSuccess(tokenData));
            return;
          }
        }

        dispatch(logoutAction());
      })
      .catch(console.log);
// });
  };
}

export function login(username: string, password: string) {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    // login logic would go here, and when it"s done, we switch app roots
    dispatch(loginAttempt());

    const postParams = {
      username,
      password,
      grant_type: "password",
    };

    const postBody = Object.keys(postParams).map(key => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(postParams[key]);
      return `${encodedKey}=${encodedValue}`;
    }).join("&");

    fetch(`${ config.api.host }/oauth/token`, {
      method: "POST",
      body: postBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${ config.api.clientAuth }`
      }
    })
      .then(res => res.json())
      .then(setStoredToken)
      .then((data) => {
        dispatch(loginSuccess(data));
      })
     .catch(err => {
       console.log(err);
//       dispatch(loginFail(err));
     });
  };
}

function logoutAction() {
  console.log("Here");
  return {type: types.LOGOUT, payload: {}};
}

function loginAttempt() {
  return {type: types.LOGIN_ATTEMPT, payload: {}};
}

function loginSuccess (sessionData: any) {
  return {
    type: types.LOGIN_SUCCESS,
    payload: sessionData
  };
}

function getStoredToken() {
  return AsyncStorage.getItem("apiAccessToken")
    .then((data) => {
      return JSON.parse(data);
    });
}

function setStoredToken(tokenData: any) {
  return AsyncStorage.setItem("apiAccessToken", JSON.stringify(tokenData))
    .then(() => { return tokenData; });
}