import {
  Button,
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  Platform,
  PlatformColor,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDeferredValue, useEffect, useState } from "react";

import { StackNavigator } from "@react-navigation/stack";
import { TWITTER_BEARER_TOKEN } from "@env";
import Timeline from "../screens/Timeline";
import TweetsScreen from "../screens/Tweets";
import axios from "axios";
import moment from "moment";

const TweetCard = (props) => {
  console.log(props.props.user);
  console.log(props.props.recentTweet);
  return (
    <>
      <View>
        {props.props.user.pinnedTweet ? (
          <View>
            <Text>📌 {props.props.user.pinnedTweet.createdAt}</Text>
          </View>
        ) : null}
        <Text>{props.props.user.pinnedTweet.tweet.text}</Text>
      </View>
    </>
  );
};

export default TweetCard;
