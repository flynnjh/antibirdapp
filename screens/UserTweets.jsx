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

import { TWITTER_BEARER_TOKEN } from "@env";
import TweetCard from "../components/TweetCard";
import axios from "axios";
import moment from "moment";

const Tweets = (props) => {
  const [userTweets, setUserTweets] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const getUserTweets = (id) => {
    axios
      .get(`https://api.twitter.com/2/users/${id}/tweets`, {
        params: {
          max_results: "100",
          "tweet.fields": "created_at,public_metrics,attachments",
          exclude: "retweets,replies",
        },
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
      })
      .then((res) => {
        setUserTweets(res.data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getUserTweets(props.route.params.user.info.id);
  }, []);

  const renderTweet = ({ item }) => (
    <TweetCard props={{ user: props.route.params.user, tweet: item }} />
  );

  return (
    <>
      {userTweets ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FlatList
            data={userTweets}
            renderItem={renderTweet}
            keyExtractor={(item) => item.id}
            directionalLockEnabled={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : !userTweets && !isLoading ? (
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            no tweets from the last thirty days :(
          </Text>
        </View>
      ) : isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Loading...
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default Tweets;
