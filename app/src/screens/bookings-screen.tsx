import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  ListView,
  ListViewDataSource,
} from "react-native";
import { SegmentedControls } from "react-native-radio-buttons";
const moment = require("moment");

interface BookingsScreenProps {
  navigator: any;
}

interface BookingsScreenState {
  selectedIndex?: number;
  dataSource?: ListViewDataSource;
}

const bookings = [
  {
    id: 1,
    time: "2016-10-01T13:00:00+01",
    durationMinutes: 60,
    treatmentName: "Massage",
    customerName: "Pete Smith",
    address: {
      address1: "11 Edith Grove",
      town: "London",
      postcode: "SW10 0JZ"
    }
  },
  {
    id: 2,
    time: "2016-10-01T16:00:00+01",
    durationMinutes: 60,
    treatmentName: "Massage",
    customerName: "Pete Smith",
    address: {
      address1: "11 Edith Grove",
      town: "London",
      postcode: "SW10 0JZ"
    }
  },
  {
    id: 3,
    time: "2016-10-02T09:00:00+01",
    durationMinutes: 60,
    treatmentName: "Massage",
    customerName: "Pete Smith",
    address: {
      address1: "11 Edith Grove",
      town: "London",
      postcode: "SW10 0JZ"
    }
  },
  {
    id: 4,
    time: "2016-10-02T10:30:00+01",
    durationMinutes: 60,
    treatmentName: "Massage",
    customerName: "Pete Smith",
    address: {
      address1: "11 Edith Grove",
      town: "London",
      postcode: "SW10 0JZ"
    }
  },
  {
    id: 5,
    time: "2016-10-03T16:00:00+01",
    durationMinutes: 60,
    treatmentName: "Massage",
    customerName: "Pete Smith",
    address: {
      address1: "11 Edith Grove",
      town: "London",
      postcode: "SW10 0JZ"
    }
  },
  {
    id: 6,
    time: "2016-10-07T09:40:00+01",
    durationMinutes: 60,
    treatmentName: "Massage",
    customerName: "Pete Smith",
    address: {
      address1: "11 Edith Grove",
      town: "London",
      postcode: "SW10 0JZ"
    }
  },
];

export default class BookingsScreen extends React.Component<BookingsScreenProps, BookingsScreenState> {
  static navigatorStyle = {
    navBarBackgroundColor: "#fbece9",
    navBarButtonColor: "black"
  };

  constructor() {
    super();

    const dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id}
    );

    this.state = {
      selectedIndex: 1,
      dataSource: dataSource.cloneWithRows(bookings)
    };
  }

  setSelectedOption(selectedSegment, selectedIndex) {
    this.setState({
      selectedIndex
    });
  }

  renderRow(rowData, sectionID, rowID) {
    const dateTime = moment(rowData.time).format("ddd D MMM HH:mm");

    return (
      <TouchableHighlight onPress={() => this.onBookingPress(rowData.id)}
        underlayColor="#dddddd">
        <View>
          <View style={styles.rowContainer}>
            <View  style={styles.textContainer}>
              <Text style={styles.time}
                    numberOfLines={1}>{dateTime}</Text>

              <Text style={styles.treatment}
                    numberOfLines={1}>{rowData.treatmentName} - {rowData.durationMinutes} mins</Text>

              <Text style={styles.customer} numberOfLines={1}>
                {rowData.customerName} - {rowData.address.postcode}
              </Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  onBookingPress(id: number) {
    this.props.navigator.push({
      title: "Booking",
      screen: "RuubyPa.BookingScreen"
    });
  }

  render() {
    const options = ["Completed", "Upcoming"];
    return (
        <View style={styles.container}>
          <View style={styles.segmentedButtons}>
            <SegmentedControls
              options={ options }
              onSelection={ this.setSelectedOption.bind(this) }
              selectedIndex={ this.state.selectedIndex }
              tint={"black"}
              separatorTint={"black"}
              containerBorderTint={"black"}
            />
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}/>
        </View>
    );
  }
}

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
  }
});
