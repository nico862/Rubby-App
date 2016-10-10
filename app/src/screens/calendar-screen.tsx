import * as sessionActions from "../reducers/session/actions";
import * as calendarActions from "../reducers/calendar/actions";

import * as React from "react";
import {connect} from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

const moment = require("moment");

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
      calendarLoading: false
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.renderMonth = this.renderMonth.bind(this);
    this.renderWeek = this.renderWeek.bind(this);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onNavigatorEvent(event: any) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "user") {
        this.props.dispatch(sessionActions.logout());
      }
    }
  }

  componentDidMount() {
    if (this.props.session.isAuthenticated) {
      this.props.dispatch(calendarActions.fetchCalendar());
    }
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

      if (day.isDisabled) {
        return(
          <View style={styles.emptyDay} key={day.date}></View>
        );
      }
      else if (day.notInMonth) {
        circleStyle = styles.circleOutOfMonth;
        circleTextStyle = styles.circleTextOutOfMonth;
      }
      else {
        clickable = true;

        if (day.hasBookings) {
          circleStyle = styles.circleHasBookings;
          circleTextStyle = styles.circleTextHasBookings;
        }
        else {
          circleStyle = styles.circle;
          circleTextStyle = styles.circleText;
        }
      }

      const circle = (
        <View style={circleStyle} key={day.date}>
          <Text style={circleTextStyle}>{day.day}</Text>
        </View>
      );

      if (clickable) {
        return (
          <TouchableHighlight onPress={() => this.onDayPress(day.date)}
            underlayColor="#dddddd"
            key={day.date}>
            {circle}
          </TouchableHighlight>
        );
      }

      return circle;
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
          <Spinner visible={this.state.bookingsAreLoading} />

          {this.renderCalendar()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
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
    height: 30,
    width: 30,
  },

  circleDisabled: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#aaaaaa",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  circleTextDisabled: {
    color: "#aaaaaa"
  },

  circleOutOfMonth: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#cccccc",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  circleTextOutOfMonth: {
    color: "#cccccc"
  },

  circleHasBookings: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "#fbece9",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  circleTextHasBookings: {
    color: "black"
  },

  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    // backgroundColor: "#ff0000",
    borderWidth: 1,
    borderColor: "#333333",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  circleText: {
    color: "#333333"
  },

  container: {
    flex: 1,
    // flexDirection: "column",
    backgroundColor: "white",
    padding: 10,
    // alignItems: "flex-start",
  } as TextStyle,
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#656565"
  } as TextStyle,
});

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    session: state.session,
    calendar: state.calendar,
  };
}

export default connect(mapStateToProps)(CalendarScreen);
