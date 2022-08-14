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
                  <Text style={{ paddingRight: 5, fontWeight: "bold" }}>
                    {props.user.info.name}
                  </Text>
                  <Text style={{ paddingRight: 5 }}>
                    @{props.user.info.username}
                  </Text>
                  <Text style={{ fontSize: 12 }}>📌 </Text>
                  <Text>{props.user.pinnedTweet.createdAt}</Text>
                </View>
                <View style={{ width: Dimensions.get("window").width - 115 }}>
                  <Text>{props.user.pinnedTweet.tweet.text}</Text>
                </View>
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
        ) : null}
      </View>
    </>
  );
};

export default PinnedTweetCard;
