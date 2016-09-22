import {Navigation} from "react-native-navigation";

// screen related book keeping
import {registerScreens} from "./screens/index.ios";
registerScreens();

// this will start our app
Navigation.startTabBasedApp({
  tabs: [
    {
      label: "Bookings",
      screen: "RuubyPa.BookingsScreen",
      icon: require("../img/one.png"),
      selectedIcon: require("../img/one_selected.png"),
      title: "Bookings"
    },
    {
      label: "Availability",
      screen: "RuubyPa.AvailabilityScreen",
      icon: require("../img/two.png"),
      selectedIcon: require("../img/two_selected.png"),
      title: "Availability"
    }
  ],
  tabsStyle: {
    tabBarButtonColor: "rgb(200, 200, 200)",
    tabBarBackgroundColor: "black",
    tabBarSelectedButtonColor: "white"
  }
});