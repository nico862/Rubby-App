import * as React from "react";
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  AppState,
  ActionSheetIOS
} from "react-native";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import moment = require("moment");

import * as sessionActions from "../reducers/session/actions";
import * as calendarActions from "../reducers/calendar/actions";
import * as screenTypes from "./screen-types";
import config from "../config";

const circleStyle = {
  height: 36,
  width: 36,
  borderRadius: 18,
  overflow: "hidden",
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
};

const styles = StyleSheet.create({
  button: {
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  dayNames: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    marginBottom: 5,
  } as ViewStyle,
  dayLetterContainer: {
    width: 30,
  } as ViewStyle,
  dayLetter: {
    color: "#666666",
    textAlign: "center",
    alignSelf: "stretch"
  } as TextStyle,
  month: {
    color: "#666666",
    textAlign: "center",
    alignSelf: "stretch",
    marginBottom: 5,
  } as TextStyle,
  week: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    marginBottom: 10,
  } as ViewStyle,

  emptyDay: {
    height: 36,
    width: 36,
  },

  circleOutOfMonth: Object.assign({}, circleStyle, {
    borderWidth: 1,
    borderColor: "#cccccc",
   }) as ViewStyle,
  circleTextOutOfMonth: {
    color: "#cccccc"
  },

  circleHasBookings: Object.assign({}, circleStyle, {
    backgroundColor: "#ddd8d8",
   }) as ViewStyle,
  circleTextHasBookings: {
    color: "black"
  },

  circleIsAvailable: Object.assign({}, circleStyle, {
    backgroundColor: "#fbece9",
   }) as ViewStyle,
  circleTextIsAvailable: {
    color: "black"
  },

  circle: Object.assign({}, circleStyle, {
    borderWidth: 1,
    borderColor: "#333333",
   }) as ViewStyle,
  circleText: {
    color: "#333333"
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  } as TextStyle,
});

interface CalendarScreenProps {
  isAuthenticated: boolean;
  calendar: any;
  iosLoading: boolean;
  navigator: any;
  fetchCalendar: () => any;
  logOut: () => void;
}

interface CalendarScreenState {
  loadDataIntervalId: number;
}

const ACTION_SHEET_BUTTONS = [
  "Log out",
  "Cancel"
];

const LOGOUT_INDEX = 0;
const CANCEL_INDEX = 1;

class CalendarScreen extends React.Component<CalendarScreenProps, CalendarScreenState> {
  static navigatorStyle = {
    navBarBackgroundColor: "#fbece9",
    navBarButtonColor: "black"
  };

  static navigatorButtons = {
    rightButtons: [
      {
        icon: require("../../resources/images/buttons/profile.png"),
        id: "user"
      }
    ]
  };

  constructor(props: CalendarScreenProps) {
    super(props);

    this.state = {
      loadDataIntervalId: null
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._handleAppStateChange = this._handleAppStateChange.bind(this);

    this.renderMonth = this.renderMonth.bind(this);
    this.renderWeek = this.renderWeek.bind(this);
    this.onDayPress = this.onDayPress.bind(this);
  }

  _handleAppStateChange(currentAppState: string) {
    if (currentAppState === "active") {
      this._loadData();
      this._startDataInterval();
    } else if (currentAppState === "inactive") {
      clearInterval(this.state.loadDataIntervalId);
    }
  }

  _startDataInterval() {
    clearInterval(this.state.loadDataIntervalId); // clears this to be safe
    const loadDataIntervalId = setInterval(this._loadData.bind(this), config.timerIntervals.calendar);
    this.setState({ loadDataIntervalId });
  }

  _loadData() {
    if (this.props.isAuthenticated) {
      this.props.fetchCalendar();
    }
  }

  onNavigatorEvent(event: any) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "user") {
        this.showActionSheet();
      }
    }
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this._loadData();
    this._startDataInterval();
  }

  componentWillUnmount() {
    clearInterval(this.state.loadDataIntervalId);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  renderCalendar() {
    return this.props.calendar.map(this.renderMonth);
  }

  renderMonth(month: any) {
    const weeks = month.weeks.map(this.renderWeek);

    const dayHeaders = ["M", "T", "W", "T", "F", "S", "S"].map((day: string, index: number) => {
      return (
        <View style={styles.dayLetterContainer} key={index}>
          <Text style={styles.dayLetter}>{day}</Text>
        </View>
      );
    });

    return(
      <View key={month.name}>
        <Text style={styles.month}>{month.name.toUpperCase()}</Text>
        <View style={styles.dayNames}>
          {dayHeaders}
        </View>

        {weeks}
      </View>
    );
  }

  onDayPress(dateString: string) {
    const date = moment(dateString);

    this.props.navigator.push({
      title: date.format("ddd DD MMM"),
      screen: screenTypes.SCREEN_CALENDAR_DAY,
      backButtonTitle: "Back",
      passProps: {
        date: dateString
      }
    });
  }

  renderWeek(week: any) {
    const days = week.map((day: any) => {
      let circleStyle: ViewStyle;
      let circleTextStyle: TextStyle;
      let clickable = false;

      if (day.notInMonth) {
        return(
          <View style={styles.emptyDay} key={day.date}></View>
        );
      }
      else if (day.isDisabled) {
        circleStyle = styles.circleOutOfMonth;
        circleTextStyle = styles.circleTextOutOfMonth;
      }
      else {
        clickable = true;

        if (day.hasBookings) {
          circleStyle = styles.circleHasBookings;
          circleTextStyle = styles.circleTextHasBookings;
        }
        else if (day.isAvailable) {
          circleStyle = styles.circleIsAvailable;
          circleTextStyle = styles.circleTextIsAvailable;
        }
        else {
          circleStyle = styles.circle;
          circleTextStyle = styles.circleText;
        }
      }

      if (clickable) {
        return (
          <View style={circleStyle} key={day.date}>
            <TouchableHighlight onPress={() => this.onDayPress(day.date)}
              underlayColor="#dddddd"
              style={styles.button}
              key={day.date}>
              <Text style={circleTextStyle}>{day.day}</Text>
            </TouchableHighlight>
          </View>
        );
      }
      else {
        return (
          <View style={circleStyle} key={day.date}>
            <Text style={circleTextStyle}>{day.day}</Text>
          </View>
        );
      }
    });

    const key = week.map((day: any) => day.date).join(":");

    return(
      <View style={styles.week} key={key}>
        {days}
      </View>
    );
  }

  render() {
    return (
        <View style={styles.container}>
          {this.renderCalendar()}
        </View>
    );
  }

  showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
        options: ACTION_SHEET_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: LOGOUT_INDEX,
      },
      (buttonIndex: number) => {
        if (ACTION_SHEET_BUTTONS[LOGOUT_INDEX] === ACTION_SHEET_BUTTONS[buttonIndex]) {
          this.props.logOut();
        }
    });
  }
}

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    isAuthenticated: state.session.isAuthenticated,
    calendar: state.calendar.calendar,
    logOut: sessionActions.logOut
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    fetchCalendar: calendarActions.fetchCalendar
  }, dispatch) as any;
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
