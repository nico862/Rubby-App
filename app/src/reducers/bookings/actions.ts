import * as types from "./action-types";
import config from "../../config";

import * as reactRedux from "react-redux";

declare const fetch: (url: string, options?: Object) => Promise<any>;

export function fetchBookingsAttempt() {
  return {type: types.FETCH_ATTEMPT};
}

export function fetchBookingsSuccess(bookings: any) {
  return {type: types.FETCH_SUCCESS, bookings};
}

export function fetchBookingsFail(err: Error) {
  return {type: types.FETCH_FAIL};
}

export function fetchBookings() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {

    const token = getState().session.token.access_token;
    dispatch(fetchBookingsAttempt());

    fetch(`${ config.api.host }/bookings`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => dispatch(fetchBookingsSuccess(data)))
      .catch(err => dispatch(fetchBookingsFail(err)));
  };
}