import * as types from "./action-types";
import config from "../../config";

import { AsyncStorage } from "react-native";
import * as reactRedux from "react-redux";

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
    console.log("Initializing");

    getStoredToken()
      .then((tokenData) => {
        console.log("token: " + tokenData);
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

        dispatch(changeRoot("login"));
      });
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

    const body = Object.keys(postParams).map(key => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(postParams[key]);
      return `${encodedKey}=${encodedValue}`;
    }).join("&");

    fetch(`${ config.api.host }/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${ config.api.clientAuth }`
      },
      body,
    })
      .then(validateResponse)
      .then(setStoredToken)
      .then((data) => {
        dispatch(loginSuccess(data));
      })
     .catch(err => {
       dispatch(loginError(err));
     });
  };
}

function validateResponse(res: any) {
  if (!res.ok) {
    throw new Error("FAIL_LOGIN");
  }

  return res.json();
}

function logoutAction() {
  return {type: types.ROOT_CHANGED, payload: "login"};
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

function loginError (err: Error) {
  let payload: string;

  switch (err.message) {
    case "FAIL_LOGIN":
      payload = "Email adddress and password are not recognised";
  }
  console.log(payload);

  return {
    type: types.LOGIN_FAIL,
    payload
  };
}

function getStoredToken() {
  return AsyncStorage.getItem("apiAccessToken")
    .then((data) => {
      return JSON.parse(data);
    });
}

function setStoredToken(tokenData: any) {
  console.log("setting");
  return AsyncStorage.setItem("apiAccessToken", JSON.stringify(tokenData))
    .then(() => { return tokenData; });
}
