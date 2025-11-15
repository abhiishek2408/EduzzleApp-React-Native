import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME = "#a21caf";

export default function GamingEventsSection({ navigation }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(Date.now());

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [liveRes, upcomingRes] = await Promise.all([
        axios.get(`${API_BASE}/gaming-events?scope=live`),
        axios.get(`${API_BASE}/gaming-events?scope=upcoming`),
      ]);
      const combined = [...(liveRes.data || []), ...(upcomingRes.data || [])];
      setEvents(combined.slice(0, 6));
    } catch (e) {
      console.error("GamingEvents fetch error", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ticking clock for countdowns across cards (efficient single interval)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <ActivityIndicator color={THEME} style={{ marginVertical: 8 }} />;
  if (!events.length) return null;

  const EventCard = ({ item, width }) => {
    const nowDt = new Date(now);
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    const status = nowDt < start ? "Upcoming" : nowDt > end ? "Completed" : "Live";

    let remainingMs = 0;
    if (status === "Upcoming") remainingMs = start - nowDt;
    else if (status === "Live") remainingMs = end - nowDt;
    const hh = Math.max(0, Math.floor(remainingMs / 1000 / 3600));
    const mm = Math.max(0, Math.floor((remainingMs / 1000 % 3600) / 60));
    const ss = Math.max(0, Math.floor(remainingMs / 1000 % 60));
    const countdown = status === "Completed" ? "Completed" : `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

    const subtitle = status === "Upcoming"
      ? `Starts ${start.toLocaleString()}`
      : status === "Live"
      ? `Ends ${end.toLocaleTimeString()}`
      : `Ended ${end.toLocaleString()}`;
    return (
      <TouchableOpacity style={[styles.card, { width }]} onPress={() => navigation.navigate("GamingEventDetail", { eventId: item._id })}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="trophy-outline" size={22} color={THEME} />
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
        <View style={styles.countdownRow}>
          <Text style={styles.countdownLabel}>{status === "Live" ? "Ends in" : status === "Upcoming" ? "Starts in" : "Status"}</Text>
          <Text style={[styles.countdownValue, status === "Live" ? styles.liveText : status === "Upcoming" ? styles.upcomingText : styles.completedText]}>{countdown}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.badge}>Q: {item.totalQuestions}</Text>
          <Text style={[styles.badge, { backgroundColor: "#eef2ff", color: "#4338ca" }]}>{item.difficulty}</Text>
          <Text style={[styles.badge, { backgroundColor: status === "Live" ? "#dcfce7" : "#fef9c3", color: "#065f46" }]}>{status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Gaming Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate("GamingEventsList")} style={{ backgroundColor: "transparent" }}> 
          <Text style={[styles.viewAll, { backgroundColor: "transparent" }]}>View all →</Text>
        </TouchableOpacity>
      </View>
      <EventsCarousel data={events} renderItem={EventCard} />
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_HORIZONTAL_MARGIN = 12;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN * 2; // full width look

function EventsCarousel({ data, renderItem }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + CARD_HORIZONTAL_MARGIN}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: CARD_HORIZONTAL_MARGIN }}
      renderItem={({ item }) => (
        <View style={{ marginRight: CARD_HORIZONTAL_MARGIN }}>
          {renderItem({ item, width: CARD_WIDTH })}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 4, marginBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 6, marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2d0c57" },
  viewAll: { color: THEME, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { marginLeft: 8, fontSize: 16, fontWeight: "800", color: "#1f2937" },
  subtitle: { marginTop: 4, fontSize: 12, color: "#6b7280" },
  countdownRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  countdownLabel: { color: "#6b7280", fontWeight: "700" },
  countdownValue: { fontWeight: "900" },
  liveText: { color: "#065f46" },
  upcomingText: { color: THEME },
  completedText: { color: "#9ca3af" },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  badge: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: "#f3e8ff", color: "#6b21a8", borderRadius: 10, fontSize: 12, fontWeight: "700" },
});
