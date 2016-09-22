import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextStyle,
} from "react-native";

export default class AvailabilityScreen extends React.Component<any, any> {
  static navigatorStyle = {
    navBarBackgroundColor: "#fbece9",
    navBarButtonColor: "black"
  };

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.description}>
            Set avvailability here
          </Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  } as TextStyle,
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#656565"
  } as TextStyle,
});
