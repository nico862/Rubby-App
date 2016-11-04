import * as React from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  Image
} from "react-native";

const windowSize = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center"
    } as TextStyle,
    bg: {
        position: "absolute",
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    } as ImageStyle,
    bgTint: {
        position: "absolute",
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: "rgba(251, 236, 233, 0.7)"
    } as ViewStyle,
    upgradeContainer: {
      justifyContent: "center",
      alignItems: "center"
    } as ViewStyle,
    appStoreIcon: {
        width: 98,
        height: 98,
        tintColor: "#666"
    } as ImageStyle,
    upgradeTextContainer: {
      width: 210,
    } as ViewStyle,
    upgradeText: {
      color: "#666",
      marginTop: 10,
      textAlign: "center"
    } as TextStyle
});

export default class UpgradeScreen extends React.Component<any, {}> {
  static navigatorStyle = {
    navBarHidden: true
  };

  render() {
    return (
          <View style={styles.container}>
            <Image style={styles.bg} source={require("../../resources/images/login/background/375x667.jpg")} />
            <View style={styles.bgTint}></View>
            <View style={styles.upgradeContainer}>
              <Image style={styles.appStoreIcon} source={require("../../resources/images/app-store.png")} />
              <View style={styles.upgradeTextContainer}>
                <Text style={styles.upgradeText}>
                  You need to upgrade Ruuby PA.
                  Please download the new version from the AppStore
                </Text>
              </View>
            </View>
        </View>
    );
  }
}
