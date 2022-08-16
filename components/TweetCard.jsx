import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

const TweetCard = ({ props }) => {
  return (
    <>
      <View
        style={[
          props.style,
          { paddingTop: 10, width: Dimensions.get("window").width },
        ]}
      >
        <View
          style={{
            flexDirection: "column",
          }}
        >
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
            {props.tweet ? (
              <View>
                <View
                  style={{
                    // backgroundColor: "red",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingBottom: 5,
                    width: Dimensions.get("window").width - 100,
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
                  <Text style={{ paddingRight: 5 }}>//</Text>
                  {moment(moment()).diff(props.tweet.created_at, "days") ===
                  0 ? (
                    <Text style={{ alignItems: "flex-end" }}>
                      {moment(moment()).diff(props.tweet.created_at, "hours") >
                      0
                        ? moment(moment()).diff(
                            props.tweet.created_at,
                            "hours"
                          ) + "h"
                        : moment(moment()).diff(
                            props.tweet.created_at,
                            "minutes"
                          ) + "m"}
                    </Text>
                  ) : (
                    <Text style={{ alignItems: "flex-end" }}>
                      {moment(moment()).diff(props.tweet.created_at, "days")}d
                    </Text>
                  )}
                </View>
                <View style={{ width: Dimensions.get("window").width - 115 }}>
                  <Text>{props.tweet.text}</Text>
                </View>
                <View style={{ paddingTop: 10, flexDirection: "row" }}>
                  <Text style={{ paddingRight: 5 }}>
                    {props.tweet.public_metrics.retweet_count} Retweets{" "}
                  </Text>
                  <Text>{props.tweet.public_metrics.like_count} Likes </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            paddingTop: 15,
            borderBottomColor: "lightgrey",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
    </>
  );
};

export default TweetCard;
