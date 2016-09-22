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

interface BookingScreenProps {
  navigator: any;
}

interface BookingScreenState {
  booking: any;
}

const booking = {
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
};

export default class BookingScreen extends React.Component<BookingScreenProps, BookingScreenState> {
  constructor() {
    super();

    this.state = {
      booking
    };
  }

  onChatPress() {
    this.props.navigator.push({
      title: "Chat",
      screen: "RuubyPa.ChatScreen"
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <TouchableHighlight
            onPress={this.onChatPress.bind(this)}
            style={styles.button}
            underlayColor="#333333">
            <Text style={styles.buttonText}>Chat with customer</Text>
          </TouchableHighlight>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  } as TextStyle,
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  } as TextStyle,
  button: {
    height: 36,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  } as TextStyle,
});
