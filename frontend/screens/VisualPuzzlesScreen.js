import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this package

const { width, height } = Dimensions.get("window");

const SYMBOLS = [
  "◆", "●", "■", "▲", "★", "✦", "⬟", "⬢", "⬣", "⬤", 
  "✖", "✚", "⧓", "⬦", "⬥", "⌗", "⚝", "⚛", "❂", "❃",
  "➔", "➲", "➸", "➹", "◈", "▣", "▤", "▥", "▦", "▧",
  "∞", "≈", "≠", "≡", "∏", "∑", "√", "∝", "∠", "⊥",
  "₪", "₮", "₭", "₲", "₳", "₴", "₵", "₿", "℥", "℧"
];

export default function VisualPuzzlesScreen({ navigation }) {
  const [gameState, setGameState] = useState("menu");
  const [gameMode, setGameMode] = useState("easy");
  const [grid, setGrid] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); // High score state
  
  const [oddIndex, setOddIndex] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [combo, setCombo] = useState(0);
  
  const flashAnim = useRef(new Animated.Value(0)).current;

  // --- STORAGE LOGIC ---
  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem('@puzzle_high_score');
      if (savedScore !== null) {
        setHighScore(parseInt(savedScore));
      }
    } catch (e) {
        if (__DEV__) {
          console.log("Failed to load high score");
        }
    }
  };

  const saveHighScore = async (newScore) => {
    try {
      if (newScore > highScore) {
        setHighScore(newScore);
        await AsyncStorage.setItem('@puzzle_high_score', newScore.toString());
      }
    } catch (e) {
      if (__DEV__) {
        console.log("Failed to save high score");
      }
    }
  };

  // --- GAME LOGIC ---
  const config = useMemo(() => {
    switch(gameMode) {
      case 'hard': return { total: 45, size: width / 5 - 12, fontSize: 18, boxHeight: 50 };
      case 'medium': return { total: 32, size: width / 4 - 15, fontSize: 22, boxHeight: 60 };
      default: return { total: 24, size: width / 4 - 15, fontSize: 28, boxHeight: 75 };
    }
  }, [gameMode]);

  const generateLevel = useCallback((mode) => {
    let total = mode === 'hard' ? 45 : mode === 'medium' ? 32 : 24;
    const randomIndex1 = Math.floor(Math.random() * SYMBOLS.length);
    let randomIndex2 = Math.floor(Math.random() * SYMBOLS.length);
    while (randomIndex1 === randomIndex2) {
      randomIndex2 = Math.floor(Math.random() * SYMBOLS.length);
    }
    const newGrid = Array(total).fill(SYMBOLS[randomIndex1]);
    const newOddIndex = Math.floor(Math.random() * total);
    newGrid[newOddIndex] = SYMBOLS[randomIndex2];
    setGrid(newGrid);
    setOddIndex(newOddIndex);
    setShowHint(false);
    setLastActionTime(Date.now());
  }, []);

  const startGame = (mode) => {
    setGameMode(mode);
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setGameState("playing");
    generateLevel(mode);
  };

  const handlePress = (index) => {
    if (timeLeft <= 0) return;
    if (index === oddIndex) {
      const now = Date.now();
      const newCombo = (now - lastActionTime < 2000) ? combo + 1 : 0;
      setCombo(newCombo);
      const points = 1 + Math.floor(newCombo / 3);
      setScore((s) => s + points);
      if ((score + 1) % 5 === 0) {
        setTimeLeft(t => t + 2);
        Animated.sequence([
            Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
            Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]).start();
      }
      generateLevel(gameMode);
    } else {
      setCombo(0);
      setTimeLeft((t) => Math.max(0, t - (gameMode === "hard" ? 4 : 2)));
    }
  };

  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) {
        if (timeLeft <= 0) saveHighScore(score); // Save when time runs out
        return;
    };
    const timer = setInterval(() => {
        setTimeLeft((t) => Math.max(0, t - 1));
        if (Date.now() - lastActionTime > 5000) setShowHint(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f8fafc", "#fbbf24"]
  });

  // --- SCREENS ---
  if (gameState === "menu") {
    return (
      <View style={[styles.container, styles.menuContainer]}>
        <Ionicons name="eye" size={80} color="#701a75" />
        <Text style={styles.menuTitle}>Visual Puzzles</Text>
        
        <View style={styles.highScoreBadge}>
            <Ionicons name="trophy" size={20} color="#fbbf24" />
            <Text style={styles.highScoreText}> BEST: {highScore}</Text>
        </View>

        <TouchableOpacity style={[styles.menuBtn, {backgroundColor: '#4a044e'}]} onPress={() => startGame('easy')}>
          <Text style={styles.menuBtnText}>EASY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuBtn, {backgroundColor: '#fbbf24'}]} onPress={() => startGame('medium')}>
          <Text style={styles.menuBtnText}>MEDIUM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuBtn, {backgroundColor: '#701a75'}]} onPress={() => startGame('hard')}>
          <Text style={styles.menuBtnText}>HARD</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setGameState("menu")} style={styles.backButton}>
          <Ionicons name="home" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Visual Puzzles</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.statsRow}>
        <View>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{score} {combo >= 3 ? `🔥` : ""}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.statLabel}>TIME LEFT</Text>
            <Text style={[styles.statValue, timeLeft < 10 && {color: '#ef4444'}]}>{timeLeft}s</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {grid.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            style={[styles.card, { width: config.size, height: config.boxHeight }, showHint && index === oddIndex && styles.hintCard]}
          >
            <Text style={[styles.cardText, { fontSize: config.fontSize }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {timeLeft <= 0 && (
        <View style={styles.gameOverOverlay}>
            <View style={styles.gameOverCard}>
                <Text style={styles.emojiText}>{score >= highScore && score > 0 ? "👑" : "🐢"}</Text>
                <Text style={styles.gameOverTitle}>{score >= highScore && score > 0 ? "NEW BEST!" : "GAME OVER"}</Text>
                <Text style={styles.finalScore}>Final Score: {score}</Text>
                <Text style={styles.recordText}>Highest: {highScore}</Text>
                <TouchableOpacity onPress={() => setGameState("menu")} style={styles.retryButton}>
                    <Text style={styles.retryText}>BACK TO MENU</Text>
                </TouchableOpacity>
            </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  menuContainer: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  menuTitle: { fontSize: 32, fontWeight: '900', color: '#1e1b4b', marginTop: 10 },
  highScoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginBottom: 25, elevation: 2 },
  highScoreText: { fontWeight: 'bold', color: '#1e1b4b' },
  menuBtn: { width: '70%', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 4 },
  menuBtnText: { color: 'white', fontWeight: '900', fontSize: 18 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#701a75", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "900", color: "#1e1b4b" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 25, marginBottom: 10 },
  statLabel: { fontSize: 10, fontWeight: "800", color: "#94a3b8" },
  statValue: { fontSize: 24, fontWeight: "900", color: "#1e1b4b" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 6, paddingHorizontal: 10, paddingBottom: 20 },
  card: { backgroundColor: "#ffffff", borderRadius: 8, alignItems: "center", justifyContent: "center", elevation: 2 },
  hintCard: { borderWidth: 3, borderColor: "#fbbf24", backgroundColor: "#fffbeb" },
  cardText: { color: "#4a044e", fontWeight: "900" },
  gameOverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(30, 27, 75, 0.85)", justifyContent: "center", alignItems: "center", zIndex: 10 },
  gameOverCard: { width: "80%", backgroundColor: "white", borderRadius: 25, padding: 30, alignItems: "center" },
  emojiText: { fontSize: 60, marginBottom: 10 },
  gameOverTitle: { fontSize: 28, fontWeight: "900", color: "#1e1b4b" },
  finalScore: { fontSize: 18, color: "#64748b" },
  recordText: { fontSize: 14, color: "#fbbf24", fontWeight: 'bold', marginBottom: 20 },
  retryButton: { backgroundColor: "#fbbf24", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30 },
  retryText: { color: "#ffffff", fontWeight: "900", fontSize: 16 },
});