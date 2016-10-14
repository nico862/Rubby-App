import * as bookingsActions from "../reducers/bookings/actions";
import * as sessionActions from "../reducers/session/actions";

import Spinner from "react-native-loading-spinner-overlay";
import * as React from "react";
import {connect} from "react-redux";
import config from "../config";

import { SegmentedControls } from "react-native-radio-buttons";
import {
  Text,
  View,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  ListView
} from "react-native";

const moment = require("moment");

// interface BookingsScreenProps {
//   navigator: any;
// }

// interface BookingsScreenState {
//   selectedIndex?: number;
//   completedBookings?: ListViewDataSource;
//   upcomingBookings?: ListViewDataSource;
//   session: any;
//   visible: boolean;
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  } as TextStyle,
  textContainer: {
    flex: 1
  } as TextStyle,
  separator: {
    height: 1,
    backgroundColor: "#dddddd"
  } as TextStyle,
  time: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold"
  } as TextStyle,
  treatment: {
    fontSize: 14,
    color: "black",
    marginTop: 2,
  } as TextStyle,
  customer: {
    fontSize: 14,
    color: "black",
    marginTop: 2,
  } as TextStyle,
  rowContainer: {
    flexDirection: "row",
    padding: 10
  } as TextStyle,
  segmentedButtons: {
    margin: 10
  },
  noBookingsView: {
    marginTop: 20,
  },
  noBookings: {
    textAlign: "center",
    color: "#666666"
  } as TextStyle,
});

class BookingsScreen extends React.Component<any, any> {
  loadDataIntervalId: any;

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

    let completedBookings = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged,
    });

    let upcomingBookings = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged,
    });

    this.state = {
      selectedIndex: 1,
      completedBookings,
      upcomingBookings,
      bookingsAreLoading: false
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._handleAppStateChange = this._handleAppStateChange.bind(this);

  }

  onNavigatorEvent(event: any) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "user") {
        this.props.dispatch(sessionActions.logout());
      }
    }
  }

  _handleAppStateChange(currentAppState: string) {
    if (currentAppState === "active") {
      this._loadData();
      this._startDataInterval();
    } else if (currentAppState === "inactive") {
      clearInterval(this.loadDataIntervalId);
    }
  }

  _startDataInterval() {
    clearInterval(this.loadDataIntervalId); // clears this to be safe
    this.loadDataIntervalId = setInterval(this._loadData.bind(this), config.timerIntervals.bookings);
  }

  _loadData() {
    if (this.props.session.isAuthenticated) {
      this.props.dispatch(bookingsActions.fetchBookings());
    }
  }

  componentWillUnmount() {
    clearInterval(this.loadDataIntervalId);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this._loadData();
    this._startDataInterval();
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.bookings.bookings !== this.props.bookings.bookings) {
      this.setState({
        completedBookings: this.state.completedBookings.cloneWithRows(nextProps.bookings.bookings.completed),
        upcomingBookings: this.state.upcomingBookings.cloneWithRows(nextProps.bookings.bookings.upcoming)
      });
    }

    this.setState({bookingsAreLoading: nextProps.bookings.loading});
  }

  setSelectedOption(selectedSegment: string, selectedIndex: number) {
    this.setState({
      selectedIndex
    });
  }

  _rowHasChanged(oldRow: any, newRow: any) {
    return oldRow !== newRow;
  }

  renderRow(booking: any, sectionID: string, rowID: string) {
    const dateTime = moment(booking.timeStarts).format("ddd D MMM HH:mm");

    const treatments = booking.bookingTreatments.map((bookingTreatment: any) => {
      return (
        <Text style={styles.treatment} key={bookingTreatment["@id"]}
          numberOfLines={1}>{bookingTreatment.treatment.name} - {bookingTreatment.treatment.durationMinutes} mins</Text>
      );
    });

    return (
      <TouchableHighlight onPress={() => this.onBookingPress(booking)}
        underlayColor="#dddddd">
        <View>
          <View style={styles.rowContainer}>
            <View  style={styles.textContainer}>
              <Text style={styles.time}
                    numberOfLines={1}>{dateTime}</Text>

              <Text style={styles.customer} numberOfLines={1}>
                {booking.customer.firstName} {booking.customer.lastName} - {booking.address.postcode}
              </Text>

              {treatments}
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  onBookingPress(booking: any) {
    this.props.navigator.push({
      title: "Booking",
      screen: "RuubyPA.BookingScreen",
      backButtonTitle: "Back",
      passProps: {
        booking: booking
      }
    });
  }

  renderUpcoming() {
    if ((this.state.selectedIndex === 0) || this.state.bookingsAreLoading) {
      return null;
    }
    else if (this.state.upcomingBookings.getRowCount()) {
      return (
        <ListView
          dataSource={this.state.upcomingBookings}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true} />
      );
    }
    else {
      return (
        <View style={styles.noBookingsView}>
          <Text style={styles.noBookings}>You have no upcoming bookings</Text>
        </View>
      );
    }
  }

  renderCompleted() {
    if ((this.state.selectedIndex === 1) || this.state.bookingsAreLoading) {
      return null;
    }
    else if (this.state.completedBookings.getRowCount()) {
      return (
        <ListView
          dataSource={this.state.completedBookings}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true} />
      );
    }
    else {
      return (
        <View style={styles.noBookingsView}>
          <Text style={styles.noBookings}>You have no upcoming bookings</Text>
        </View>
      );
    }
  }

  // <Spinner visible={this.state.bookingsAreLoading} />

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.segmentedButtons}>
            <SegmentedControls
              options={ ["Completed", "Upcoming"] }
              onSelection={ this.setSelectedOption.bind(this) }
              selectedIndex={ this.state.selectedIndex }
              tint={"black"}
              separatorTint={"black"}
              containerBorderTint={"black"}
            />
          </View>



          { this.renderCompleted() }
          { this.renderUpcoming() }
        </View>
    );
  }
}

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    session: state.session,
    bookings: state.bookings,
  };
}

export default connect(mapStateToProps)(BookingsScreen);
