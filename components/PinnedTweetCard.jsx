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

const PinnedTweetCard = (props) => {
  return (
    <>
      <View style={[props.props.style, { backgroundColor: "lightgrey" }]}>
        {props.props.user.pinnedTweet.tweet ? (
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("window").width,
              }}
            >
              <View style={{ paddingHorizontal: 15 }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60 / 2,
                  }}
                  source={{ uri: props.props.user.profileImage }}
                />
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                  }}
                >
                  <Text style={{ paddingRight: 5, fontWeight: "bold" }}>
                    {props.props.user.info.name}
                  </Text>
                  <Text style={{ paddingRight: 5 }}>
                    @{props.props.user.info.username}
                  </Text>
                  <Text style={{ fontSize: 12 }}>📌 </Text>
                  <Text>{props.props.user.pinnedTweet.createdAt}</Text>
                </View>
                <View style={{ width: Dimensions.get("window").width - 120 }}>
                  <Text>{props.props.user.pinnedTweet.tweet.text}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
};

export default PinnedTweetCard;
