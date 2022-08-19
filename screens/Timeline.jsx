import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  PlatformColor,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { TWITTER_BEARER_TOKEN } from "@env";
import TweetCard from "../components/TweetCard";
import axios from "axios";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

// From the collection of returned user objects, get their Tweets from the past day,
// Combine into one array, show to user

const Timeline = (props) => {
  const [user, setUser] = useState(null);
  const [userTimeline, setUserTimeline] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const generateUserTimeline = (user) => {
    axios
      .get(`https://api.twitter.com/2/users/${user.id}/following`, {
        params: {
          max_results: user.public_metrics.following_count,
          "user.fields": "created_at,profile_image_url,protected,verified",
        },
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      })
      .then((res) => {
        const userFollowing = res.data.data;
        let userFollowingTweets = new Array();
        const startTime = moment().subtract(12, "hours").toISOString();

        // this very quickly rate limits us.
        // though with twitter not providing home_timeline without authentication i have to do it this way.

        // NEW IDEA: Maybe user should 'follow' profiles themselves to cut down on requests

        for (let u = 0; u < user.public_metrics.following_count; u++) {
          axios
            .get(
              `https://api.twitter.com/2/users/${userFollowing[u].id}/tweets`,
              {
                params: {
                  max_results: 10,
                  start_time: startTime,
                  "tweet.fields":
                    "created_at,public_metrics,attachments,entities",
                  exclude: "retweets,replies",
                },
                headers: {
                  Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
                },
              }
            )
            .then((res) => {
              for (let i = 0; i < Object.keys(res.data.data).length; i++) {
                const url = userFollowing[u].profile_image_url;
                let imageType = url.substring(url.length - 4);
                let userProfileImage = url.substring(0, url.length - 10);
                {
                  imageType === "jpeg"
                    ? ((imageType = ".jpeg"),
                      (userProfileImage = url.substring(0, url.length - 11)))
                    : null;
                }
                userProfileImage = userProfileImage + "400x400" + imageType;

                const userInfo = {
                  info: userFollowing[u],
                  profileImage: userProfileImage,
                };
                const userTweet = {
                  user: userInfo,
                  tweet: res.data.data[i],
                };
                userFollowingTweets.push(userTweet);
              }
              userFollowingTweets.sort((a, b) => {
                return (
                  new Date(b.tweet.created_at) - new Date(a.tweet.created_at)
                );
              });
              setUserTimeline(userFollowingTweets);
            })
            .catch((err) => {
              // Do nothing
            });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  const getUserInfo = (username) => {
    axios
      .get(`https://api.twitter.com/2/users/by`, {
        params: {
          usernames: username,
          "user.fields": "protected,verified,profile_image_url,public_metrics",
        },
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      })
      .then((res) => {
        setUser(res.data.data[0]);
        if (res.data.data[0].public_metrics.following_count > 0) {
          generateUserTimeline(res.data.data[0]);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  useEffect(() => {
    getUserInfo(props.route.params.username);
  }, [isLoading]);

  useEffect(() => {
    // console.log(userTimeline);
  }, [userTimeline]);

  const renderTweet = ({ item }) => (
    <TweetCard props={{ user: item.user, tweet: item.tweet }} />
  );

  return (
    <>
      <SafeAreaView style={[styles.AndroidSafeArea, styles.container]}>
        {!isLoading ? (
          <View>
            {user.public_metrics.following_count > 0 && userTimeline ? (
              <FlatList
                data={userTimeline}
                renderItem={renderTweet}
                keyExtractor={(item) => item.tweet.id}
                directionalLockEnabled={true}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <View>
                <Text style={{ fontSize: 20, fontWeight: "300" }}>
                  @{user.username} follows nobody.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
});

export default Timeline;
