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
  Animated,
  Linking,
  ActivityIndicator,
} from "react-native";
import {connect} from "react-redux";

import * as sessionActions from "../reducers/session/actions";

const SIZE_RATIO = 1.14;
const windowSize = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
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
    header: {
        justifyContent: "center",
        alignItems: "center",
        flex: .5,
        backgroundColor: "transparent"
    } as TextStyle,
    logo: {
        width: 200 * SIZE_RATIO,
        height: 84 * SIZE_RATIO,
        tintColor: "black"
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
        borderBottomColor: "rgba(0, 0, 0, 0.7)",
        borderColor: "transparent",
    },
    input: {
      position: "absolute",
      left: 61,
      top: 12,
      right: 0,
      height: 20,
      fontSize: SIZE_RATIO * 14
    },
    forgotContainer: {
      alignItems: "flex-end",
      padding: 15,
      backgroundColor: "transparent"
    } as ViewStyle,
    greyFont: {
      color: "black",
      fontSize: SIZE_RATIO * 14
    },
    whiteFont: {
      color: "black",
      fontSize: SIZE_RATIO * 14
    },
    signinText: {
      color: "white",
      fontSize: SIZE_RATIO * 16
    },
    pinkFont: {
      color: "#fbece9",
      fontSize: SIZE_RATIO * 14
    },
    signinButtonContainer: {
      height: 85,
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
      backgroundColor: "rgba(255, 0 , 0, 0.7)",
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    errorText: {
      color: "white",
      fontSize: 12 * SIZE_RATIO,
    } as TextStyle
});

interface LoginScreenState {
  username?: string;
  password?: string;
  error?: string;
  errorBoxBounceValue?: Animated.Value;
  isLoggingIn?: boolean;
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
        error: nextProps.session.error,
        isLoggingIn: nextProps.session.isLoggingIn,
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

  onForgotPasswordPress() {
    Linking.openURL("http://ruubysalon.com/forgot-your-password");
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

  signInButton() {
    if (this.state.isLoggingIn) {
      return (
        <View style={styles.signin}>
            <ActivityIndicator animating={true} size={"large"}></ActivityIndicator>
        </View>
      );
    }
    else {
      return (
        <TouchableOpacity
          style={styles.signin}
          onPress={ this.onLoginPress.bind(this) }>
            <Text style={styles.signinText}>Sign In</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const error = this.errorField();
    const signInButton = this.signInButton();

    return (
          <View style={styles.container}>
            <Image style={styles.bg} source={require("../../resources/images/login/background/375x667.jpg")} />
            <View style={styles.bgTint}></View>
            <View style={styles.header}>
                <Image style={styles.logo} source={require("../../resources/images/logo.png")} />
            </View>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Email"
                        autoCorrect={false}
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
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
                        autoCorrect={false}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Password"
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        onChange={this.onPasswordTextChanged.bind(this)}
                        value={this.state.password}
                        returnKeyType={"go"}
                        onSubmitEditing={this.onLoginPress.bind(this)}
                    />
                </View>
                <View style={styles.forgotContainer}>
                  <TouchableOpacity onPress={ this.onForgotPasswordPress.bind(this) }>
                    <Text style={styles.greyFont}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
            </View>
            <View style={styles.signinButtonContainer}>
              <View style={styles.errorContainer}>
                {error}
              </View>
              {signInButton}
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
