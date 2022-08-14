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
                    flexDirection: "row",
                    paddingBottom: 5,
                    width: Dimensions.get("window").width - 100,
                  }}
                >
                  <Text style={{ paddingRight: 5, fontWeight: "bold" }}>
                    {props.user.info.name}
                  </Text>
                  <Text style={{ paddingRight: 5 }}>
                    @{props.user.info.username}
                  </Text>
                  <Text style={{ paddingRight: 5 }}>//</Text>
                  <Text style={{ alignItems: "flex-end" }}>
                    {moment(props.tweet.created_at).format("MMM D, YY")}
                  </Text>
                </View>
                <View style={{ width: Dimensions.get("window").width - 100 }}>
                  <Text>{props.tweet.text}</Text>
                </View>
                <View style={{ paddingTop: 5, flexDirection: "row" }}>
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
