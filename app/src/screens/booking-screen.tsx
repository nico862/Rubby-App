import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableHighlight,
  MapView,
  Linking
} from "react-native";
import { SegmentedControls } from "react-native-radio-buttons";
const moment = require("moment");

interface BookingScreenProps {
  navigator: any;
  booking: any;
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

  isPastBooking(booking: any) {
    return moment(booking.timeEnds).isBefore(moment());
  }

  onViewMapsPress(address: any) {
    const url = `http://maps.apple.com/?address=${address.postcode}`;
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log("Can\'t handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
    }).catch(err => console.error("An error occurred", err));
  }

  renderAddress(booking: any) {
    if (this.isPastBooking(booking)) {
      return;
    }

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.headingContainer}><Text style={styles.fieldHeading}>ADDRESS</Text></View>
        <Text>{booking.address.address1}</Text>
        <Text>{booking.address.address2}</Text>
        <Text>{booking.address.postcode}</Text>
      </View>
    );
  }

  renderNotes(booking: any) {
    if (this.isPastBooking(booking)) {
      return;
    }

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.headingContainer}><Text style={styles.fieldHeading}>NOTES</Text></View>
        <Text>{booking.notes || "N\\A"}</Text>
      </View>
    );
  }

  renderMaps(booking: any) {
    if (this.isPastBooking(booking)) {
      return;
    }

    return (
      <MapView
        style={{height: 200, margin: 40}}
        showsUserLocation={true}
        overlays={[]}

        followUserLocation={true}
      />
    );
  }

  renderOpenInMaps(booking: any) {
    if (this.isPastBooking(booking)) {
      return;
    }

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => this.onViewMapsPress(booking.address)}
          underlayColor="#dddddd">
          <View>
            <Text>Get directions</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const booking = this.props.booking;
    const customer = booking.customer;
    const treatments = booking.bookingTreatments.map((bookingTreatment: any) => bookingTreatment.treatment);

    const treatmentsSection = treatments.map((treatment: any) => {
      return (
        <View key={treatment["@id"]} style={styles.treatmentContainer}>
          <Text style={styles.treatmentName} numberOfLines={1}>{treatment.name}</Text>
          <Text style={styles.treatmentPrice}>£{treatment.price}</Text>
        </View>
      );
    });

    return (
        <ScrollView style={styles.container}>
          <View style={styles.fieldContainer}>
            <Text style={styles.time}>{moment(booking.timeStarts).format("ddd D MMM, HH:mm")}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text>{customer.firstName} {customer.lastName}</Text>
          </View>
          <View style={styles.fieldContainer}>
            { treatmentsSection }
          </View>

          <View>
            {this.renderAddress(booking)}
            {this.renderNotes(booking)}
            {this.renderOpenInMaps(booking)}
            {this.renderMaps(booking)}
          </View>

        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  } as TextStyle,
  time: {
    fontSize: 16,
    fontWeight: "bold"
  } as TextStyle,
  fieldContainer: {
    marginBottom: 15,
  } as ViewStyle,
  fieldHeading: {
    fontSize: 11,
    color: "#666666"
  } as TextStyle,
  headingContainer: {
    marginBottom: 3,
  } as ViewStyle,
  treatmentContainer: {
    flex: 1,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between"
  } as ViewStyle,
  treatmentPrice: {
    // flex: 1,
  } as TextStyle,
  treatmentName: {
    flex: 1,
  } as TextStyle

});
