import {Navigation} from "react-native-navigation";

import ChatScreen from "./chat-screen";
import BookingsScreen from "./bookings-screen";
import BookingScreen from "./booking-screen";
import AvailabilityScreen from "./availability-screen";

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent("RuubyPa.ChatScreen", () => ChatScreen);
  Navigation.registerComponent("RuubyPa.BookingsScreen", () => BookingsScreen);
  Navigation.registerComponent("RuubyPa.BookingScreen", () => BookingScreen);
  Navigation.registerComponent("RuubyPa.AvailabilityScreen", () => AvailabilityScreen);
}
