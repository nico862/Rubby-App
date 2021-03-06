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
  Platform
} from "react-native";
import {connect, ConnectClass} from "react-redux";
import {Dispatch} from "redux";
import {bindActionCreators} from "redux";

import * as sessionActions from "../reducers/session/actions";

const windowSize = Dimensions.get("window");
const SIZE_RATIO = windowSize.width >= 375 ? 1.14 : 1;

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
        padding: 0,
        borderWidth: 1,
        height:  41,
        borderBottomColor: "rgba(0, 0, 0, 0.7)",
        borderColor: "transparent",
    },
    input: {
      position: "absolute",
      left: 61,
      top: Platform.OS === "android" ? 8 : 12,
      right: 0,
      height: Platform.OS === "android" ? 40 : 20,
      fontSize: SIZE_RATIO * 14,
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

interface LoginScreenProps {
  error: string;
  isLoggingIn: boolean;
  logIn: (username: string, password: string) => any;
}

interface LoginScreenState {
  username?: string;
  password?: string;
  errorBoxBounceValue?: Animated.Value;
}

class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState> {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props: LoginScreenProps) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  componentWillReceiveProps(nextProps: LoginScreenProps) {
    if (nextProps.error && !this.props.error) {
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

      this.setState({errorBoxBounceValue});
    }
  }

  onUsernameTextChange(event: any) {
    this.setState({ username: event.nativeEvent.text });
  }

  onPasswordTextChange(event: any) {
    this.setState({ password: event.nativeEvent.text });
  }

  onLoginPress() {
    if (this.state.username && this.state.password) {
      this.props.logIn(this.state.username, this.state.password);
    }
  }

  onForgotPasswordPress() {
    Linking.openURL("http://ruubysalon.com/forgot-your-password");
  }

  errorField() {
    if (this.props.error) {
      const errorStyle = {
        transform: [{translateY: this.state.errorBoxBounceValue}]
      };

      return (
        <Animated.View style={[styles.error, errorStyle]}>
          <Text style={styles.errorText}>{this.props.error}</Text>
        </Animated.View>
      );
    }

    return null;
  }

  signInButton() {
    if (this.props.isLoggingIn) {
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
                        onChange={this.onUsernameTextChange.bind(this)}
                        value={this.state.username}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType={"next"}
                        onSubmitEditing={_event => {
                          (this.refs["passwordInput"] as HTMLElement).focus();
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref="passwordInput"
                        secureTextEntry={true}
                        autoCorrect={false}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Password"
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        onChange={this.onPasswordTextChange.bind(this)}
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

function mapStateToProps(state: any) {
  return {
    error: state.session.error,
    isLoggingIn: state.session.isLoggingIn,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    logIn: sessionActions.logIn,
  }, dispatch) as any;
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen) as ConnectClass<any, any>;
