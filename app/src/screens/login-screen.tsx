import * as React from "react";
import {
  Dimensions,
  Text,
  TextInput,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import {connect} from "react-redux";

import * as sessionActions from "../reducers/session/actions";

const windowSize = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
      backgroundColor: "transparent"
    } as TextStyle,
    bg: {
        position: "absolute",
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    } as ImageStyle,
    // bgTint: {
    //     position: "absolute",
    //     left: 0,
    //     top: 0,
    //     width: windowSize.width,
    //     height: windowSize.height,
    //     backgroundColor: "rgba(116, 109, 108, 0.55)"
    // } as TextStyle,
    header: {
        justifyContent: "center",
        alignItems: "center",
        flex: .5,
        backgroundColor: "transparent"
    } as TextStyle,
    logo: {
        width: 200,
        height: 84,
        tintColor: "white"
    },
    signin: {
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        height: 55,
    } as TextStyle,
    footer: {
      flex: .15
    } as TextStyle,
    inputs: {
        marginTop: 10,
        flex: .25,
    } as ViewStyle,
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        height: 41,
        borderBottomColor: "#CCC",
        borderColor: "transparent"
    },
    input: {
        position: "absolute",
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 14
    },
    forgotContainer: {
      alignItems: "flex-end",
      padding: 15,
    } as TextStyle,
    greyFont: {
      color: "#D8D8D8"
    },
    whiteFont: {
      color: "#FFF"
    },
    pinkFont: {
      color: "#fbece9"
    },
    signinButtonContainer: {
      height: 85,
      // flexShrink: 0,
    } as ViewStyle,
    errorContainer: {
      position: "relative",
      overflow: "hidden",
      height: 30,
    } as ViewStyle,
    error: {
      left: 0,
      right: 0,
      padding: 5,
      height: 30,
      backgroundColor: "red",
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    errorText: {
      color: "white",
      fontSize: 12,
    } as TextStyle
});

interface LoginScreenState {
  username?: string;
  password?: string;
  error?: string;
  errorBoxBounceValue?: Animated.Value;
}

class LoginScreen extends React.Component<any, LoginScreenState> {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props: any) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: null,
    };
  }

  componentWillUnmount() {
    console.log("Component-Lifecycle", "componentWillUnmount", "LoginScreen");
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.session.error !== this.props.session.error) {
      const errorBoxBounceValue = new Animated.Value(30);

      Animated.spring(
        errorBoxBounceValue,
        {
          toValue: 0,
          velocity: 3,
          tension: 2,
          friction: 8,
        }
      ).start();

      this.setState({
        errorBoxBounceValue,
        error: nextProps.session.error
      });
    }
  }

  onUsernameTextChanged(event: any) {
    this.setState({ username: event.nativeEvent.text });
  }

  onPasswordTextChanged(event: any) {
    this.setState({ password: event.nativeEvent.text });
  }

  onLoginPress() {
    if (this.state.username && this.state.password) {
      this.props.dispatch(
        sessionActions.login(this.state.username, this.state.password)
      );
    }
  }

  errorField() {
    if (this.state.error) {
      const errorStyle = {
        transform: [{translateY: this.state.errorBoxBounceValue}]
      };

      return (
        <Animated.View style={[styles.error, errorStyle]}>
          <Text style={styles.errorText}>{this.state.error}</Text>
        </Animated.View>
      );
    }

    return null;
  }

  render() {
    const error = this.errorField();

    return (
          <View style={styles.container}>
             <StatusBar
               barStyle="light-content"
             />
            <Image style={styles.bg} source={require("../../resources/images/login/background.png")} />
            <View style={styles.header}>
                <Image style={styles.logo} source={require("../../resources/images/logo.png")} />
            </View>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Email"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        onChange={this.onUsernameTextChanged.bind(this)}
                        value={this.state.username}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                          (this.refs["passwordInput"] as HTMLElement).focus();
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref="passwordInput"
                        password={true}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Password"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        onChange={this.onPasswordTextChanged.bind(this)}
                        value={this.state.password}
                        returnKeyType={"go"}
                    />
                </View>
                <View style={styles.forgotContainer}>
                    <Text style={styles.greyFont}>Forgot Password</Text>
                </View>
            </View>
            <View style={styles.signinButtonContainer}>
              <View style={styles.errorContainer}>
                {error}
              </View>
              <TouchableOpacity
                style={styles.signin}
                onPress={ this.onLoginPress.bind(this) }>
                  <Text style={styles.pinkFont}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
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

export default connect(mapStateToProps)(LoginScreen);
