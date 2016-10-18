import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import {Navigation, NavigatorButtonsConfig} from "react-native-navigation";
import thunk from "redux-thunk";

import reducers from "./reducers/index";
import * as sessionActions from "./reducers/session/actions";
import {registerScreens} from "./screens/index.ios";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

registerScreens(store, Provider);

class App {
  currentRootLayout: string;

  constructor() {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(sessionActions.appInitialized());
  }

  onStoreUpdate() {
    const newRootLayout = store.getState().session.rootLayout;
    console.log(newRootLayout);

    if (this.currentRootLayout !== newRootLayout) {
      this.currentRootLayout = newRootLayout;
      this.startApp(newRootLayout);
    }
  }

  startApp(layout: string) {
    switch (layout) {
      case "wait":
        console.log("Waiting for app to start up");

      case "login":
        Navigation.startSingleScreenApp({
          screen: {
            screen: "RuubyPA.LoginScreen",
            title: "Login",
            navigatorStyle: {}
          },
        });

        return;

      case "main":
        Navigation.startTabBasedApp({
          tabs: [
            {
              screen: "RuubyPA.BookingsScreen",
              icon: require("../resources/images/buttons/bookings.png"),
              selectedIcon: require("../resources/images/buttons/bookings.png"),
              title: "Bookings tab",
              overrideBackPress: true,
            },
            {
              screen: "RuubyPA.CalendarScreen",
              icon: require("../resources/images/buttons/calendar.png"),
              selectedIcon: require("../resources/images/buttons/calendar.png"),
              title: "Availability",
            }
          ],
          tabsStyle: {
            tabBarBackgroundColor: "black",
            tabBarButtonColor: "#666666",
            tabBarSelectedButtonColor: "white"
          },
          animationType: "slide-down",
          title: "Ruuby PA",
          appStyle: {
            bottomTabBadgeTextColor: "#ffffff",
            bottomTabBadgeBackgroundColor: "#ff0000",
          }
        });

        return;

      default:
        console.error("Unknown app root");
    }
  }
}

const app = new App();
