import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME = "#a21caf";

export default function GamingEventDetail({ route, navigation }) {
  const { eventId } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [countdown, setCountdown] = useState("");
  const timerRef = useRef(null);

  const computeCountdown = (ev) => {
    if (!ev) return "";
    const now = new Date();
    const start = new Date(ev.startTime);
    const end = new Date(ev.endTime);
    let diff;
    if (now < start) {
      diff = start - now; // until start
    } else if (now >= start && now <= end) {
      diff = end - now; // until end
    } else {
      return "Completed";
    }
    const hh = Math.floor(diff / 1000 / 3600);
    const mm = Math.floor((diff / 1000 % 3600) / 60);
    const ss = Math.floor(diff / 1000 % 60);
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/gaming-events/${eventId}`);
      setEvent(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!event) return;
    setCountdown(computeCountdown(event));
    timerRef.current = setInterval(() => setCountdown(computeCountdown(event)), 1000);
    return () => clearInterval(timerRef.current);
  }, [event]);

  const joinEvent = async () => {
    try {
      const res = await axios.post(`${API_BASE}/gaming-events/${eventId}/join`, { userId: user._id });
      if (res.data?.attemptId) {
        // Successfully joined or continuing existing attempt
        navigation.navigate("GamingEventPlay", { eventId, attemptId: res.data.attemptId });
      } else {
        Alert.alert("Joined", "You can now start the quiz.");
        navigation.navigate("GamingEventPlay", { eventId });
      }
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message || e.message;
      const finished = e?.response?.data?.finished;
      
      // Handle 409 - already completed
      if (status === 409 && finished) {
        Alert.alert(
          "Already Completed",
          "You have already completed this event. Check the leaderboard to see your score!",
          [{ text: "OK" }]
        );
      } else if (status === 402) {
        Alert.alert("Insufficient Coins", `You need ${event.entryCostCoins || 0} coins to join this event.`);
      } else if (status === 403) {
        Alert.alert("Event Not Live", "This event is not currently available.");
      } else {
        Alert.alert("Cannot Join", msg);
      }
    }
  };

  if (loading) return <ActivityIndicator color={THEME} style={{ marginTop: 16 }} />;
  if (!event) return null;

  const now = new Date();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const isLive = now >= start && now <= end;
  const isUpcoming = now < start;

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Ionicons name="trophy" size={40} color="#fff" />
        <Text style={styles.heroTitle}>{event.title}</Text>
        <Text style={styles.heroText}>{event.description || "No description"}</Text>
        <Text style={styles.countdown}>{isUpcoming ? `Starts in ${countdown}` : isLive ? `Ends in ${countdown}` : "Completed"}</Text>
      </View>

      <View style={styles.infoRow}>
  <Info label="Questions" value={(event?.questions?.length) || event.totalQuestions} />
        <Info label="Difficulty" value={event.difficulty} />
        <Info label="Mode" value={event.mode} />
      </View>

      <View style={{ marginTop: 16 }}>
        {isLive ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={joinEvent}>
            <Text style={styles.btnText}>Join & Play</Text>
          </TouchableOpacity>
        ) : isUpcoming ? (
          <View style={styles.secondaryBanner}><Text style={styles.secondaryText}>Event not started yet</Text></View>
        ) : (
          <View style={styles.secondaryBanner}><Text style={styles.secondaryText}>Event Completed</Text></View>
        )}
      </View>
    </View>
  );
}

const Info = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  hero: { backgroundColor: THEME, paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 8 },
  heroText: { color: "#f5f3ff", marginTop: 6 },
  countdown: { color: "#fff", marginTop: 8, fontWeight: "700" },
  infoRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 16 },
  infoItem: { alignItems: "center", padding: 12, backgroundColor: "#faf5ff", borderRadius: 12, width: "30%" },
  infoLabel: { fontSize: 12, color: "#6b21a8" },
  infoValue: { fontSize: 16, fontWeight: "800", color: "#2d0c57", marginTop: 4 },
  primaryBtn: { backgroundColor: THEME, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginHorizontal: 16 },
  btnText: { color: "#fff", fontWeight: "800" },
  secondaryBanner: { backgroundColor: "#f3f4f6", padding: 14, borderRadius: 12, alignItems: "center", marginHorizontal: 16 },
  secondaryText: { color: "#374151", fontWeight: "700" },
});
