import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// Invenator (Greatness): Import your screens
import Homepage from "./Homepage";
import SavedJobs from "./savedJobs";
import Notifications from "./notifications";
import Settings from "./Settings";
import JobBoard from "./JobBoard";
import JobMap from "./JobsMap";
import CareerExplorer from "./CareerExplorer";

//  Screen names
const homeName = "Home";
const savedJobsName = "Saved Jobs";
const notificationsName = "Notifications";
const settingsName = "Settings";

// Create stacks for each tab
const HomeStack = createStackNavigator();
const SavedJobsStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const SettingsStack = createStackNavigator();

//  Home Stack
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Homepage" component={Homepage} />
      <HomeStack.Screen name="JobBoard" component={JobBoard} />
      <HomeStack.Screen name="JobMap" component={JobMap} />
      <HomeStack.Screen name="CareerExplorer" component={CareerExplorer} />
      {/* Add other screens that should be accessible from Home tab */}
    </HomeStack.Navigator>
  );
}

// Saved Jobs Stack
function SavedJobsStackScreen() {
  return (
    <SavedJobsStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedJobsStack.Screen name="SavedJobsScreen" component={SavedJobs} />
      {/* Add screens accessible from Saved Jobs */}
    </SavedJobsStack.Navigator>
  );
}

//  Notifications Stack
function NotificationsStackScreen() {
  return (
    <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationsStack.Screen
        name="NotificationsScreen"
        component={Notifications}
      />
      {/* Add screens accessible from Notifications */}
    </NotificationsStack.Navigator>
  );
}

// Settings Stack
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsScreen" component={Settings} />
      {/* Add screens accessible from Settings */}
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === savedJobsName) {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === notificationsName) {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === settingsName) {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#213E64",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 50 },
        headerShown: false,
      })}
    >
      <Tab.Screen name={homeName} component={HomeStackScreen} />
      <Tab.Screen name={savedJobsName} component={SavedJobsStackScreen} />
      <Tab.Screen name={notificationsName} component={NotificationsStackScreen} />
      <Tab.Screen name={settingsName} component={SettingsStackScreen} />
    </Tab.Navigator>
  );
}

export default MainContainer;
