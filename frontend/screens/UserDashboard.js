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
import LinkedListPuzzle from "../screens/Puzzles/LinkedListPuzzle";
import BubbleSortPuzzle from "../screens/Puzzles/BubbleSortPuzzle";
import BinaryTreePuzzle from "../screens/Puzzles/BinaryTreePuzzle";
import FriendsScreen from "./FriendsScreen";
import SubscriptionScreen from "./SubscriptionScreen";
import PlanDetailScreen from "./PlanDetailScreen";
import QuizzesScreen from "./QuizzesScreen";
import Notification from "./Notification";
import GamingEventDetail from "./GamingEventDetail";
import GamingEventPlay from "./GamingEventPlay";
import GamingEventsList from "./GamingEventsList";
import FullFriendsLeaderboard from "./FullFriendsLeaderboard";
import FullGlobalLeaderboard from "./FullGlobalLeaderboard";
import ChangePasswordScreen from "./ChangePasswordScreen";
import VisualPuzzlesScreen from "./VisualPuzzlesScreen";
import LogicChallengesScreen from "./LogicChallengesScreen";
import GeneralTriviaScreen from "./GeneralTriviaScreen";
import GamingEventLeaderboard from "./GamingEventLeaderboard";
import PendingRequestsScreen from './PendingRequestsScreen';
import SentRequestsScreen from './SentRequestsScreen';

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
      <Stack.Screen name="LinkedListPuzzleScreen" component={LinkedListPuzzle} />
      <Stack.Screen name="BubbleSortPuzzleScreen" component={BubbleSortPuzzle} />
      <Stack.Screen name="BinaryTreePuzzleScreen" component={BinaryTreePuzzle} />
      <Stack.Screen name="StackResult" component={ResultScreen} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <Stack.Screen name="QuizzesScreen" component={QuizzesScreen} />
      <Stack.Screen name="NotificationScreen" component={Notification} />
      <Stack.Screen name="GamingEventDetail" component={GamingEventDetail} />
      <Stack.Screen name="GamingEventPlay" component={GamingEventPlay} />
      <Stack.Screen name="GamingEventsList" component={GamingEventsList} />
      <Stack.Screen name="FullFriendsLeaderboard" component={FullFriendsLeaderboard} />
      <Stack.Screen name="FullGlobalLeaderboard" component={FullGlobalLeaderboard} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="VisualPuzzlesScreen" component={VisualPuzzlesScreen} />
      <Stack.Screen name="LogicChallengesScreen" component={LogicChallengesScreen} />
      <Stack.Screen name="GeneralTriviaScreen" component={GeneralTriviaScreen} />
      <Stack.Screen name="GamingEventLeaderboard" component={GamingEventLeaderboard} />
      <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />
      <Stack.Screen name="SentRequests" component={SentRequestsScreen} />
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
          height: 70,
          paddingBottom: 52,
          paddingTop: 8,
          position: "absolute",
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: "#f0e5f5",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
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
        options={{ tabBarStyle: { paddingBottom: 12, height: 70 } }}
      />
      <Tab.Screen
        name="Play"
        component={StackScreens}
        initialParams={{ screen: "StackPlay" }}
        options={{ tabBarStyle: { paddingBottom: 12, height: 70 } }}
      />
      <Tab.Screen
        name="Friends"
        component={StackScreens}
        initialParams={{ screen: "StackFriends" }}
        options={{ tabBarStyle: { paddingBottom: 12, height: 70 } }}
      />
      <Tab.Screen
        name="Profile"
        component={StackScreens}
        initialParams={{ screen: "StackProfile" }}
        options={{ tabBarStyle: { paddingBottom: 12, height: 70 } }}
      />
    </Tab.Navigator>
  );
}
