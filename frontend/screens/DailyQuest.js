import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Animated, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const DAILY_TARGET = 3; // Target quizzes per day

export default function DailyQuest({ navigation }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [quest, setQuest] = useState({ quizzesAttempted: 0, completed: false });
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [progressAnim] = useState(new Animated.Value(0));

  const fetchData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const questRes = await axios.get(`${API_BASE}/daily-quests/${user._id}`);
      const streakRes = await axios.get(`${API_BASE}/streaks/${user._id}`);

      setQuest(questRes.data || { quizzesAttempted: 0, completed: false });
      setStreak(streakRes.data?.streak || { currentStreak: 0, longestStreak: 0 });

      // Animate progress bar
      const progress = Math.min((questRes.data?.quizzesAttempted || 0) / DAILY_TARGET, 1);
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

  if (loading) return <ActivityIndicator size="small" color="#a21caf" style={{ marginVertical: 12 }} />;

  const progressPercentage = Math.min((quest.quizzesAttempted / DAILY_TARGET) * 100, 100);
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="trophy-award" size={28} color="#a21caf" />
        <Text style={styles.title}>Daily Quest</Text>
      </View>

      <LinearGradient
        colors={['#fdf4ff', '#fae8ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.streakContainer}>
          <MaterialCommunityIcons name="fire" size={24} color="#ff6b35" />
          <Text style={styles.streakText}>{streak.currentStreak || 0} Day Streak</Text>
        </View>

        <Text style={styles.questText}>Complete {DAILY_TARGET} quizzes today!</Text>
        <Text style={styles.questValue}>{quest.quizzesAttempted} / {DAILY_TARGET}</Text>

        {/* Animated Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
            <LinearGradient
              colors={['#a21caf', '#c026d3', '#e879f9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
        
        <Text style={styles.progressText}>{progressPercentage.toFixed(0)}% Complete</Text>

        {quest.completed && (
          <View style={styles.completedBadge}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.completedText}>Quest Completed! 🎉</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginBottom: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#2d0c57" },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#a21caf",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff6b35",
  },
  questText: { fontSize: 14, color: "#666", marginBottom: 6 },
  questValue: { fontSize: 32, color: "#a21caf", fontWeight: "900", marginBottom: 12 },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 20,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "#d1fae5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
  },
});
