import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Animated, Alert } from "react-native";
import DailyQuestSkeleton from "../components/DailyQuestSkeleton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const DAILY_TARGET = 5; // Target quizzes per day

export default function DailyQuest({ navigation }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [quest, setQuest] = useState({ quizzesAttemptedToday: 0, completedToday: false, streak: 0 });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [progressAnim] = useState(new Animated.Value(0));

  const fetchData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const questRes = await axios.get(`${API_BASE}/daily-quests/${user._id}`);
      const streakRes = await axios.get(`${API_BASE}/streaks/${user._id}`);

      setQuest(questRes.data || { quizzesAttemptedToday: 0, completedToday: false, streak: 0 });
      setStreak(streakRes.data?.streak || { currentStreak: 0, longestStreak: 0 });

      // Animate progress bar
      const progress = Math.min((questRes.data?.quizzesAttemptedToday || 0) / DAILY_TARGET, 1);
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } catch (err) {
      console.error("DailyQuest fetch error:", err?.response?.data || err.message || err);
      Alert.alert("Error", "Could not load daily quest data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  if (loading) {
    return <DailyQuestSkeleton />;
  }

  const progressPercentage = Math.min((quest.quizzesAttemptedToday / DAILY_TARGET) * 100, 100);
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

    return (
      <View className="px-4 mb-3">

        <View className="flex-row items-center gap-2 mt-2 mb-1 px-2">
          <Ionicons name="calendar-outline" size={28} color="#a21caf" />
          <Text className="text-[18px] font-extrabold font-[Inter] bg-gradient-to-r from-violet-700 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md tracking-wide">Daily Quest</Text>
        </View>
         
        {/* Decorative Dots and Icon */}
        <View className="flex-row justify-center items-center mb-2">
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              className={
                `w-2 h-2 rounded-full mx-1 ` +
                (i % 3 === 0
                  ? 'bg-fuchsia-400'
                  : i % 3 === 1
                  ? 'bg-violet-400'
                  : 'bg-pink-300')
              }
            />
          ))}
          <MaterialCommunityIcons name="star-four-points" size={18} color="#a21caf" style={{ marginLeft: 8, marginRight: 2 }} />
        </View>
        {/* Daily Quest Card */}
<View className="rounded-3xl p-[2px] bg-gray-100">

  <LinearGradient
    colors={["#701a75", "#a21caf", "#c026d3"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: 24,
      padding: 20,
      overflow: "hidden", // 🔴 VERY IMPORTANT
    }}
  >

    {/* 🔮 PATTERN OVERLAY */}
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.07,
        backgroundColor: "transparent",
      }}
    >
      {/* Dots using repeated Views */}
      {Array.from({ length: 40 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            top: Math.random() * 300,
            left: Math.random() * 300,
          }}
        />
      ))}
    </View>

    <View>

      <View className="flex-row items-center mb-4 space-x-2">
        <MaterialCommunityIcons name="fire" size={26} color="#ffd166" />
        <Text className="text-white font-extrabold text-lg font-[Inter]">
          {streak.currentStreak || 0} Day Streak
        </Text>
      </View>

      <Text className="text-purple-100 font-semibold mb-2 font-[Inter]">
        Complete <Text className="text-white font-bold">{DAILY_TARGET}</Text> quizzes today!
      </Text>

      <Text className="text-white text-4xl font-extrabold mb-4 font-[Inter]">
        {quest.quizzesAttemptedToday}/{DAILY_TARGET}
      </Text>

      {/* Progress Track */}
      <View className="h-3 bg-white/25 rounded-full overflow-hidden my-3">
        <Animated.View style={{ width: progressWidth, height: "100%" }}>
          <LinearGradient
            colors={["#fde68a", "#facc15", "#f59e0b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>

      <Text className="text-center text-purple-100 font-bold text-sm font-[Inter]">
        {progressPercentage.toFixed(0)}% Complete
      </Text>

    </View>

  </LinearGradient>
</View>
</View>

    );
}
