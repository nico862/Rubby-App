import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import {Navigation} from "react-native-navigation";
import thunk from "redux-thunk";

import reducers from "./reducers/index";
import * as sessionActions from "./reducers/session/actions";
import {registerScreens} from "./screens/index.ios";
import * as screenTypes from "./screens/screen-types";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

registerScreens(store, Provider);

class App {
  currentRootLayout: string;

  constructor() {
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(sessionActions.initialiseApp());
  }

  onStoreUpdate() {
    const newRootLayout =
      store.getState().session.requireUpgrade ? "upgrade" :
      store.getState().session.isAuthenticated ? "main" : "login";

    if (this.currentRootLayout !== newRootLayout) {
      this.currentRootLayout = newRootLayout;
      this.startApp(newRootLayout);
    }
  }

  startApp(layout: string) {
    switch (layout) {
      case "upgrade":
        Navigation.startSingleScreenApp({
          screen: {
            screen: screenTypes.SCREEN_UPGRADE,
            title: "Upgrade",
            navigatorStyle: {}
          },
        });

        return;

      case "login":
        Navigation.startSingleScreenApp({
          screen: {
            screen: screenTypes.SCREEN_LOG_IN,
            title: "Login",
            navigatorStyle: {}
          },
        });

        return;

      case "main":
        Navigation.startTabBasedApp({
          tabs: [
            {
              screen: screenTypes.SCREEN_BOOKINGS,
              icon: require("../resources/images/buttons/bookings.png"),
              selectedIcon: require("../resources/images/buttons/bookings.png"),
              title: "Bookings",
              label: "Bookings",
              overrideBackPress: true
            },
            {
              screen: screenTypes.SCREEN_CALENDAR,
              icon: require("../resources/images/buttons/calendar.png"),
              selectedIcon: require("../resources/images/buttons/calendar.png"),
              title: "Availability",
              label: "Availability"
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

new App();
