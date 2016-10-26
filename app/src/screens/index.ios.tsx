import {Navigation} from "react-native-navigation";

import BookingsScreen from "./bookings-screen";
import BookingScreen from "./booking-screen";
import CalendarScreen from "./calendar-screen";
import CalendarDayScreen from "./calendar-day-screen";
import LoginScreen from "./login-screen";


// register all screens of the app (including internal ones)
export function registerScreens(store: Redux.Store<any>, Provider: typeof ReactRedux.Provider) {
  Navigation.registerComponent("RuubyPA.BookingsScreen", () => BookingsScreen, store, Provider);
  Navigation.registerComponent("RuubyPA.BookingScreen", () => BookingScreen, store, Provider);
  Navigation.registerComponent("RuubyPA.CalendarScreen", () => CalendarScreen, store, Provider);
 Navigation.registerComponent("RuubyPA.CalendarDayScreen", () => CalendarDayScreen, store, Provider);
  Navigation.registerComponent("RuubyPA.LoginScreen", () => LoginScreen, store, Provider);
}
