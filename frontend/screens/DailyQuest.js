import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Animated, Alert, Dimensions } from "react-native";
import DailyQuestSkeleton from "../components/DailyQuestSkeleton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const DAILY_TARGET = 5;

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
      setQuest(questRes.data || { quizzesAttemptedToday: 0, completedToday: false });
      setStreak(streakRes.data?.streak || { currentStreak: 0 });

      const progress = Math.min((questRes.data?.quizzesAttemptedToday || 0) / DAILY_TARGET, 1);
      Animated.spring(progressAnim, {
        toValue: progress,
        tension: 20,
        friction: 7,
        useNativeDriver: false,
      }).start();
    } catch (err) {
      console.error("DailyQuest error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user?._id]);

  if (loading) return <DailyQuestSkeleton />;

  const progressPercentage = Math.min((quest.quizzesAttemptedToday / DAILY_TARGET) * 100, 100);
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* --- Section Header --- */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="fire" size={20} color="#701a75" />
          </View>
          <View>
            <Text style={styles.mainTitle}>Daily Quest</Text>
            <Text style={styles.subTitle}>Complete daily challenges</Text>
          </View>
        </View>
       

        <View style={styles.streakBadge}>
          <MaterialCommunityIcons name="fire" size={16} color="#701a75" />
          <Text style={styles.streakText}>{streak.currentStreak || 0}d</Text>
        </View>
      </View>

      {/* --- Main Quest Card --- */}
      <View style={styles.questCard}>
        <LinearGradient
           colors={["#4a044e", "#701a75"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Abstract Background Shapes */}
          <View style={styles.circleOverlay} />
          
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.questSubtitle}>Goal: Solve {DAILY_TARGET} Puzzles</Text>
              <View style={styles.counterRow}>
                <Text style={styles.currentCount}>{quest.quizzesAttemptedToday}</Text>
                <Text style={styles.targetCount}>/{DAILY_TARGET}</Text>
              </View>
            </View>

            <View style={styles.iconCircle}>
                <MaterialCommunityIcons 
                    name={quest.completedToday ? "trophy-award" : "sword-cross"} 
                    size={32} 
                    color="#fde68a" 
                />
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { width: progressWidth }]}>
                <LinearGradient
                  colors={["#fde68a", "#fbbf24"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </View>
            <View style={styles.progressFooter}>
               <Text style={styles.progressLabel}>
                 {quest.completedToday ? "Quest Completed!" : `${Math.round(progressPercentage)}% toward today's reward`}
               </Text>
               <MaterialCommunityIcons name="gift" size={16} color="#fde68a" />
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e1b4b',
  },
  subTitle: {
    fontSize: 11,
    color: '#701a75',
    fontWeight: '700',
    marginTop: -2,
  },
  streakBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fdf4ff', 
    paddingHorizontal: 10, 
    borderRadius: 12, 
    padding:4,

  },
  streakText: { fontSize: 13, fontWeight: '800', color: '#701a75', marginLeft: 4 },
  
  questCard: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  cardGradient: { padding: 22, position: 'relative' },
  circleOverlay: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20
  },
  questSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  counterRow: { flexDirection: 'row', alignItems: 'baseline' },
  currentCount: { color: '#fff', fontSize: 38, fontWeight: '900' },
  targetCount: { color: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: '700', marginLeft: 2 },
  
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  progressContainer: { marginTop: 5 },
  track: { 
    height: 10, 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: 5, 
    overflow: 'hidden',
    marginBottom: 10
  },
  fill: { height: '100%', borderRadius: 5 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: '#e9d5ff', fontSize: 12, fontWeight: '700' }
});