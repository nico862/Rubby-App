import * as reactRedux from "react-redux";
import * as moment from "moment";
import "moment-timezone";

import * as types from "./action-types";
import * as calendarApi from "../../api/calendar";
import {handleApiError} from "../util";
import config from "../../config";

declare const fetch: (url: string, options?: Object) => Promise<any>;

export function fetchCalendar(): (dispatch: reactRedux.Dispatch<any>) => void  {
  return (dispatch: reactRedux.Dispatch<any>) => {
    dispatch(fetchCalendarAttempt());

    calendarApi.getCalendar()
      .then(data => dispatch(fetchCalendarSuccess(data)))
      .catch(handleApiError.bind(null, dispatch, fetchCalendarFail));
  };
}


export function fetchDayDiary(date: string): (dispatch: reactRedux.Dispatch<any>) => void {
  return (dispatch: reactRedux.Dispatch<any>) => {
    dispatch(fetchDayDiaryAttempt());

    calendarApi.getCalendarDay(date)
      .then(data => dispatch(fetchDayDiarySuccess(data)))
      .catch(handleApiError.bind(null, dispatch, fetchDayDiaryFail));
  };
}

export function toggleHour(dateString: string, hourIndex: number): (dispatch: reactRedux.Dispatch<any>, getState: any) => void  {
  return (dispatch: reactRedux.Dispatch<any>, getState: any) => {
    const hours = getState().calendar.diary.hours;
    const selectedHour = hours[hourIndex];

    const timeStarts = moment(dateString).tz(config.timezone).add(selectedHour.hour, "hour");

    if (!hours[hourIndex].isAvailable) {
      dispatch(setHourAvailable(hourIndex));

      calendarApi.setHourAvailable(timeStarts)
        .then(setHourAvailabilityLocation.bind(null, hourIndex, dispatch))
        .catch(handleApiError.bind(null, dispatch, updateHourAvailabilityFail.bind(null, hourIndex)));
    }
    else {
      dispatch(setHourUnavailable(hourIndex));

      calendarApi.setHourUnavailable(selectedHour.location)
        .then(validateResponse)
        .then(unsetHourAvailabilityLocation.bind(null, hourIndex, dispatch))
        .catch(handleApiError.bind(null, dispatch, updateHourAvailabilityFail.bind(null, hourIndex)));
    }

    dispatch(setHourUpdating(hourIndex));
  };
}

function setHourAvailabilityLocation(hourIndex: number, dispatch: reactRedux.Dispatch<any>, res: any) {
  dispatch(setHourLocation(hourIndex, res.headers.get("Location")));
  dispatch(setHourUpdated(hourIndex));
}

function unsetHourAvailabilityLocation(hourIndex: number, dispatch: reactRedux.Dispatch<any>) {
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
  return {type: types.FETCH_DAY_DIARY_SUCCESS, diary};
}

function fetchDayDiaryFail(err: Error) {
  return {type: types.FETCH_DAY_DIARY_FAIL};
}

function fetchCalendarAttempt() {
  return {type: types.FETCH_CALENDAR_ATTEMPT};
}

function fetchCalendarSuccess(calendar: any) {
  return {type: types.FETCH_CALENDAR_SUCCESS, calendar};
}

function fetchCalendarFail(err: Error) {
  return {type: types.FETCH_CALENDAR_FAIL};
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
