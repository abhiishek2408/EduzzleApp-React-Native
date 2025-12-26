import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import axios from "axios";
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Path,
} from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import QuizCard, { QuizCardSection } from "../components/QuizCard";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import LogoHeader from "./LogoHeader";
import DailyQuest from "./DailyQuest";
import GamingEventsSection from "./GamingEventsSection";
import FriendsLeaderboard from "../components/FriendsLeaderboard";
import GlobalLeaderboard from "../components/GlobalLeaderboard";
import CardSkeleton from "../components/CardSkeleton";
import PuzzlesScreen from "./PuzzlesScreen";
import HelpDesk from "../components/HelpDesk";
import ReviewUs from "../components/ReviewUs";
import RecommendedPuzzlesSection from "../screens/PuzzlesScreen";

// ...existing code...

const categories = [
  {
    name: "Quick Quizzes",
    icon: "flash-outline",
    color: "#FFF9E6",
    iconColor: "#FACC15",
    link: "QuizzesScreen",
  },
  {
    name: "Visual Puzzles",
    icon: "grid-outline",
    color: "#E6FFFA",
    iconColor: "#14B8A6",
    link: "VisualPuzzlesScreen",
  },
  {
    name: "Logic Challenges",
    icon: "location-outline",
    color: "#FFEAF2",
    iconColor: "#EC4899",
    link: "LogicChallengesScreen",
  },
  
  {
    name: "Gaming Events",
    icon: "book-outline",
    color: "#EEF2FF",
    iconColor: "#6366F1",
    link: "GamingEventsList",
  },
];

//

// ------------------- MAIN SCREEN -------------------
export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const route = useRoute();


  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <CardSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#a21caf" />


      <View className="absolute inset-0 bg-white" />

      <ScrollView className="flex-grow pb-10">
        <LogoHeader />

        <View className="flex-row items-center mb-4 mt-6 pl-4">
          <View className="flex-row items-center gap-2 pl-0 ml-0">
            <Ionicons name="trophy-outline" size={28} color="#a21caf" />
            <Text className="text-[18px] font-extrabold bg-gradient-to-r from-violet-700 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md tracking-wide">
              Game Categories
            </Text>
          </View>
        </View>

        {/* Categories Grid */}
        <View className="flex-row flex-wrap justify-between px-2">
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[46%] mb-4 py-5 rounded-2xl flex-row items-center justify-center shadow-md"
              style={{ backgroundColor: item.color }}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.link)}
            >
              <View className="mr-2">
                <Ionicons name={item.icon} size={24} color={item.iconColor} />
              </View>
              <Text className="text-[15px] font-semibold text-gray-700">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quiz Section - logic moved to QuizCard.js */}
        <QuizCardSection navigation={navigation} user={user} route={route} />

        {/* Daily Quest */}
        <DailyQuest navigation={navigation} />

        {/* Gaming Events below Daily Quest */}
        <GamingEventsSection navigation={navigation} />

        {/* Friends Leaderboard */}
        <View className="mx-4">
          <FriendsLeaderboard navigation={navigation} />
        </View>

    
        <View className="mx-4">
          <GlobalLeaderboard navigation={navigation} />
        </View>

        <View className="mx-4">
          <PuzzlesScreen navigation={navigation} />
        </View> 

        {/* Help Desk Section */}
        <View className="mx-4">
          <HelpDesk />
        </View>

        {/* Review Us Section */}
        <View className="mx-4">
          <ReviewUs />
        </View>

      </ScrollView>
    </View>
  );
}


