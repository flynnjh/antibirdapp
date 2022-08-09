import {
  Button,
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

  const searchUser = "awesomekling";

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
        const userInfo = {
          info: res.data.data[0],
          pinnedTweet: res?.data?.includes?.tweets[0],
        };
        setUser(userInfo);
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
          <View style={{ padding: 20 }}>
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
                    borderRadius: 100,
                  }}
                  source={{ uri: user.info.profile_image_url }}
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
              An erorr occurred :(
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
