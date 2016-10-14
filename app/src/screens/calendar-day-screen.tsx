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
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

const moment = require("moment");

export interface Hour {
  hour: number;
  hasBooking?: boolean;
  isAvailable?: boolean;
  nextHourAvailable?: boolean;
  isUpdating?: boolean;
}

export interface Booking {
  id: number;
  postcode: string;
  start: string;
  end: string;
  treatments: string[];
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
  } as TextStyle
});

interface State {
  hoursData?: Hour[];
  bookingsData?: Booking[];
  diaryIsLoading?: boolean;
}

class CalendarDayScreen extends React.Component<any, State> {
  saveButtonHidden = true;

  constructor(props: any) {
    super(props);

    // // checkNextAvailable(hours);

    this.state = {
      hoursData: [],
      bookingsData: [],
      diaryIsLoading: false,
    };

    this.renderHour = this.renderHour.bind(this);
    this.renderBooking = this.renderBooking.bind(this);
  }

  componentDidMount() {
    if (this.props.session.isAuthenticated) {
      this.props.dispatch(calendarActions.fetchDayDiary(this.props.date));
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.calendar.diary !== this.props.calendar.diary) {
      this.setState({
        hoursData: nextProps.calendar.diary.hours,
      });
    }

    this.setState({diaryIsLoading: nextProps.calendar.diaryIsLoading});
  }

  onHourPress(hourIndex: number) {
    this.props.dispatch(calendarActions.toggleHour(this.props.date, hourIndex));
  }

  renderHour(hour: Hour, index: number) {
    let containerStyle = styles.rowContainer;
    let seperatorStyle = styles.rowSeperator;
    let note: JSX.Element;

    if (hour.isAvailable) {
      containerStyle = styles.rowContainerAvailable;

      if (!hour.isUpdating) {
        note = (<Image style={styles.availableIcon} source={require("../../resources/images/calendar/available.png")} />);
      }
    }

    if (hour.isUpdating) {
      note = (<Text style={styles.updating}>UPDATING</Text>);
    }

    // check if this hour or next hour is available
    if (hour.isAvailable || (this.state.hoursData[index + 1] && this.state.hoursData[index + 1].isAvailable)) {
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
    const start = moment(booking.start);
    const end = moment(booking.end);

    // calculate top and height
    const top = Math.floor((start.hour() - 9) * 51 + (start.minute() / 60) * 51);
    const bottom = Math.floor((end.hour() - 9) * 51 + (end.minute() / 60) * 51);
    const minHeight = bottom - top;

    const style = {top, minHeight};

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
    const hours = this.state.hoursData.map(this.renderHour);
    const bookings = this.state.bookingsData.map(this.renderBooking);

    // start at 8 AM
    const yOffset = 8 * 51;

    return (
        <View style={styles.container}>
          <Spinner visible={this.state.diaryIsLoading} />

          <ScrollView
            contentOffset={{y: yOffset, x: 0}}>
            <View>
              {hours}
            </View>
            <View style={styles.bookingsContainer}>
              {bookings}
            </View>
          </ScrollView>
        </View>
    );
  }
}

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    session: state.session,
    calendar: state.calendar,
  };
}

export default connect(mapStateToProps)(CalendarDayScreen);
