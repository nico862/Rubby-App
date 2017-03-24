import * as React from "react";
import { SegmentedControls } from "react-native-radio-buttons";
import {
  Text,
  View,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  ListView,
  AppState,
  Dimensions
} from "react-native";
import {Dispatch} from "redux";
import {connect, ConnectClass} from "react-redux";
import {bindActionCreators} from "redux";
import moment = require("moment");

import * as bookingsActions from "../reducers/bookings/actions";
import * as sessionActions from "../reducers/session/actions";
import * as screenTypes from "./screen-types";
import config from "../config";
import ActionSheet from "react-native-actionsheet";

const windowSize = Dimensions.get("window");
const SIZE_RATIO = windowSize.width >= 375 ? 1.14 : 1;

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
    fontSize: 16 * SIZE_RATIO,
    color: "black",
    fontWeight: "bold"
  } as TextStyle,
  treatment: {
    fontSize: 14 * SIZE_RATIO,
    color: "black",
    marginTop: 2,
  } as TextStyle,
  customer: {
    fontSize: 14 * SIZE_RATIO,
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
    color: "#666"
  } as TextStyle,
});

interface BookingsScreenProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  navigator: any;
  fetchBookings: () => any;
  logOut: () => any;
  bookings: any;
}

interface BookingsScreenState {
  loadDataIntervalId?: number;
  selectedIndex?: number;
  completedBookings?: React.ListViewDataSource;
  upcomingBookings?: React.ListViewDataSource;
}

const ACTION_SHEET_BUTTONS = [
  "Log out",
  "Cancel"
];

const LOGOUT_INDEX = 0;
const CANCEL_INDEX = 1;

class BookingsScreen extends React.Component<BookingsScreenProps, BookingsScreenState> {

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

  ActionSheet: any;

  constructor(props: BookingsScreenProps) {
    super(props);

    const completedBookings = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged,
    });

    const upcomingBookings = new ListView.DataSource({
      rowHasChanged: this._rowHasChanged,
    });

    this.state = {
      selectedIndex: 1,
      loadDataIntervalId: null,
      completedBookings,
      upcomingBookings,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentWillReceiveProps(nextProps: BookingsScreenProps) {
    if (nextProps.bookings !== this.props.bookings) {
      this.setState({
        completedBookings: this.state.completedBookings.cloneWithRows(nextProps.bookings.completed),
        upcomingBookings: this.state.upcomingBookings.cloneWithRows(nextProps.bookings.upcoming)
      });
    }
  }

  onNavigatorEvent(event: any) {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "user") {
        this.showActionSheet();
      }
    }
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
    const loadDataIntervalId = setInterval(this._loadData.bind(this), config.timerIntervals.bookings);
    this.setState({ loadDataIntervalId });
  }

  _loadData() {
    if (this.props.isAuthenticated) {
      this.props.fetchBookings();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.loadDataIntervalId);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this._loadData();
    this._startDataInterval();
  }

  setSelectedOption(_selectedSegment: string, selectedIndex: number) {
    this.setState({
      selectedIndex
    });
  }

  _rowHasChanged(oldRow: any, newRow: any) {
    return oldRow !== newRow;
  }

  renderRow(booking: any, _sectionID: string, _rowID: string) {
    const dateTime = moment(booking.timeStarts).format("ddd D MMM HH:mm");

    const treatments = booking.bookingTreatments.map((bookingTreatment: any) => {
      return (
        <Text style={styles.treatment} key={bookingTreatment["@id"]}
          numberOfLines={1}>{bookingTreatment.treatment.name}</Text>
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
      screen: screenTypes.SCREEN_BOOKING,
      backButtonTitle: "Back",
      passProps: {
        booking: booking
      }
    });
  }

  renderUpcoming() {
    if (this.state.selectedIndex === 0) {
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
    if (this.state.selectedIndex === 1) {
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
          <Text style={styles.noBookings}>You have no completed bookings</Text>
        </View>
      );
    }
  }

  renderActionSheet() {
    const onPress = (buttonIndex: number) => {
      if (ACTION_SHEET_BUTTONS[LOGOUT_INDEX] === ACTION_SHEET_BUTTONS[buttonIndex]) {
        this.props.logOut();
      }};

    return (
      <ActionSheet
        ref={(o: any) => this.ActionSheet = o}
        options={ACTION_SHEET_BUTTONS}
        cancelButtonIndex={CANCEL_INDEX}
        destructiveButtonIndex={LOGOUT_INDEX}
        onPress={onPress}
      />
    );
  }

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
          { this.renderActionSheet() }
        </View>
    );
  }

  showActionSheet() {
    this.ActionSheet.show();
  }
}

function mapStateToProps(state: any) {
  return {
    isAuthenticated: state.session.isAuthenticated,
    bookings: state.bookings.bookings,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    fetchBookings: bookingsActions.fetchBookings,
    logOut: sessionActions.logOut,
  }, dispatch) as any;
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsScreen) as ConnectClass<any, any>;
