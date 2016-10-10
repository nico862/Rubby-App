import * as types from "./action-types";
import config from "../../config";

import * as reactRedux from "react-redux";

declare const fetch: (url: string, options?: Object) => Promise<any>;

export function fetchCalendarAttempt() {
  return {type: types.FETCH_CALENDAR_ATTEMPT};
}

export function fetchCalendarSuccess(calendar: any) {
  return {type: types.FETCH_CALENDAR_SUCCESS, calendar};
}

export function fetchCalendarFail(err: Error) {
  return {type: types.FETCH_CALENDAR_FAIL};
}

export function fetchCalendar() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {

    const token = getState().session.token.access_token;
    dispatch(fetchCalendarAttempt());

    fetch(`${ config.api.host }/calendar`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => dispatch(fetchCalendarSuccess(data)))
      .catch(err => dispatch(fetchCalendarFail(err)));
  };
}