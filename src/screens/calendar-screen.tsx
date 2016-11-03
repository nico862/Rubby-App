import * as sessionActions from "../reducers/session/actions";
import * as calendarActions from "../reducers/calendar/actions";

import * as React from "react";
import {connect} from "react-redux";
import config from "../config";

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

const moment = require("moment");

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

const ACTION_SHEET_BUTTONS = [
  "Log out",
  "Cancel"
];

const LOGOUT_INDEX = 0;
const CANCEL_INDEX = 1;

class CalendarScreen extends React.Component<any, any> {
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

  constructor(props: any) {
    super(props);

    this.state = {
      selectedIndex: 1,
      calendarData: [],
      calendarLoading: false,
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
    if (this.props.session.isAuthenticated) {
      this.props.dispatch(calendarActions.fetchCalendar());
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

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.calendar.calendar !== this.props.calendar.calendar) {
      this.setState({
        calendarData: nextProps.calendar.calendar,
      });
    }

    this.setState({calendarLoading: nextProps.calendar.loading});
  }

  renderCalendar() {
    return this.state.calendarData.map(this.renderMonth);
  }

  renderMonth(month: any) {
    const weeks = month.weeks.map(this.renderWeek);

    return(
      <View key={month.name}>
        <Text style={styles.month}>{month.name.toUpperCase()}</Text>
        <View style={styles.dayNames}>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>M</Text></View>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>T</Text></View>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>W</Text></View>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>T</Text></View>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>F</Text></View>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>S</Text></View>
          <View style={styles.dayLetterContainer}><Text style={styles.dayLetter}>S</Text></View>
        </View>

        {weeks}
      </View>
    );
  }

  onDayPress(dateString: string) {
    const date = moment(dateString);

    this.props.navigator.push({
      title: date.format("ddd DD MMM"),
      screen: "RuubyPA.CalendarDayScreen",
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
          this.props.dispatch(sessionActions.logout());
        }
    });
  }
}

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    session: state.session,
    calendar: state.calendar,
  };
}

export default connect(mapStateToProps)(CalendarScreen);
