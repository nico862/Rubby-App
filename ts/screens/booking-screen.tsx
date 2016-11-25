import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableHighlight,
  Linking,
  Dimensions
} from "react-native";
import moment = require("moment");

const windowSize = Dimensions.get("window");
const SIZE_RATIO = windowSize.width >= 375 ? 1.14 : 1;

export interface BookingScreenProps {
  navigator: any;
  booking: any;
}

export interface BookingScreenState {
  booking: any;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  } as TextStyle,
  time: {
    fontSize: 16 * SIZE_RATIO,
    fontWeight: "bold"
  } as TextStyle,
  bodyText: {
    fontSize: 14 * SIZE_RATIO,
  } as TextStyle,
  fieldContainer: {
    marginBottom: 15,
  } as ViewStyle,
  fieldHeading: {
    fontSize: 11 * SIZE_RATIO,
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
    fontSize: 14 * SIZE_RATIO,
  } as TextStyle,
  treatmentName: {
    flex: 1,
    fontSize: 14 * SIZE_RATIO,
  } as TextStyle,
  directionsContainer: {
    backgroundColor: "black",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  } as ViewStyle,
  directionsText: {
    fontSize: 14 * SIZE_RATIO,
    color: "white"
  } as TextStyle
});

export default class BookingScreen extends React.Component<BookingScreenProps, BookingScreenState> {
  constructor() {
    super();
  }

  onChatPress() {
    this.props.navigator.push({
      title: "Chat",
      screen: "RuubyPa.ChatScreen"
    });
  }

  isPastBooking(booking: any) {
    // using booking.timeEnds so that the details of the booking
    // are only hidden once the treatment is over
    return moment(booking.timeEnds).isBefore(moment());
  }

  onGetDirectionsPress(address: any) {
    const encodedAddress = `${address.address1}, ${address.address2}, ${address.postcode}`;
    const url = `http://maps.apple.com/?address=${encodeURIComponent(encodedAddress)}`;
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

    let address2: JSX.Element;
    if (booking.address.address2) {
      address2 = (<Text style={styles.bodyText}>{booking.address.address2}</Text>);
    }

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.headingContainer}><Text style={styles.fieldHeading}>ADDRESS</Text></View>
        <Text style={styles.bodyText}>{booking.address.address1}</Text>
        {address2}
        <Text style={styles.bodyText}>{booking.address.postcode}</Text>
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
        <Text style={styles.bodyText}>{booking.notes || "N/A"}</Text>
      </View>
    );
  }

  renderGetDirections(booking: any) {
    if (this.isPastBooking(booking)) {
      return;
    }

    return (
      <TouchableHighlight style={styles.directionsContainer} onPress={() => this.onGetDirectionsPress(booking.address)}
        underlayColor="#dddddd">
        <Text style={styles.directionsText}>Get directions</Text>
      </TouchableHighlight>
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
            <Text style={styles.bodyText}>{customer.firstName} {customer.lastName}</Text>
          </View>
          <View style={styles.fieldContainer}>
            { treatmentsSection }
          </View>

          <View>
            {this.renderAddress(booking)}
            {this.renderNotes(booking)}
            {this.renderGetDirections(booking)}
          </View>

        </ScrollView>
    );
  }
}
