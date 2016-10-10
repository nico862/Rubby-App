import * as sessionActions from "../reducers/session/actions";
import * as calendarActions from "../reducers/calendar/actions";

import * as React from "react";
import {connect} from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Image,
  Animated,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

const moment = require("moment");

export interface Hour {
  hour: number;
  hasBooking?: boolean;
  available?: boolean;
  nextHourAvailable?: boolean;
}

export interface Booking {
  id: number;
  postcode: string;
  start: string;
  end: string;
  treatments: string[];
}

function checkNextAvailable(hours: Hour[]) {
  hours.forEach((hour, index, hours) => {
    hour.nextHourAvailable = hours[index + 1] && hours[index + 1].available;
  });
}

class CalendarDayScreen extends React.Component<any, any> {
  saveButtonHidden = true;

  constructor(props: any) {
    super(props);

    const hours: Hour[] = [
      {hour: 9, hasBooking: true},
      {hour: 10, hasBooking: true},
      {hour: 11, hasBooking: true},
      {hour: 12, hasBooking: true},
      {hour: 13},
      {hour: 14},
      {hour: 15, available: true},
      {hour: 16, available: true},
      {hour: 17, available: true},
      {hour: 18, available: true},
      {hour: 19, available: true},
    ];

    checkNextAvailable(hours);

    const bookings: Booking[] = [
      {
        id: 1,
        postcode: "SW5",
        treatments: ["Back massage"],
        start: "2016-10-07T09:45:00+01:00",
        end: "2016-10-07T11:00:00+01:00",
      },
      {
        id: 3,
        postcode: "SW11",
        treatments: [
          "Massage: 90 mins",
          "Another"
        ],
        start: "2016-10-07T10:00:00+01:00",
        end: "2016-10-07T12:45:00+01:00",
      }
    ];

    this.state = {
      hours,
      bookings,
      bounceValue: new Animated.Value(0),
    };

    this.renderHour = this.renderHour.bind(this);
    this.renderBooking = this.renderBooking.bind(this);
  }

  onHourPress(hour: Hour) {
    const hours: Hour[] = this.state.hours;
    hours.forEach(thisHour => {
      if (thisHour.hour === hour.hour) {
        thisHour.available = !thisHour.available;
      }
    });

    checkNextAvailable(hours);

    this.setState({hours});
    this._toggleSubview();
  }

  _toggleSubview() {
    let toValue = 50;

    if (this.saveButtonHidden) {
      toValue = 0;
    }

    // This will animate the transalteY of the subview between 0 & 100 depending on its current state
    // 100 comes from the style below, which is the height of the subview.
    Animated.spring(
      this.state.bounceValue,
      {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }
    ).start();

    this.saveButtonHidden = !this.saveButtonHidden;
  }

  renderHour(hour: Hour) {
    let containerStyle = styles.rowContainer;
    let seperatorStyle = styles.rowSeperator;
    let image: JSX.Element;

    if (hour.available) {
      containerStyle = styles.rowContainerAvailable;
      seperatorStyle = styles.rowSeperatorAvailable;
      image = (<Image style={styles.availableIcon} source={require("../../resources/images/calendar/available.png")} />);
    }
    else if (hour.nextHourAvailable) {
     seperatorStyle = styles.rowSeperatorAvailable;
    }

    const hourView = (
      <View style={styles.hourContainer} key={hour.hour}>
        <View style={containerStyle}>
          <View  style={styles.hourNumberContainer}>
            <Text style={styles.hourText}>{hour.hour}</Text>
            <Text style={styles.minuteText}>:00</Text>
          </View>
          {image}
        </View>
        <View style={seperatorStyle}/>
      </View>
    );

    if (hour.hasBooking) {
      return hourView;
    }
    else {
      return (
        <TouchableHighlight
          onPress={() => this.onHourPress(hour)}
          underlayColor="#dddddd"
          key={hour.hour}>
          {hourView}
        </TouchableHighlight>
      );
    }
  }

  renderBooking(booking: Booking) {
    const start = moment(booking.start);
    const end = moment(booking.end);

    const top = Math.floor((start.hour() - 9) * 51 + (start.minute() / 60) * 51);
    const bottom = Math.floor((end.hour() - 9) * 51 + (end.minute() / 60) * 51);
    const height = (bottom - top < 25) ? 25 : bottom - top;

    const style = {top, height};

    const treatment = (booking.treatments.length > 1)
      ? `${booking.treatments.length} treatments`
      : booking.treatments[0];

    return(
      <View style={[styles.booking, style]} key={booking.id}>
        <View style={styles.bookingHeader}>
          <Text style={[styles.bookingHour, styles.bookingText]}>
            {start.format("H:mm")} - {end.format("H:mm")}
          </Text>
          <Text style={styles.bookingText}>{booking.postcode}</Text>
        </View>
        <Text style={[styles.bookingTreatment, styles.bookingText]} numberOfLines={1}>
          {treatment}
        </Text>
      </View>
    );
  }

  render() {
    const rows = this.state.hours.map(this.renderHour);
    const bookings = this.state.bookings.map(this.renderBooking);
    const saveButtonStyle = {
      transform: [{translateY: this.state.bounceValue}]
    };

    return (
        <View style={styles.container}>
          <ScrollView>
            <View>
              {rows}
            </View>
            <View style={styles.bookingsContainer}>
              {bookings}
            </View>
          </ScrollView>
          <Animated.View style={[styles.saveButtonContainer, saveButtonStyle]}>
            <TouchableHighlight
              underlayColor="#dddddd"
              style={styles.saveButton}
              >
              <Text style={styles.saveButtonText}>SAVE</Text>
            </TouchableHighlight>
          </Animated.View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  } as ViewStyle,
  saveButton: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  } as ViewStyle,
  saveButtonText: {
    color: "white",
    fontWeight: "bold"
  } as TextStyle,

  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative"
  } as TextStyle,

  hoursContainer: {
    position: "absolute",
    flex: 1,
  } as ViewStyle,

  hourContainer: {
    position: "relative",
    flex: 1,
  } as ViewStyle,

  bookingsContainer: {
    position: "absolute",
    top: 0,
    left: 60,
    right: 10,
    alignItems: "stretch"
  } as ViewStyle,

  booking: {
    position: "absolute",
    backgroundColor: "#ddd8d8",
    borderRadius: 10,
    padding: 7,
    left: 0,
    right: 0,
  } as ViewStyle,

  bookingText: {
    color: "#666060"
  },

  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,

  bookingHour: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  } as TextStyle,

  bookingTreatment: {
    fontSize: 10,
  } as TextStyle,

  textContainer: {
    flex: 1
  } as TextStyle,
  rowSeperator: {
    height: 1,
    backgroundColor: "#dddddd"
  } as TextStyle,
  rowSeperatorAvailable: {
    height: 1,
    backgroundColor: "white"
  } as TextStyle,
  rowContainer: {
    flexDirection: "row",
    height: 50
  } as ViewStyle,
  rowContainerAvailable: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "#fbece9",
    justifyContent: "space-between",
    alignItems: "center"
  } as ViewStyle,

  hourNumberContainer: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  } as ViewStyle,

  hourText: {
    fontSize: 20,
    fontWeight: "bold"
  } as TextStyle,
  minuteText: {
    fontSize: 10
  } as TextStyle,

  availableIcon: {
    width: 25,
    height: 25,
    tintColor: "#b68f87",
    right: 10,
  }
});

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    session: state.session,
    calendar: state.calendar,
  };
}

export default connect(mapStateToProps)(CalendarDayScreen);