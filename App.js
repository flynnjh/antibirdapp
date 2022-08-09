import {
  Button,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import axios from "axios";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const searchUser = "00F800FF";

  const getUserInfo = (username) => {
    axios
      .get(`https://api.twitter.com/2/users/by`, {
        params: {
          usernames: username,
          "user.fields": "created_at,description,profile_image_url,protected",
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
        setError(error);
      });
  };

  useEffect(() => {
    getUserInfo(searchUser);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {user ? (
          <View style={{ padding: 20, width: Dimensions.get("window").width }}>
            <View style={{ paddingBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexGrow: 1,
                  maxHeight: 60,
                  minHeight: 60,
                }}
              >
                <Image
                  style={{
                    width: 65,
                    height: 65,
                    borderRadius: 65 / 2,
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
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {user.info.name} {"\n"}
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 16,
                        paddingBottom: 20,
                      }}
                    >
                      @{user.info.username}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{ color: "black", fontSize: 16, paddingBottom: 20 }}>
              {user.info.description}
            </Text>
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
            {user.info.protected ? (
              <View>
                <Text>User is protected.</Text>
              </View>
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
