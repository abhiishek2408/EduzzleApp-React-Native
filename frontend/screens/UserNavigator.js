import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

// Screen Imports
import UserDashboard from "./UserDashboard";
import PremiumUserDashboard from "./PremiumUserDashboard";
import PlayScreen from "./PlayScreen";
import ProfileScreen from "./ProfileScreen";
import FriendsScreen from "./FriendsScreen";
import QuizPlayScreen from "./QuizPlayScreen";
import QuizOverviewScreen from "./QuizOverviewScreen";
import ResultScreen from "./ResultScreen";
import StackQuiz from "../screens/Puzzles/StackQuiz";
import LinkedListPuzzle from "../screens/Puzzles/LinkedListPuzzle";
import BubbleSortPuzzle from "../screens/Puzzles/BubbleSortPuzzle";
import BinaryTreePuzzle from "../screens/Puzzles/BinaryTreePuzzle";
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
import MCQCategoriesScreen from "./MCQCategoriesScreen";
import GeneralTriviaScreen from "./GeneralTriviaScreen";
import GamingEventLeaderboard from "./GamingEventLeaderboard";
import PendingRequestsScreen from './PendingRequestsScreen';
import SentRequestsScreen from './SentRequestsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------- Stack Navigator -------------------
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const StackScreens = ({ route }) => {
  const initialScreen = route.params?.screen || "StackHome";
  const { user } = useContext(AuthContext);
  const isPremium = user?.subscription?.isActive;

  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="StackHome" component={isPremium ? PremiumUserDashboard : UserDashboard} />
      <Stack.Screen name="StackPlay" component={PlayScreen} />
      <Stack.Screen name="StackProfile" component={ProfileScreen} />
      <Stack.Screen name="StackFriends" component={FriendsScreen} />
      <Stack.Screen name="PremiumDashboard" component={SubscriptionScreen} />
      <Stack.Screen name="QuizOverviewScreen" component={QuizOverviewScreen} />
      <Stack.Screen name="QuizPlayScreen" component={QuizPlayScreen} />
      <Stack.Screen name="AttemptReviewScreen" component={require("./AttemptReviewScreen").default} />
      <Stack.Screen name="PreviousAttemptsScreen" component={require("./PreviousAttemptsScreen").default} />
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
      <Stack.Screen name="MCQCategoriesScreen" component={MCQCategoriesScreen} />
      <Stack.Screen name="MCQListScreen" component={require("./MCQListScreen").default} />
    </Stack.Navigator>
  );
};

// ------------------- Bottom Tab Navigator -------------------
export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#701a75", // Your main purple
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

            if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Play") {
            iconName = focused ? "game-controller" : "game-controller-outline";
          } else if (route.name === "Friends") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // Return the icon directly
          return <Ionicons name={iconName} size={size} color={color} />;
        },
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    height: 105,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingBottom: 50,
    paddingTop: -27,
    // Add shadow so it's visible
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
});
