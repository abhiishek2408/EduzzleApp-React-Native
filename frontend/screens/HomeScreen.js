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
import QuizCard, { QuizScreen } from "../components/QuizScreen";
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
    name: "MCQ Bank",
    icon: "help-circle-outline",
    color: "#E0F2FE",
    iconColor: "#0EA5E9",
    link: "MCQCategoriesScreen",
    // This screen should allow users to browse MCQs subject-wise, course-wise, syllabus-wise, category-wise, and topic-wise.
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

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
            <View style={{ backgroundColor: '#fdf4ff', padding: 8, borderRadius: 12, marginRight: 10 }}>
              <Ionicons name="rocket-outline" size={20} color="#701a75" />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e1b4b' }}>Game Categories</Text>
              <Text style={{ fontSize: 11, color: '#701a75', fontWeight: '700', marginTop: -2 }}>Choose your challenge</Text>
            </View>
          </View>
        </View>

        {/* Categories Grid */}
        <View className="flex-row flex-wrap justify-between px-6">
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
        <QuizScreen navigation={navigation} user={user} route={route} />

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


