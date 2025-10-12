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
  Platform,
  Dimensions,
} from "react-native";
import axios from "axios";
import Svg, { Rect, Defs, LinearGradient, Stop, Circle, Path } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { AuthContext } from "../context/AuthContext";

const THEME_COLOR = "#a21caf";
const PRIMARY_TEXT_COLOR = "#2d0c57";
const SECONDARY_TEXT_COLOR = "#4a4a6a";

const PADDING_HORIZONTAL = 20;
const CARD_MARGIN = 10;
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / 2;

// ------------------- REUSABLE PUZZLE CARD -------------------
const PuzzleCard = ({
  title,
  subtitle,
  iconName,
  iconColor = THEME_COLOR,
  onPress,
  isActionable = true,
  showIndicator = true,
  indicatorText = "Start",
  backgroundColor = "rgba(162, 28, 175, 0.1)",
  borderColor = THEME_COLOR,
  category,
  isGrid = false,
  index = 0,
  attempted = false, // NEW: highlight attempted
}) => {
  // Card styling based on attempt
  const cardBackground = isGrid
    ? "#fff"
    : attempted
    ? "rgba(162, 28, 175, 0.2)"
    : backgroundColor;

  const cardBorder = attempted ? "#ff9900" : borderColor;

  return (
    <TouchableOpacity
      style={[
        isGrid ? verticalListStyles.cardWrapper : continueStyles.card,
        { backgroundColor: cardBackground, borderLeftColor: cardBorder },
        isGrid && index % 2 === 0 ? { marginRight: CARD_MARGIN } : null,
      ]}
      onPress={onPress}
      activeOpacity={isActionable ? 0.7 : 1}
    >
      {/* Grid card background */}
      {isGrid && (
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id={`cardGradient-${subtitle}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <Stop offset="100%" stopColor="#f7f7f7" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill={`url(#cardGradient-${subtitle})`} rx="12" ry="12" />
          </Svg>
        </View>
      )}

      <View style={isGrid ? verticalListStyles.cardContent : continueStyles.textContainer}>
        {/* Icon & Title */}
        {iconName && (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
            <Text style={[continueStyles.statusText, { marginLeft: 6 }]}>{title}</Text>
          </View>
        )}
        {!iconName && title && <Text style={continueStyles.statusText}>{title}</Text>}

        {/* Subtitle */}
        <Text style={verticalListStyles.puzzleName} numberOfLines={2}>
          {subtitle}
        </Text>

        {/* Category for Grid cards */}
        {category && <Text style={verticalListStyles.categoryText}>{category}</Text>}

        {/* Attempted badge */}
        {attempted && (
          <View style={verticalListStyles.attemptedBadge}>
            <Text style={verticalListStyles.attemptedBadgeText}>Attempted</Text>
          </View>
        )}

        {/* Indicator for non-grid cards */}
        {showIndicator && !isGrid && (
          <View style={continueStyles.progressIndicator}>
            <Text style={continueStyles.progressText}>{indicatorText}</Text>
            <View style={[continueStyles.progressDot, { backgroundColor: iconColor }]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ------------------- MAIN SCREEN -------------------
export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [puzzles, setPuzzles] = useState([]);
  const [lastUnsubmittedPuzzle, setLastUnsubmittedPuzzle] = useState(null);
  const [attemptedPuzzleIds, setAttemptedPuzzleIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all puzzles
  const fetchPuzzles = async () => {
    try {
      const res = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all?userId=${user._id}`
      );
      const allPuzzles = res.data;
      setPuzzles(allPuzzles);

      const unsubmitted = allPuzzles.filter((p) => !p.isSubmitted);
      setLastUnsubmittedPuzzle(unsubmitted.length ? unsubmitted[0] : null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not load puzzles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch attempted puzzle IDs
  const fetchAttemptedPuzzles = async () => {
    try {
      const res = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/attempts/attempted-puzzles/${user._id}`
      );
      if (res.data.success) setAttemptedPuzzleIds(res.data.attemptedPuzzleIds);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPuzzles();
      fetchAttemptedPuzzles();
    }
  }, [user]);

  if (loading)
    return <ActivityIndicator size="large" color={THEME_COLOR} style={styles.loadingIndicator} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#f8f4fb" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#backgroundGradient)" />
          <Circle cx="10%" cy="5%" r="50" fill={THEME_COLOR} fillOpacity="0.15" />
          <Circle cx="95%" cy="30%" r="60" fill={THEME_COLOR} fillOpacity="0.1" />
          <Rect x="5%" y="60%" width="100" height="60" fill={THEME_COLOR} fillOpacity="0.08" rx="15" ry="15" />
          <Path d="M 0 400 Q 150 350 300 400 L 300 500 L 0 500 Z" fill={THEME_COLOR} fillOpacity="0.1" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Daily Puzzle */}
        <Text style={styles.sectionTitle}>Today's Puzzle</Text>
        <PuzzleCard
          title="Today's Puzzle"
          subtitle="Stack Quiz"
          iconName="bullseye-arrow"
          onPress={() => navigation.navigate("StackQuizScreen", { puzzleId: "daily" })}
        />

        {/* Continue Playing */}
        <Text style={styles.sectionTitle}>Continue Playing</Text>
        <PuzzleCard
          title={lastUnsubmittedPuzzle ? "Your Current Challenge" : "All Puzzles Complete"}
          subtitle={lastUnsubmittedPuzzle ? lastUnsubmittedPuzzle.name : "Start a New Challenge Below!"}
          onPress={() =>
            lastUnsubmittedPuzzle
              ? navigation.navigate("StackQuizScreen", { puzzleId: lastUnsubmittedPuzzle._id })
              : Alert.alert("Success!", "You have completed all available puzzles.")
          }
          isActionable={!!lastUnsubmittedPuzzle}
          indicatorText={lastUnsubmittedPuzzle ? "Resume" : "Browse"}
          attempted={lastUnsubmittedPuzzle && attemptedPuzzleIds.includes(lastUnsubmittedPuzzle._id)}
        />

        {/* Grid Puzzles */}
        {puzzles.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Quizzes</Text>
            <View style={verticalListStyles.grid}>
              {puzzles.map((puzzle, index) => (
                <PuzzleCard
                  key={puzzle._id}
                  subtitle={puzzle.name}
                  category={puzzle.category}
                  isGrid={true}
                  index={index}
                  attempted={attemptedPuzzleIds.includes(puzzle._id)}
                  onPress={() => navigation.navigate("StackQuizScreen", { puzzleId: puzzle._id })}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  loadingIndicator: { flex: 1, justifyContent: "center" },
  scrollContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginTop: 20,
    marginBottom: 15,
    zIndex: 1,
    paddingHorizontal: 5,
  },
});

const verticalListStyles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", width: "100%" },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 190,
    borderRadius: 12,
    marginBottom: CARD_MARGIN * 1.5,
    ...Platform.select({
      ios: { shadowColor: PRIMARY_TEXT_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  cardContent: { flex: 1, padding: 15, borderRadius: 12, justifyContent: "space-between", zIndex: 10 },
  puzzleName: { fontSize: 16, fontWeight: "800", color: PRIMARY_TEXT_COLOR },
  categoryText: { fontSize: 12, fontWeight: "600", color: SECONDARY_TEXT_COLOR, marginTop: 6 },
  attemptedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff9900",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  attemptedBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});

const continueStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(162, 28, 175, 0.1)",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR,
    marginBottom: 15,
  },
  textContainer: { flex: 1, marginRight: 10 },
  statusText: { fontSize: 14, fontWeight: "700", color: THEME_COLOR, marginBottom: 4 },
  progressIndicator: { flexDirection: "row", alignItems: "center" },
  progressText: { fontSize: 14, fontWeight: "600", color: THEME_COLOR, marginRight: 8 },
  progressDot: { width: 10, height: 10, borderRadius: 5 },
});

