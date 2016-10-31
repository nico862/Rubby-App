import * as reactRedux from "react-redux";

import {getBookings} from "../../api/bookings";
import * as types from "./action-types";
import {promptUpgradeAction} from "../session/actions";
import {REQUEST_APP_VERSION_UPGRADE} from "../../api/request";

export function fetchBookingsSuccess(bookings: any) {
  return {type: types.FETCH_SUCCESS, bookings};
}

export function fetchBookingsFail(err: Error) {
  console.log(err);
  return {type: types.FETCH_FAIL};
}

export function fetchBookings() {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    getBookings()
      .then(data => dispatch(fetchBookingsSuccess(data)))
      .catch((err: Error) => {
        switch (err.message) {
          case REQUEST_APP_VERSION_UPGRADE:
            dispatch(promptUpgradeAction());

          default:
            dispatch(fetchBookingsFail(err));
        }
      });
  };
}
