import * as si from "seamless-immutable";

import * as types from "./action-types";

const emptyDiary: any = {
  bookings: [],
  hours: [],
};

const initialState = si.from({
  calendar: [],
  diary: emptyDiary,
});

export default function calendar(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.FETCH_CALENDAR_SUCCESS:
      return state.merge({
        calendar: action.calendar,
        diaryIsLoading: false,
      });

    case types.FETCH_DAY_DIARY_ATTEMPT:
      return state.merge({
        diary: emptyDiary,
        diaryIsLoading: true,
        diaryLoadError: false,
      });

    case types.FETCH_DAY_DIARY_SUCCESS:
      return state.merge({
        diary: action.diary,
        diaryIsLoading: false,
        diaryLoadError: false,
      });

    case types.FETCH_DAY_DIARY_FAIL:
      return state.merge({
        diary: emptyDiary,
        diaryIsLoading: false,
        diaryLoadError: true,
      });

    case types.SET_HOUR_AVAILABLE:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "isAvailable"], true);

    case types.SET_HOUR_UNAVAILABLE:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "isAvailable"], false);

    case types.SET_HOUR_UPDATING:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "isUpdating"], true)
        .setIn(["diary", "hours", action.payload.hourIndex, "hasErrored"], false);

    case types.SET_HOUR_UPDATED:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "isUpdating"], false);

    case types.SET_HOUR_UPDATE_FAIL:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "hasErrored"], true);

    case types.SET_HOUR_LOCATION:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "location"], action.payload.location);

    case types.UNSET_HOUR_LOCATION:
      return state
        .setIn(["diary", "hours", action.payload.hourIndex, "location"], null);

    default:
      return state;
  }
}