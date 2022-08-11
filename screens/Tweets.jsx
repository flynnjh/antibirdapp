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
import { useDeferredValue, useEffect, useState } from "react";

import axios from "axios";
import moment from "moment";

const Tweets = (props) => {
  const [userTweets, setUserTweets] = useState(null);

  const getUserTweets = (id) => {
    axios
      .get(`https://api.twitter.com/2/users/${id}/tweets`, {
        params: {
          max_results: "100",
          "tweet.fields": "created_at,public_metrics",
          exclude: "retweets,replies",
        },
        headers: {
          Authorization:
            "Bearer AAAAAAAAAAAAAAAAAAAAAEwVGwEAAAAAADxuXCHCIjgHYuS%2FjDv2%2Fv17Zb0%3DLq5RIGtCYKPEoTjAphdCx02SlsQtsxNoq5WMPz9AottLyBuZoX",
        },
      })
      .then((res) => {
        setUserTweets(res.data.data);
      });
  };

  useEffect(() => {
    getUserTweets(props.route.params.id);
  }, []);

  return (
    <>
      {userTweets ? (
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {userTweets[0].text} {"\n"}
          </Text>
          <Text style={{ fontSize: 16 }}>
            <Text>
              {userTweets[0].public_metrics.retweet_count} retweets {"   "}
            </Text>
            <Text>{userTweets[0].public_metrics.like_count} likes</Text>
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default Tweets;
