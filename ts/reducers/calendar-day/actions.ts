import {Dispatch} from "redux";
import * as moment from "moment-timezone";

import * as types from "./action-types";
import * as calendarApi from "../../api/calendar";
import {handleApiError} from "../util";
import * as calendarActions from "../calendar/actions";
import config from "../../config";

export function fetchDayDiary(date: string): (dispatch: Dispatch<any>) => void {
  return (dispatch: Dispatch<any>) => {
    dispatch(fetchDayDiaryAttempt());

    calendarApi.getCalendarDay(date)
      .then(data => dispatch(fetchDayDiarySuccess(data)))
      .catch(handleApiError.bind(null, dispatch, fetchDayDiaryFail));
  };
}

export function toggleHour(dateString: string, hourIndex: number): (dispatch: Dispatch<any>, getState: any) => void  {
  return (dispatch: Dispatch<any>, getState: any) => {
    const hours = getState().calendarDay.diary.hours;
    const selectedHour = hours[hourIndex];

    const timeStarts = moment(dateString).tz(config.timezone).add(selectedHour.hour, "hour");

    if (hours[hourIndex].isAvailable) {
      dispatch(setHourUnavailable(hourIndex));

      calendarApi.setHourUnavailable(selectedHour.location)
        .then(validateResponse)
        .then(unsetHourAvailabilityLocation.bind(null, hourIndex, dispatch))
        .then(() => dispatch(calendarActions.fetchCalendar()))
        .catch(handleApiError.bind(null, dispatch, updateHourAvailabilityFail.bind(null, hourIndex)));
    }
    else {
      dispatch(setHourAvailable(hourIndex));

      calendarApi.setHourAvailable(timeStarts)
        .then(setHourAvailabilityLocation.bind(null, hourIndex, dispatch))
        .then(() => dispatch(calendarActions.fetchCalendar()))
        .catch(handleApiError.bind(null, dispatch, updateHourAvailabilityFail.bind(null, hourIndex)));
    }

    dispatch(setHourUpdating(hourIndex));
  };
}

function setHourAvailabilityLocation(hourIndex: number, dispatch: Dispatch<any>, res: any) {
  dispatch(setHourLocation(hourIndex, res.headers.get("Location")));
  dispatch(setHourUpdated(hourIndex));
}

function unsetHourAvailabilityLocation(hourIndex: number, dispatch: Dispatch<any>) {
  dispatch(unsetHourLocation(hourIndex));
  dispatch(setHourUpdated(hourIndex));
}

function validateResponse(res: any) {
  if (!res.ok) {
    throw new Error("FAIL_UPDATE_HOUR");
  }

  return res;
}

function fetchDayDiaryAttempt() {
  return {type: types.FETCH_DAY_DIARY_ATTEMPT};
}

function fetchDayDiarySuccess(diary: any) {
  return {type: types.FETCH_DAY_DIARY_SUCCESS, payload: {diary}};
}

function fetchDayDiaryFail() {
  return {type: types.FETCH_DAY_DIARY_FAIL};
}

function updateHourAvailabilityFail(hourIndex: number) {
  return {type: types.SET_HOUR_UPDATE_FAIL, payload: {hourIndex}};
}

function setHourAvailable(hourIndex: number) {
  return {type: types.SET_HOUR_AVAILABLE, payload: {hourIndex}};
}

function setHourUnavailable(hourIndex: number) {
  return {type: types.SET_HOUR_UNAVAILABLE, payload: {hourIndex}};
}

function setHourUpdating(hourIndex: number) {
  return {type: types.SET_HOUR_UPDATING, payload: {hourIndex}};
}

function setHourUpdated(hourIndex: number) {
  return {type: types.SET_HOUR_UPDATED, payload: {hourIndex}};
}

function setHourLocation(hourIndex: number, location: string) {
  return {type: types.SET_HOUR_LOCATION, payload: {hourIndex, location}};
}

function unsetHourLocation(hourIndex: number) {
  return {type: types.UNSET_HOUR_LOCATION, payload: {hourIndex}};
}
