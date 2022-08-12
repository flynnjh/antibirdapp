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
import axios from "axios";
import moment from "moment";

const Tweets = (props) => {
  const [userTweets, setUserTweets] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const getUserTweets = (id) => {
    const todaysDate = moment().subtract(1, "month").toISOString();

    axios
      .get(`https://api.twitter.com/2/users/${id}/tweets`, {
        params: {
          max_results: "100",
          "tweet.fields": "created_at,public_metrics,attachments",
          exclude: "retweets,replies",
          start_time: todaysDate,
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
    getUserTweets(props.route.params.id);
    console.log(props);
  }, []);

  const Tweet = (item) => {
    //TODO: MAKE THIS LOOK GOOD
    return (
      <View style={{ padding: 30, width: Dimensions.get("window").width - 30 }}>
        <Text style={{ paddingTop: 20 }}>
          {item.tweet.text} {"\n"}
        </Text>
        <Text>
          {item.tweet.created_at} {"\n"}
        </Text>
        <Text>
          <Text>{item.tweet.public_metrics.retweet_count} Retweets </Text>
          <Text>{item.tweet.public_metrics.like_count} Likes </Text>
        </Text>
      </View>
    );
  };

  const renderTweet = ({ item }) => <Tweet tweet={item} />;

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
