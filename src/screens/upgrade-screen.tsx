import * as React from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  Image,
  StatusBar
} from "react-native";
import {connect} from "react-redux";

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
    upgradeContainer: {
      justifyContent: "center",
      alignItems: "center"
    } as ViewStyle,
    appStoreIcon: {
        width: 98,
        height: 98,
        tintColor: "white"
    } as ImageStyle,
    upgradeTextContainer: {
      width: 210,
    } as ViewStyle,
    upgradeText: {
      color: "white",
      marginTop: 10,
      textAlign: "center"
    } as TextStyle
});

export class LoginScreen extends React.Component<any, {}> {
  static navigatorStyle = {
    navBarHidden: true
  };

  render() {
    return (
          <View style={styles.container}>
             <StatusBar
               barStyle="light-content"
             />
            <Image style={styles.bg} source={require("../../resources/images/login/background.png")} />
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

// which props do we want to inject, given the global state?
function mapStateToProps(state: any) {
  return {
    session: state.session
  };
}

export default connect((mapStateToProps))(LoginScreen);
