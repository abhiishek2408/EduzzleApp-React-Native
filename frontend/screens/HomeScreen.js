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
} from "react-native";
import axios from "axios";
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Ellipse,
  Line,
  Polyline,
  Polygon,
  Path,
} from "react-native-svg";

import { AuthContext } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPuzzles = async () => {
    try {
      const res = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all?userId=${user._id}`
      );
      setPuzzles(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not load puzzles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchPuzzles();
  }, [user]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Background SVG */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="300%" width="100%">
          <Defs>
            <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#f9f3fbff" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#a52096ff" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill="url(#backgroundGradient)" />

          {/* Decorative shapes */}
          <Circle cx="15%" cy="10%" r="35" fill="#F3E5F5" fillOpacity="0.6" />
          <Circle cx="85%" cy="25%" r="45" fill="#a111b7ff" fillOpacity="0.4" />
          <Circle cx="40%" cy="45%" r="30" fill="#F3E5F5" fillOpacity="0.5" />
          <Ellipse cx="70%" cy="10%" rx="30" ry="20" fill="#E0F7FA" fillOpacity="0.7" />
          <Ellipse cx="25%" cy="80%" rx="40" ry="25" fill="#a111b7ff" fillOpacity="0.3" />
          <Rect x="5%" y="55%" width="60" height="40" fill="#E0F7FA" fillOpacity="0.6" rx="10" ry="10" />
          <Rect x="80%" y="70%" width="50" height="70" fill="#F3E5F5" fillOpacity="0.5" />
          <Line x1="10%" y1="90%" x2="40%" y2="75%" stroke="#a111b7ff" strokeWidth="2" strokeOpacity="0.7" />
          <Line x1="60%" y1="15%" x2="95%" y2="40%" stroke="#E0F7FA" strokeWidth="3" strokeOpacity="0.5" />
          <Polyline points="50,5 60,20 40,20 50,5" fill="#F3E5F5" fillOpacity="0.4" stroke="#a111b7ff" strokeWidth="1" />
          <Polyline points="5,50 15,40 25,50 15,60" fill="#E0F7FA" fillOpacity="0.6" stroke="#F3E5F5" strokeWidth="1" />
          <Polygon points="60,60 70,75 60,90 50,75" fill="#a111b7ff" fillOpacity="0.3" stroke="#F3E5F5" strokeWidth="1" />
          <Polygon points="10,10 20,10 25,20 20,30 10,30 5,20" fill="#E0F7FA" fillOpacity="0.5" stroke="#a111b7ff" strokeWidth="1" />
          <Path d="M 5 5 Q 20 0 35 5 Q 50 10 65 5" stroke="#F3E5F5" strokeWidth="2" fill="none" strokeOpacity="0.8" />
          <Path d="M 90 90 L 80 95 C 70 100 60 90 50 95 L 40 85" stroke="#a111b7ff" strokeWidth="3" fill="none" strokeOpacity="0.6" />
        </Svg>
      </View>

      <Text style={styles.title}>Choose a Puzzle to Start</Text>
      <View style={styles.grid}>
        {puzzles.map((puzzle) => (
          <View key={puzzle._id} style={styles.card}>
            <Text style={styles.puzzleName}>{puzzle.name}</Text>
            <Text style={styles.description}>{puzzle.description}</Text>
            <Text style={styles.details}>Category: {puzzle.category}</Text>

      
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "StackQuiz",
                  params: { puzzleId: puzzle._id },
                })
              }
            >
              <Text style={styles.buttonText}>Start Test</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "100",
    color: "#2d3436",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "#dfe6e9",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: Platform.OS === "web" ? "30%" : "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: "hidden",
  },
  puzzleName: { fontSize: 20, fontWeight: "400", marginBottom: 8, color: "#2d0c57" },
  description: { fontSize: 15, color: "#4a4a6a", marginBottom: 12 },
  details: { fontSize: 13, color: "#5e5e7b", marginBottom: 18 },
  button: {
    backgroundColor: "#a21caf",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "500" },
});
