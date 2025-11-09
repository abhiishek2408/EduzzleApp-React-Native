import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";

import LogoHeader from "./LogoHeader";
import HomeScreen from "./HomeScreen";
import PlayScreen from "./PlayScreen";
import ProfileScreen from "./ProfileScreen";
import QuizPlayScreen from "./QuizPlayScreen";
import ResultScreen from "./ResultScreen";
import StackQuiz from "../screens/Puzzles/StackQuiz";
import FriendsScreen from "./FriendsScreen";
import SubscriptionScreen from "./SubscriptionScreen";
import PlanDetailScreen from "./PlanDetailScreen";
import QuizScreen from "./QuizScreen";
import Notification from "./Notification";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------- Stack Navigator -------------------
const StackScreens = ({ route }) => {
  const initialScreen = route.params?.screen || "StackHome";

  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{headerShown:false}}
    >
      <Stack.Screen name="StackHome" component={HomeScreen} />
      <Stack.Screen name="StackPlay" component={PlayScreen} />
      <Stack.Screen name="StackProfile" component={ProfileScreen} />
      <Stack.Screen name="StackFriends" component={FriendsScreen} />
      <Stack.Screen name="PremiumDashboard" component={SubscriptionScreen} />
      <Stack.Screen name="QuizPlayScreen" component={QuizPlayScreen} />
      <Stack.Screen name="StackQuizScreen" component={StackQuiz} />
      <Stack.Screen name="StackResult" component={ResultScreen} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <Stack.Screen name="QuizzesScreen" component={QuizScreen} />
      <Stack.Screen name="NotificationScreen" component={Notification} />
    </Stack.Navigator>
  );
};

// ------------------- Bottom Tab Navigator -------------------
export default function UserDashboard() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#a21caf",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff8fc",
          height: 60,
          paddingBottom: 5,
        },
        // ICON SETUP
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Play":
              iconName = "game-controller-outline";
              break;
            case "Friends":
              iconName = "people-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // LABEL DISPLAY ONLY WHEN ACTIVE
        tabBarLabel: ({ focused }) =>
          focused ? (
            <Text style={{ color: "#a21caf", fontSize: 12, fontWeight: "600" }}>
              {route.name}
            </Text>
          ) : null,
      })}
    >
      <Tab.Screen
        name="Home"
        component={StackScreens}
        initialParams={{ screen: "StackHome" }}
      />
      <Tab.Screen
        name="Play"
        component={StackScreens}
        initialParams={{ screen: "StackPlay" }}
      />
      <Tab.Screen
        name="Friends"
        component={StackScreens}
        initialParams={{ screen: "StackFriends" }}
      />
      <Tab.Screen
        name="Profile"
        component={StackScreens}
        initialParams={{ screen: "StackProfile" }}
      />
    </Tab.Navigator>
  );
}
