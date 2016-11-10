import * as si from "seamless-immutable";

import * as types from "./action-types";

const emptyDiary: any = {
  bookings: [],
  hours: [],
};

const initialState = si.from({
  diary: emptyDiary,
});

export default function calendarDay(state: any = initialState, action: any = {}): any {
  switch (action.type) {
    case types.FETCH_DAY_DIARY_ATTEMPT:
      return state.merge({
        diary: emptyDiary,
        isLoading: true,
        loadingError: false,
      });

    case types.FETCH_DAY_DIARY_SUCCESS:
      return state.merge({
        diary: action.payload.diary,
        isLoading: false,
        loadingError: false,
      });

    case types.FETCH_DAY_DIARY_FAIL:
      return state.merge({
        diary: emptyDiary,
        isLoading: false,
        loadingError: true,
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
        .setIn(["diary", "hours", action.payload.hourIndex, "isUpdating"], false)
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
