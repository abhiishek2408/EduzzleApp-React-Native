import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import axios from "axios";
import Svg, { Rect, Defs, Stop, Circle, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient"; // Using expo-linear-gradient for buttons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";

const THEME_DARK = "#4a044e";
const THEME_PURPLE = "#701a75";
const THEME_ACCENT = "#f3c999";
const PRIMARY_TEXT_COLOR = "#2d0c57";

const { width: screenWidth } = Dimensions.get("window");
const PADDING_HORIZONTAL = 16;
const CARD_MARGIN = 12;
const CARD_WIDTH = (screenWidth - (PADDING_HORIZONTAL * 2) - CARD_MARGIN) / 2;

// ------------------- PREMIUM QUIZ CARD -------------------
const QuizCard = ({ title, subtitle, attempted, isFree, category, onPress, index }) => {
  return (
    <View style={[styles.cardContainer, { marginRight: index % 2 === 0 ? CARD_MARGIN : 0 }]}>
      <View style={styles.cardInner}>
        
        {/* Top Badges Area */}
        <View style={styles.badgeRow}>
          <View style={[styles.freeBadge, { backgroundColor: isFree ? "#4CAF50" : "#ef4444" }]}>
            <Text style={styles.badgeText}>{isFree ? "Free" : "Pro"}</Text>
          </View>
          {attempted && (
            <View style={styles.attemptedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={12} color="#fff" />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentBox}>
          <MaterialCommunityIcons name="brain" size={24} color={THEME_PURPLE} style={{marginBottom: 4}} />
          <Text style={styles.quizTitle} numberOfLines={2}>{subtitle || title}</Text>
          {category && <Text style={styles.categoryLabel}>{category}</Text>}
        </View>

        {/* Action Button - Main BG Gradient Style */}
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.btnWrapper}>
          <LinearGradient
            colors={["#4a044e", "#701a75", "#86198f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.btnText}>Start</Text>
            <MaterialCommunityIcons name="play-circle" size={14} color={THEME_ACCENT} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ------------------- MAIN SCREEN -------------------
export default function QuizScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedQuizIds, setAttemptedQuizIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all-free-quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not load quizzes");
    } finally { setLoading(false); }
  };

  const fetchAttemptedQuizzes = async () => {
    try {
      const res = await axios.get(`https://eduzzleapp-react-native.onrender.com/api/attempts/attempted-puzzles/${user._id}`);
      if (res.data.success) setAttemptedQuizIds(res.data.attemptedPuzzleIds || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user?._id) { fetchQuizzes(); fetchAttemptedQuizzes(); }
  }, [user]);

  if (loading) return <ActivityIndicator size="large" color={THEME_PURPLE} style={{flex: 1}} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Dynamic Background SVG */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%">
          <Circle cx="90%" cy="10%" r="100" fill={THEME_PURPLE} fillOpacity="0.05" />
          <Circle cx="10%" cy="50%" r="80" fill={THEME_PURPLE} fillOpacity="0.03" />
          <Path d="M0 600 Q 150 550 300 600 L 300 800 L 0 800 Z" fill={THEME_PURPLE} fillOpacity="0.04" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Master Mind</Text>
          <Text style={styles.subTitle}>Select a challenge to begin your journey</Text>
        </View>

        <View style={styles.grid}>
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz._id}
              index={index}
              title={quiz.name}
              subtitle={quiz.name}
              category={quiz.category}
              isFree={quiz.isFree}
              attempted={attemptedQuizIds.includes(quiz._id)}
              onPress={() => navigation.navigate("QuizOverviewScreen", {
                quiz,
                userId: user._id
              })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: PADDING_HORIZONTAL, paddingTop: 24, paddingBottom: 40 },
  headerSection: { marginBottom: 25, paddingLeft: 4 },
  mainTitle: { fontSize: 28, fontWeight: "900", color: THEME_DARK, letterSpacing: -0.5 },
  subTitle: { fontSize: 14, color: "#6b7280", fontWeight: "500", marginTop: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },
  
  cardContainer: {
    width: CARD_WIDTH,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#701a75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  cardInner: { flex: 1, padding: 12, justifyContent: "space-between" },
  badgeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  freeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  attemptedBadge: { backgroundColor: "#ff9900", padding: 4, borderRadius: 10 },
  
  contentBox: { marginTop: 8 },
  quizTitle: { fontSize: 15, fontWeight: "800", color: PRIMARY_TEXT_COLOR, lineHeight: 18 },
  categoryLabel: { fontSize: 11, fontWeight: "600", color: THEME_PURPLE, marginTop: 4, opacity: 0.8 },
  
  btnWrapper: { marginTop: 10 },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6
  },
  btnText: { color: THEME_ACCENT, fontWeight: "900", fontSize: 13, letterSpacing: 0.5 }
});