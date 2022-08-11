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
          "tweet.fields": "created_at,public_metrics,entities,attachments",
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

  const Item = (item) => {
    //TODO: MAKE THIS LOOK GOOD
    return (
      <View style={{ padding: 20 }}>
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

  const renderItem = ({ item }) => <Item tweet={item} />;

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
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : null}
    </>
  );
};

export default Tweets;
