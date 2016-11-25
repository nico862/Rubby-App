import {Dispatch} from "redux";

import * as types from "./action-types";
import * as calendarApi from "../../api/calendar";
import {handleApiError} from "../util";

export function fetchCalendar(): (dispatch: Dispatch<any>) => void  {
  return (dispatch: Dispatch<any>) => {
    calendarApi.getCalendar()
      .then(data => dispatch(fetchCalendarSuccess(data)))
      .catch(handleApiError.bind(null, dispatch, fetchCalendarFail));
  };
}

function fetchCalendarSuccess(calendar: any) {
  return {type: types.FETCH_CALENDAR_SUCCESS, calendar};
}

function fetchCalendarFail() {
  return {type: types.FETCH_CALENDAR_FAIL};
}
