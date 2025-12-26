import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME_ACCENT = "#f3c999";
const THEME_DARK = "#4a044e";

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
      console.error("events list fetch", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const renderItem = ({ item }) => {
    const start = new Date(item.startTime);
    const isLive = item._group === "Live";

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate("GamingEventDetail", { eventId: item._id })}
        style={styles.cardContainer}
      >
        <LinearGradient
          colors={isLive ? ["#4a044e", "#701a75"] : ["#ffffff", "#f9f5ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: isLive ? "#ff4444" : "#e9d5ff" }]}>
              {isLive && <View style={styles.liveIndicator} />}
              <Text style={[styles.statusText, { color: isLive ? "#fff" : "#701a75" }]}>
                {item._group}
              </Text>
            </View>
            
            {item.entryCostCoins > 0 && (
              <View style={[styles.coinBadge, { backgroundColor: isLive ? 'rgba(255,255,255,0.1)' : '#fff7ed' }]}>
                <Ionicons name="flash" size={12} color={isLive ? THEME_ACCENT : "#b45309"} />
                <Text style={[styles.coinText, { color: isLive ? THEME_ACCENT : "#b45309" }]}>
                  {item.entryCostCoins}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardBody}>
            <View style={styles.mainInfo}>
              <Text style={[styles.cardTitle, { color: isLive ? "#fff" : "#2d0c57" }]} numberOfLines={1}>
                {item.title}
              </Text>
              
              <View style={styles.timeInfo}>
                <Ionicons name="time-outline" size={14} color={isLive ? THEME_ACCENT : "#a21caf"} />
                <Text style={[styles.cardSubtitle, { color: isLive ? "#fce7f3" : "#6b7280" }]}>
                  {start.toLocaleDateString()} • {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                <View style={[styles.tag, { backgroundColor: isLive ? 'rgba(243, 201, 153, 0.2)' : '#f3e8ff' }]}>
                  <Text style={[styles.tagText, { color: isLive ? THEME_ACCENT : "#a21caf" }]}>
                    {item.totalQuestions} Questions
                  </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: isLive ? 'rgba(255,255,255,0.15)' : '#f1f5f9' }]}>
                  <Text style={[styles.tagText, { color: isLive ? "#fff" : "#475569" }]}>
                    {item.difficulty}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionArea}>
               <Ionicons name="chevron-forward-circle" size={28} color={isLive ? THEME_ACCENT : "#a21caf"} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator color="#a21caf" style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 🔹 Updated Header Section with Title & Subtitle */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Gaming Events</Text>
        <Text style={styles.headerSubtitle}>Join live tournaments and win big prizes</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fcfaff", paddingTop: 20 },
  
  // 🔹 New Header Styles
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: THEME_DARK, 
    letterSpacing: -0.5 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: "#6b7280", 
    fontWeight: "500", 
    marginTop: 2 
  },

  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  
  cardContainer: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  statusText: { fontSize: 11, fontWeight: "900", textTransform: 'uppercase', letterSpacing: 0.5 },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  coinText: { fontSize: 11, fontWeight: "800", marginLeft: 4 },
  
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  mainInfo: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "800" },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  cardSubtitle: { fontSize: 13, fontWeight: "600" },
  
  tagsContainer: { flexDirection: 'row', gap: 8 },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: "700" },
  
  actionArea: { marginLeft: 10, justifyContent: 'center' }
});