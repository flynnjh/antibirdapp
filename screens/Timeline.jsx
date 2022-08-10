import {
  Button,
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { SvgUri } from "react-native-svg";
import axios from "axios";
import moment from "moment";

const Timeline = () => {
  return (
    <>
      <SafeAreaView style={[styles.AndroidSafeArea, styles.container]}>
        <Text>timeline :D</Text>
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default Timeline;
