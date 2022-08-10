import {
  Button,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { SvgUri } from "react-native-svg";
import axios from "axios";

export default function Profile(props) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const getUserInfo = (username) => {
    axios
      .get(`https://api.twitter.com/2/users/by`, {
        params: {
          usernames: username,
          "user.fields":
            "created_at,description,profile_image_url,protected,verified,public_metrics",
          expansions: "pinned_tweet_id",
          "tweet.fields": "author_id,created_at",
        },
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
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
          const userInfo = {
            info: res.data.data[0],
            pinnedTweet: res?.data?.includes?.tweets[0],
            profileImage: userProfileImage,
          };
          setUser(userInfo);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  useEffect(() => {
    getUserInfo(props.username);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {user ? (
          <View style={{ padding: 20, width: Dimensions.get("window").width }}>
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
            {user.info.verified ? (
              <View style={{ paddingBottom: 20 }}>
                <Text>User is verified :O</Text>
              </View>
            ) : null}
            {user.info.description ? (
              <Text style={{ color: "black", fontSize: 16, paddingBottom: 20 }}>
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
            {user.info.public_metrics.tweet_count === 0 ? ( // only works if user never retweeted anything, will rework this later.
              <Text style={{ fontSize: 28 }}>
                @{user.info.username} hasn&apos;t tweeted.
              </Text>
            ) : null}
            {user.pinnedTweet ? (
              <>
                <Text
                  style={{ color: "black", fontSize: 16, paddingBottom: 20 }}
                >
                  📌 {user.pinnedTweet.created_at}
                </Text>

                <Text style={{ color: "black", fontSize: 16 }}>
                  {user.pinnedTweet.text}
                </Text>
              </>
            ) : null}
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
        ) : (
          <View>
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
              Loading...
            </Text>
          </View>
        )}
      </View>
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
