import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av'; // Import Audio

const { width } = Dimensions.get("window");
const SYMBOLS = ["◆", "●", "■", "▲", "★", "✦", "⬟", "⬢", "⬣", "⬤"];

export default function VisualPuzzlesScreen({ navigation }) {
  const [gameState, setGameState] = useState("menu");
  const [gameMode, setGameMode] = useState("easy");
  const [grid, setGrid] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  
  const [oddIndex, setOddIndex] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [combo, setCombo] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const flashAnim = useRef(new Animated.Value(0)).current;

  // --- AUDIO CONFIGURATION ---
  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true, // Crucial for iPhone users
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.log("Audio Setup Error:", e);
      }
    }
    setupAudio();
  }, []);

  const playSound = async (type) => {
    if (isMuted) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        type === 'correct' 
          ? { uri: 'https://www.soundjay.com/buttons/sounds/button-37a.mp3' } // Replace with your local assets
          : { uri: 'https://www.soundjay.com/buttons/sounds/button-10.mp3' }
      );
      await sound.playAsync();
      // Unload from memory after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (error) {
      console.log("Playback Error:", error);
    }
  };

  const gridCount = useMemo(() => {
    if (gameMode === "hard") return 20;
    if (gameMode === "medium") return 16;
    return 12;
  }, [gameMode]);

  const generateLevel = useCallback((mode) => {
    const total = mode === "hard" ? 20 : mode === "medium" ? 16 : 12;
    const base = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    let odd = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    while (odd === base) {
      odd = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
    const newGrid = Array(total).fill(base);
    const newOddIndex = Math.floor(Math.random() * total);
    newGrid[newOddIndex] = odd;
    
    setGrid(newGrid);
    setOddIndex(newOddIndex);
    setShowHint(false);
    setLastActionTime(Date.now());
  }, []);

  const triggerFlash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
      Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
    ]).start();
  };

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
      playSound('correct'); // Trigger Sound
      const now = Date.now();
      const timeDiff = now - lastActionTime;
      let newCombo = timeDiff < 2000 ? combo + 1 : 0;
      setCombo(newCombo);
      
      const points = 1 + Math.floor(newCombo / 3);
      setScore((s) => s + points);
      
      if ((score + 1) % 5 === 0) {
        setTimeLeft(t => t + 2);
        triggerFlash();
      }
      generateLevel(gameMode);
    } else {
      playSound('wrong'); // Trigger Sound
      setCombo(0);
      const penalty = gameMode === "hard" ? 5 : 2;
      setTimeLeft((t) => Math.max(0, t - penalty));
    }
  };

  // Timer & Hint Logic
  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) return;
    const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
        if (Date.now() - lastActionTime > 5000) {
          setShowHint(true);
        }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, lastActionTime, gameState]);

  const getGameOverData = () => {
    if (score > 40) return { emoji: "🚀", rank: "Galactic Explorer" };
    if (score > 20) return { emoji: "🐆", rank: "Speedy Cheetah" };
    return { emoji: "🐢", rank: "Patient Turtle" };
  };

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f8fafc", "#fbbf24"]
  });

  const cardSize = {
    width: gameMode === "hard" ? width / 5 - 12 : width / 4 - 15,
    height: gameMode === "hard" ? 65 : 80,
    fontSize: gameMode === "hard" ? 28 : 38,
  };

  if (gameState === "menu") {
    // Project theme colors
    const THEME_EASY = '#4a044e'; // Deep purple
    const THEME_MEDIUM = '#fbbf24'; // Amber
    const THEME_HARD = '#701a75'; // Darker purple
    return (
      <View style={[styles.container, styles.menuContainer]}>
        <Ionicons name="eye" size={80} color={THEME_HARD} />
        <Text style={styles.menuTitle}>Visual Puzzles</Text>
        <Text style={styles.menuSub}>Select Difficulty to Start</Text>

        <TouchableOpacity style={[styles.menuBtn, {backgroundColor: THEME_EASY}]} onPress={() => startGame('easy')}>
          <Text style={styles.menuBtnText}>EASY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuBtn, {backgroundColor: THEME_MEDIUM}]} onPress={() => startGame('medium')}>
          <Text style={styles.menuBtnText}>MEDIUM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuBtn, {backgroundColor: THEME_HARD}]} onPress={() => startGame('hard')}>
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
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
          <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={24} color="#701a75" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{score} {combo >= 3 ? `🔥 x${Math.floor(combo/3) + 1}` : ""}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.statLabel}>TIME LEFT</Text>
            <Text style={[styles.statValue, timeLeft < 10 && {color: 'red'}]}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {grid.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            style={[
                styles.card, 
                { width: cardSize.width, height: cardSize.height },
                showHint && index === oddIndex && styles.hintCard
            ]}
          >
            <Text style={[styles.cardText, { fontSize: cardSize.fontSize }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {timeLeft <= 0 && (
        <View style={styles.gameOverOverlay}>
            <View style={styles.gameOverCard}>
                <Text style={styles.emojiText}>{getGameOverData().emoji}</Text>
                <Text style={styles.gameOverTitle}>GAME OVER</Text>
                <Text style={styles.rankText}>{getGameOverData().rank}</Text>
                <Text style={styles.finalScore}>Final Score: {score}</Text>
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
  menuSub: { fontSize: 16, color: '#64748b', marginBottom: 30 },
  menuBtn: { width: '70%', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 5 },
  menuBtnText: { color: 'white', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#701a75", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "900", color: "#1e1b4b" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 25, marginBottom: 15 },
  statLabel: { fontSize: 10, fontWeight: "800", color: "#94a3b8", letterSpacing: 1 },
  statValue: { fontSize: 24, fontWeight: "900", color: "#1e1b4b" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, paddingHorizontal: 10 },
  card: { backgroundColor: "#ffffff", borderRadius: 15, alignItems: "center", justifyContent: "center", elevation: 3 },
  hintCard: { borderWidth: 3, borderColor: "#f59e0b", backgroundColor: "#fffbeb" },
  cardText: { color: "#4a044e", fontWeight: "900" },
  gameOverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(30, 27, 75, 0.85)", justifyContent: "center", alignItems: "center", zIndex: 10 },
  gameOverCard: { width: "80%", backgroundColor: "white", borderRadius: 25, padding: 30, alignItems: "center" },
  emojiText: { fontSize: 60, marginBottom: 10 },
  gameOverTitle: { fontSize: 28, fontWeight: "900", color: "#1e1b4b" },
  rankText: { fontSize: 16, color: "#701a75", fontWeight: "700", marginBottom: 5 },
  finalScore: { fontSize: 18, color: "#64748b", marginBottom: 20 },
  retryButton: { backgroundColor: "#f59e0b", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30 },
  retryText: { color: "#ffffff", fontWeight: "900", fontSize: 16 },
});