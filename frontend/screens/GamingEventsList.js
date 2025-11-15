import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME = "#a21caf";

export default function GamingEventsList({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [live, upcoming, past] = await Promise.all([
        axios.get(`${API_BASE}/gaming-events?scope=live`),
        axios.get(`${API_BASE}/gaming-events?scope=upcoming`),
        axios.get(`${API_BASE}/gaming-events?scope=past`),
      ]);
      const rows = [
        ...(live.data || []).map((e) => ({ ...e, _group: "Live" })),
        ...(upcoming.data || []).map((e) => ({ ...e, _group: "Upcoming" })),
        ...(past.data || []).map((e) => ({ ...e, _group: "Past" })),
      ];
      setEvents(rows);
    } catch (e) {
      console.error("events list fetch", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const renderItem = ({ item }) => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("GamingEventDetail", { eventId: item._id })}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <Ionicons name="trophy-outline" size={20} color={THEME} />
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>{item._group} • {start.toLocaleString()} - {end.toLocaleTimeString()}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.badge}>Q: {item.totalQuestions}</Text>
          <Text style={[styles.badge, { backgroundColor: "#eef2ff", color: "#4338ca" }]}>{item.difficulty}</Text>
          {item.entryCostCoins ? <Text style={[styles.badge, { backgroundColor: "#fff7ed", color: "#9a3412" }]}>Entry: {item.entryCostCoins}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator color={THEME} style={{ marginTop: 16 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Gaming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  header: { fontSize: 20, fontWeight: "900", color: "#111827", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { marginLeft: 8, fontSize: 16, fontWeight: "800", color: "#1f2937" },
  subtitle: { color: "#6b7280" },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  badge: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: "#f3e8ff", color: "#6b21a8", borderRadius: 10, fontSize: 12, fontWeight: "700" },
});
