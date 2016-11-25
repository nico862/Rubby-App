import * as React from "react";
import {
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  ActivityIndicator
} from "react-native";
import {connect, ConnectClass} from "react-redux";
import {Dispatch} from "redux";
import {bindActionCreators} from "redux";
import moment = require("moment");

import * as calendarDayActions from "../reducers/calendar-day/actions";
import * as screenTypes from "./screen-types";

export interface Hour {
  hour: number;
  hasBooking?: boolean;
  isAvailable?: boolean;
  nextHourAvailable?: boolean;
  isUpdating?: boolean;
  hasErrored?: boolean;
}

export interface Booking {
  id: number;
  postcode: string;
  timeStarts: string;
  timeEnds: string;
  treatments: string[];
  bookingTreatments: any[];
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
    height: 50,
    justifyContent: "space-between",
    alignItems: "center"
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
  },

  updating: {
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: 11,
    right: 10,
  } as TextStyle,

  error: {
    color: "rgba(200, 0, 0, 0.3)",
    fontSize: 11,
    right: 10,
  } as TextStyle,

  feedbackContainer: {
    marginTop: 20,
    alignItems: "center"
  } as ViewStyle,

  apiFailIcon: {
    width: 64,
    height: 64,
    tintColor: "#666"
  } as ImageStyle,

  feedbackText: {
    color: "#666",
    fontSize: 14,
  }
});

interface CalendarDayScreenProps {
  date: string;
  isLoading: boolean;
  loadError: boolean;
  isAuthenticated: boolean;
  hours: Hour[];
  bookings: Booking[];
  navigator: any;
  fetchDayDiary: (date: string) => any;
  toggleHour: (date: string, hourIndex: number) => void;
}

class CalendarDayScreen extends React.Component<CalendarDayScreenProps, {}> {
  saveButtonHidden = true;

  constructor(props: any) {
    super(props);

    this.renderHour = this.renderHour.bind(this);
    this.renderBooking = this.renderBooking.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.fetchDayDiary(this.props.date);
    }
  }

  onHourPress(hourIndex: number) {
    this.props.toggleHour(this.props.date, hourIndex);
  }

  onBookingPress(booking: any) {
    this.props.navigator.push({
      title: "Booking",
      screen: screenTypes.SCREEN_BOOKING,
      backButtonTitle: "Back",
      passProps: {
        booking: booking
      }
    });
  }

  renderHour(hour: Hour, index: number) {
    let containerStyle = styles.rowContainer;
    let seperatorStyle = styles.rowSeperator;
    let note: JSX.Element;

    if (hour.isAvailable) {
      if (!hour.hasBooking) {
        containerStyle = styles.rowContainerAvailable;
      }

      if (!hour.hasBooking && !hour.isUpdating) {
        note = (<Image style={styles.availableIcon} source={require("../../resources/images/calendar/available.png")} />);
      }
    }

    if (hour.isUpdating) {
      note = (<Text style={styles.updating}>UPDATING</Text>);
    }
    else if (hour.hasErrored) {
      note = (<Text style={styles.error}>ERROR UPDATING</Text>);
    }

    // check if this hour or next hour is available
    if (!hour.hasBooking && (hour.isAvailable || (this.props.hours[index + 1] && this.props.hours[index + 1].isAvailable && !this.props.hours[index + 1].hasBooking))) {
      seperatorStyle = styles.rowSeperatorAvailable;
    }

    const hourView = (
      <View style={styles.hourContainer} key={hour.hour}>
        <View style={containerStyle}>
          <View  style={styles.hourNumberContainer}>
            <Text style={styles.hourText}>{hour.hour}</Text>
            <Text style={styles.minuteText}>:00</Text>
          </View>
          {note}
        </View>
        <View style={seperatorStyle}/>
      </View>
    );

    if (hour.hasBooking || hour.isUpdating) {
      return hourView;
    }
    else {
      return (
        <TouchableHighlight
          onPress={() => this.onHourPress(index)}
          underlayColor="#dddddd"
          key={hour.hour}>
          {hourView}
        </TouchableHighlight>
      );
    }
  }

  renderBooking(booking: Booking) {
    const start = moment(booking.timeStarts);
    const end = moment(booking.timeEnds);

    // calculate top and height
    const top = Math.floor((start.hour()) * 51 + (start.minute() / 60) * 51);
    const bottom = Math.floor((end.hour()) * 51 + (end.minute() / 60) * 51);
    const minHeight = bottom - top;

    const style = {top, minHeight};

    const treatment = (booking.bookingTreatments.length > 1)
      ? `${booking.bookingTreatments.length} treatments`
      : booking.bookingTreatments[0].treatment.name;

    return(
      <TouchableHighlight key={booking["@id"]} onPress={() => this.onBookingPress(booking)} underlayColor="#dddddd">
        <View style={[styles.booking, style]}>
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
      </TouchableHighlight>
    );
  }

  render() {
    let content: JSX.Element;

    if (this.props.isLoading) {
      content = (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator animating={true} size={"large"}></ActivityIndicator>
        </View>
      );
    }
    else if (this.props.loadError) {
      content = (
        <View style={styles.feedbackContainer}>
          <Image style={styles.apiFailIcon} source={require("../../resources/images/sad.png")} />
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>Sorry! I could not load your diary.</Text>
            <Text style={styles.feedbackText}>Please try again.</Text>
          </View>
        </View>
      );
    }
    else {
      // start at 8 AM
      const yOffset = 8 * 51;

      const hours = this.props.hours.map(this.renderHour);
      const bookings = this.props.bookings.map(this.renderBooking);

      content = (
          <ScrollView
            contentOffset={{y: yOffset, x: 0}}>
            <View>
              {hours}
            </View>
            <View style={styles.bookingsContainer}>
              { bookings}
            </View>
          </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
          {content}
        </View>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    isAuthenticated: state.session.isAuthenticated,
    isLoading: state.calendarDay.isLoading,
    hours: state.calendarDay.diary.hours,
    bookings: state.calendarDay.diary.bookings
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    fetchDayDiary: calendarDayActions.fetchDayDiary,
    toggleHour: calendarDayActions.toggleHour,
  }, dispatch) as any;
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarDayScreen) as ConnectClass<any, any>;
