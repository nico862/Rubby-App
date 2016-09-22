import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  TextStyle
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

interface ChatScreenProps {
  navigator: any;
}

interface ChatScreenState {
  messages?: any[];
}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Can you please use the basement door on the right of the building? We are in Studio B.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Pete Smith",
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0",
          },
          right: {
            backgroundColor: "black",
          }
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1,
          }}
          renderBubble={this.renderBubble}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  } as TextStyle
});
