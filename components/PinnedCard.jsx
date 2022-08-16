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

import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

// TODO: eventually phase this out with TweetCard
// only difference is that it shows 'pinned tweet' and takes in user.PinnedTweet as a prop. would mean that i have to make a boolean like isPinned and
// add getUserTweets TweetCard? idk. this just works, but it's hideous.

const PinnedTweetCard = ({ props }) => {
  return (
    <>
      <View
        style={{
          borderBottomColor: "lightgrey",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View
        style={[
          props.style,
          { paddingTop: 10, width: Dimensions.get("window").width },
        ]}
      >
        {props.user.pinnedTweet.tweet ? (
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 67,
                paddingVertical: 5,
              }}
            >
              <MaterialIcons
                name="push-pin"
                size={18}
                color="black"
                style={{ height: 15, paddingRight: 5 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Pinned Tweet
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60 / 2,
                  }}
                  source={{ uri: props.user.profileImage }}
                />
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {props.user.info.name}
                    </Text>
                    {props.user.info.verified ? (
                      <MaterialIcons
                        name="verified"
                        size={16}
                        color="black"
                        style={{ height: 15, paddingLeft: 3 }}
                      />
                    ) : null}
                    <Text style={{ paddingLeft: 3, paddingRight: 5 }}>
                      @{props.user.info.username}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12 }}>// </Text>
                  {moment(moment()).diff(
                    props.user.pinnedTweet.tweet.created_at,
                    "days"
                  ) === 0 ? (
                    <Text style={{ alignItems: "flex-end" }}>
                      {moment(moment()).diff(
                        props.user.pinnedTweet.tweet.created_at,
                        "hours"
                      ) > 0
                        ? moment(moment()).diff(
                            props.user.pinnedTweet.tweet.created_at,
                            "hours"
                          ) + "h"
                        : moment(moment()).diff(
                            props.user.pinnedTweet.tweet.created_at,
                            "minutes"
                          ) + "m"}
                    </Text>
                  ) : (
                    <Text style={{ alignItems: "flex-end" }}>
                      {moment(moment()).diff(
                        props.user.pinnedTweet.tweet.created_at,
                        "days"
                      )}
                      d
                    </Text>
                  )}
                </View>
                <View style={{ width: Dimensions.get("window").width - 115 }}>
                  <Text>{props.user.pinnedTweet.tweet.text}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingTop: 20,
                borderBottomColor: "lightgrey",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          </View>
        ) : null}
      </View>
    </>
  );
};

export default PinnedTweetCard;
