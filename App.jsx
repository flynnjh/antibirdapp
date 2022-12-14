import { Platform, SafeAreaView, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./screens/Profile";
import TimelineScreen from "./screens/Timeline";
import UserTweets from "./screens/UserTweets";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";

export default function App() {
  const username = "distantsynths";

  const Tab = createMaterialBottomTabNavigator();
  const ProfileStack = createStackNavigator();

  function ProfileStackScreen() {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name={username}
          component={ProfileScreen}
          initialParams={{ username: username }}
          options={{ headerShown: false }}
        />
        <ProfileStack.Screen name="Tweets" component={UserTweets} />
      </ProfileStack.Navigator>
    );
  }
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Timeline"
            component={TimelineScreen}
            initialParams={{ username: username }}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Profile" component={ProfileStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
// TODO: pass through styles as prop, so won't have to redeclare style sheet on every screen/component
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "#fff",
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
