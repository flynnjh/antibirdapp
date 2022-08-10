import { Platform, SafeAreaView, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./screens/ProfileScreen";
import TimelineScreen from "./screens/Timeline";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

export default function App() {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Timeline" component={TimelineScreen} />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ username: "donaldglover" }}
          />
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
