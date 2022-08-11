import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useDeferredValue, useEffect, useState } from "react";

import { StackNavigator } from "@react-navigation/stack";
import Timeline from "../screens/Timeline";
import TweetsScreen from "../screens/Tweets";
import axios from "axios";
import moment from "moment";

// TODO: Fix &amp; apprearing in Bio/Tweets
// TODO: Implement Link Rendering and Opening
// TODO: Implement Tweet Image Rendering
// TODO: Handle @handle Linking
// POTENTIAL: Implement Banner Rendering

export default function Profile(props) {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [hasTweeted, setTweetedState] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const getUserInfo = (username) => {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    axios
      .get(`https://api.twitter.com/2/users/by`, {
        params: {
          usernames: username,
          "user.fields":
            "created_at,description,profile_image_url,protected,verified,public_metrics,entities",
          expansions: "pinned_tweet_id",
          "tweet.fields": "author_id,created_at",
        },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((res) => {
        if (res.data.errors) {
          if (!res.data.errors[0].parameter === "pinned_tweet_id") {
            const error = {
              message: res.data.errors[0].detail,
            };
            setUser(null);
            setError(error);
            return;
          }

          if (res.data.errors[0].parameter === "usernames") {
            const error = {
              message: `User @${res.data.errors[0].resource_id} could not be found.`,
            };
            setUser(null);
            setError(error);
            return;
          }
        }

        const url = res.data.data[0].profile_image_url;
        let imageType = url.substring(url.length - 4);
        let userProfileImage = url.substring(0, url.length - 10);
        userProfileImage = userProfileImage + "400x400" + imageType;

        if (res.data.data[0].protected) {
          const userInfo = {
            info: res.data.data[0],
            profileImage: userProfileImage,
          };
          setUser(userInfo);
        } else {
          // gets users first five tweets, if meta.result_count is 0 then we know that the user actually doesn't have any tweets
          axios
            .get(
              `https://api.twitter.com/2/users/${res.data.data[0].id}/tweets`,
              {
                params: {
                  max_results: 5,
                },
                headers: {
                  Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
              }
            )
            .then((res) => {
              if (res.data.meta.result_count === 0) {
                return;
              } else {
                setTweetedState(true);
              }
            });
        }
        const userInfo = {
          info: res.data.data[0],
          formattedCreatedDate: moment(res.data.data[0].created_at).format(
            "MMMM D, YYYY"
          ),
          pinnedTweet: res?.data?.includes?.tweets[0],
          profileImage: userProfileImage,
        };
        setUser(userInfo);
        setIsUser(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  useEffect(() => {
    if (props.route.params.username) {
      getUserInfo(props.route.params.username);
    }
    setLoading(false);
  }, []);

  // implement search bar

  // if user has not set username, show nothing and prompt to set user -> store in asyncstorage.
  // otherwise, load username from async storage.

  return (
    <>
      <SafeAreaView style={[styles.container, styles.AndroidSafeArea]}>
        {!isUser ? <Text>hello world</Text> : null}
        {user ? (
          <View style={{ padding: 30, width: Dimensions.get("window").width }}>
            <View style={{ paddingBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexGrow: 1,
                  maxHeight: 120,
                  minHeight: 120,
                }}
              >
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 120 / 2,
                  }}
                  source={{ uri: user.profileImage }}
                />
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ flexDirection: "column", paddingLeft: 20 }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      {user.info.name} {"\n"}
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                      }}
                    >
                      @{user.info.username} {"\n"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={{ paddingTop: 20 }}>
                {user.info.verified ? (
                  <View style={{ paddingTop: 20 }}>
                    <Text>User is verified :O</Text>
                  </View>
                ) : null}
                {user.formattedCreatedDate ? (
                  <View>
                    <Text style={{ fontSize: 16 }}>
                      Joined {user.formattedCreatedDate}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={{ paddingTop: 20, flexDirection: "row" }}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {user.info.public_metrics.following_count}
                  </Text>
                  <Text> Following</Text>
                </Text>
                <Text style={{ paddingLeft: 20 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {user.info.public_metrics.followers_count}
                  </Text>
                  <Text> Followers</Text>
                </Text>
              </View>
            </View>
            {user.info.description ? (
              <Text style={{ color: "black", fontSize: 18, paddingBottom: 20 }}>
                {user.info.description}
              </Text>
            ) : null}
            {user.info.protected ? (
              <View style={{ paddingTop: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                  These Tweets are protected.
                </Text>
                <Text style={{ fontSize: 16 }}>
                  Only approved followers can see @{user.info.username}&apos;s
                  Tweets.
                </Text>
              </View>
            ) : null}
            <View style={{ paddingTop: 20 }} />
            {/* this is here because i'm lazy */}
            {!user.info.protected ? (
              <Pressable
                style={[styles.button, { backgroundColor: "dodgerblue" }]}
                onPress={() => {
                  navigation.navigate("Tweets", { id: user.info.id });
                }}
              >
                <Text
                  style={[
                    {
                      fontSize: 16,
                      color: "white",
                    },
                  ]}
                >
                  Tweets ({user.info.public_metrics.tweet_count})
                </Text>
              </Pressable>
            ) : null}

            {!hasTweeted && !user.info.protected ? (
              <Text style={{ fontSize: 28 }}>
                @{user.info.username} hasn&apos;t tweeted.
              </Text>
            ) : null}
            {/* {user.pinnedTweet ? (
              <>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                    paddingBottom: 20,
                  }}
                >
                  📌 {user.pinnedTweet.created_at}
                </Text>

                <Text style={{ color: "black", fontSize: 18 }}>
                  {user.pinnedTweet.text}
                </Text>
              </>
            ) : null} */}
          </View>
        ) : error ? (
          <View>
            <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
                paddingBottom: 20,
              }}
            >
              An error occurred :(
            </Text>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
              {error.message}
            </Text>
          </View>
        ) : isLoading ? (
          <View>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
              Loading...
            </Text>
          </View>
        ) : null}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "blue",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
