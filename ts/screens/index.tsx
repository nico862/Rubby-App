import {Navigation} from "react-native-navigation";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";

import BookingsScreen from "./bookings-screen";
import BookingScreen from "./booking-screen";
import CalendarScreen from "./calendar-screen";
import CalendarDayScreen from "./calendar-day-screen";
import UpgradeScreen from "./upgrade-screen";
import LoginScreen from "./login-screen";
import * as screenTypes from "./screen-types";

// register all screens of the app (including internal ones)
export function registerScreens(store: Redux.Store<any>, Provider: typeof ReactRedux.Provider) {
  Navigation.registerComponent(screenTypes.SCREEN_BOOKINGS, () => BookingsScreen, store, Provider);
  Navigation.registerComponent(screenTypes.SCREEN_BOOKING, () => BookingScreen, store, Provider);
  Navigation.registerComponent(screenTypes.SCREEN_CALENDAR, () => CalendarScreen, store, Provider);
  Navigation.registerComponent(screenTypes.SCREEN_CALENDAR_DAY, () => CalendarDayScreen, store, Provider);
  Navigation.registerComponent(screenTypes.SCREEN_LOG_IN, () => LoginScreen, store, Provider);
  Navigation.registerComponent(screenTypes.SCREEN_UPGRADE, () => UpgradeScreen, store, Provider);
}
