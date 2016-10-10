import {Navigation} from "react-native-navigation";

// this will start our app
export default Navigation.startTabBasedApp({
  tabs: [
    {
      label: "Bookings",
      screen: "RuubyPA.BookingsScreen",
      icon: require("../img/one.png"),
      selectedIcon: require("../img/one_selected.png"),
      title: "Bookings"
    },
    {
      label: "Availability",
      screen: "RuubyPA.AvailabilityScreen",
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