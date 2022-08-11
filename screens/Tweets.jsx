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
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const todaysDate = moment().subtract(1, "month").toISOString();
    axios
      .get(`https://api.twitter.com/2/users/${id}/tweets`, {
        params: {
          max_results: "100",
          "tweet.fields": "created_at,public_metrics,entities,attachments",
          exclude: "retweets,replies",
          start_time: todaysDate,
        },
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((res) => {
        setUserTweets(res.data.data);
      });
  };

  useEffect(() => {
    getUserTweets(props.route.params.id);
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
      ) : (
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
      )}
    </>
  );
};

export default Tweets;
