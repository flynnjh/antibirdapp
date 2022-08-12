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
import TweetCard from "../components/TweetCard";
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
  const [userLink, setLinkInfo] = useState(false);
  const [recentTweet, setRecentTweet] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const getUserInfo = (username) => {
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
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
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
          console.log(res.data.data[0]);
          const pinnedInfo = {
            tweet: false,
          };

          const userInfo = {
            info: res.data.data[0],
            formattedCreatedDate: moment(res.data.data[0].created_at).format(
              "MMMM D, YYYY"
            ),
            profileImage: userProfileImage,
            pinnedTweet: pinnedInfo,
          };
          setUser(userInfo);
          setIsUser(true);
        } else {
          // gets users first five tweets, if meta.result_count is 0 then we know that the user actually doesn't have any tweets

          if (res.data.data[0]) {
            axios
              .get(
                `https://api.twitter.com/2/users/${res.data.data[0].id}/tweets`,
                {
                  params: {
                    max_results: 5,
                    "tweet.fields": "created_at,public_metrics,attachments",
                    exclude: "retweets,replies",
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
                  const recentInfo = {
                    formattedCreatedDate: moment(
                      res.data.data[0].created_at
                    ).format("MMMM D, YYYY @ HH:MM"),
                    tweet: res.data.data[0],
                    // isPinnedTweet: false,
                  };

                  setRecentTweet(recentInfo);
                }
              });

            if (res?.data?.data[0]?.entities?.url) {
              const link = {
                link: res.data.data[0].entities.url,
              };

              setLinkInfo(link);
            }
            const pinnedInfo = {
              createdAt: moment(
                res?.data?.includes?.tweets[0].created_at
              ).format("MMMM D, YYYY @ HH:MM"),
              tweet: res?.data?.includes?.tweets[0],
              // isPinnedTweet: true,
            };
            const userInfo = {
              info: res.data.data[0],
              formattedCreatedDate: moment(res.data.data[0].created_at).format(
                "MMMM D, YYYY"
              ),
              pinnedTweet: pinnedInfo,
              recentTweet: recentTweet,
              bioLink: userLink,
              profileImage: userProfileImage,
            };
            setUser(userInfo);
            setIsUser(true);
          }
        }
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
          <View
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
            }}
          >
            <View style={{ padding: 30, paddingBottom: 10 }}>
              <View
                style={{
                  flexDirection: "column",
                  // backgroundColor: "red",
                  width: Dimensions.get("window").width - 60,
                }}
              >
                <View
                  style={{
                    height: 120,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
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
                    style={{
                      paddingLeft: 20,
                      flexDirection: "column",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 0.2 * Dimensions.get("window").width - 60,
                        fontWeight: "bold",
                      }}
                    >
                      {user.info.name}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: 18, fontWeight: "300" }}>@</Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "300",
                          paddingLeft: 1.3,
                        }}
                      >
                        {user.info.username}
                      </Text>
                    </View>
                    {user.formattedCreatedDate ? (
                      <View style={{ paddingTop: 5 }}>
                        <Text style={{ fontSize: 14, fontWeight: "300" }}>
                          Joined {user.formattedCreatedDate}
                        </Text>
                      </View>
                    ) : null}
                    {user.info.verified ? (
                      <View style={{ paddingTop: 2 }}>
                        <Text style={{ fontSize: 14, fontWeight: "300" }}>
                          User is verified :O
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              <View
                style={{
                  paddingTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "300" }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {user.info.public_metrics.following_count.toLocaleString()}
                  </Text>
                  <Text> Following</Text>
                </Text>
                <Text
                  style={{ paddingLeft: 20, fontSize: 16, fontWeight: "300" }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {user.info.public_metrics.followers_count.toLocaleString()}
                  </Text>
                  <Text> Followers</Text>
                </Text>
              </View>
            </View>
            {user.info.description ? (
              <View
                style={{
                  paddingHorizontal: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 18,
                    textAlign: "center",
                    paddingBottom: 10,
                  }}
                >
                  {user.info.description}
                </Text>
              </View>
            ) : null}
            {userLink ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    color: "dodgerblue",
                    fontSize: 18,
                  }}
                >
                  {user.info.entities.url.urls[0].display_url}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                paddingBottom: 20,
                paddingHorizontal: 30,
              }}
            >
              {!user.info.protected && recentTweet ? (
                <View style={{ paddingTop: 20 }}>
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
                </View>
              ) : null}
            </View>

            <View
              style={{
                paddingTop: 15,
                borderBottomColor: "lightgrey",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor: PlatformColor("secondarySystemBackground"),
                  backgroundColor: "ghostwhite",
                }}
              >
                {user.info.protected ? (
                  <View>
                    <View style={{ flex: 1, padding: 30, paddingTop: 20 }}>
                      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                        These Tweets are protected.
                      </Text>
                      <Text style={{ fontSize: 20 }}>
                        Only approved followers can see @{user.info.username}
                        &apos;s Tweets.
                      </Text>
                    </View>
                  </View>
                ) : null}
                {!recentTweet && !user.info.protected ? (
                  <View>
                    <View style={{ paddingTop: 40, flex: 1 }}>
                      <Text style={{ fontSize: 24, fontWeight: "300" }}>
                        @{user.info.username} hasn&apos;t tweeted.
                      </Text>
                    </View>
                  </View>
                ) : null}
                <View>
                  <View
                    style={{
                      flex: 1,
                      paddingTop: 10,
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {user.pinnedTweet.tweet ? (
                      <TweetCard
                        props={{ user: user, recentTweet: recentTweet }}
                      />
                    ) : null}
                  </View>
                </View>
                {/* {user.pinnedTweet.tweet ? (
                  <View>
                    <View
                      style={{
                        flex: 1,
                        paddingTop: 10,
                        // justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 18,
                          paddingBottom: 20,
                        }}
                      >
                        📌 {user.pinnedTweet.createdAt}
                      </Text>

                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {user.pinnedTweet.tweet.text}
                      </Text>
                    </View>
                  </View>
                ) : recentTweet ? (
                  <View>
                    <View
                      style={{
                        flex: 1,
                        paddingTop: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          paddingBottom: 20,
                        }}
                      >
                        🎉 {recentTweet.formattedCreatedDate}
                      </Text>

                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {recentTweet.info.text}
                      </Text>

                      <View
                        style={{
                          paddingTop: 20,
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: "300" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            {recentTweet.info.public_metrics.retweet_count}
                          </Text>
                          <Text> Retweets</Text>
                        </Text>
                        <Text
                          style={{
                            paddingLeft: 20,
                            fontSize: 14,
                            fontWeight: "300",
                          }}
                        >
                          <Text style={{ fontWeight: "bold" }}>
                            {recentTweet.info.public_metrics.like_count}
                          </Text>
                          <Text> Likes</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null} */}
              </View>
            </View>
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
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
