import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext"; // 🔹 Context import kiya

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME_ACCENT = "#f3c999";
const THEME_DARK = "#4a044e";

export default function GamingEventsList({ navigation }) {
  const { user } = useContext(AuthContext); // 🔹 User ID lene ke liye
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [completedMap, setCompletedMap] = useState({}); // 🔹 Completion status store karne ke liye

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

      // 🔹 Har event ke liye completion check karein
      if (user && user._id) {
        const checks = await Promise.all(
          rows.map(ev =>
            axios.get(`${API_BASE}/gaming-events/check-completed/${ev._id}/${user._id}`)
              .then(res => ({ id: ev._id, completed: res.data.completed }))
              .catch(() => ({ id: ev._id, completed: false }))
          )
        );
        const map = {};
        checks.forEach(c => { map[c.id] = c.completed; });
        setCompletedMap(map);
      }
    } catch (e) {
      console.error("events list fetch", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const renderItem = ({ item }) => {
    const start = new Date(item.startTime);
    const isLive = item._group === "live";
    const isCompleted = completedMap[item._id]; // 🔹 Check if this event is completed

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate("GamingEventDetail", { eventId: item._id })}
        style={styles.cardContainer}
      >
        <LinearGradient
          // 🔹 Agar completed hai toh dark theme hi rakha hai (Attractive rehne ke liye)
          colors={isLive || isCompleted ? ["#4a044e", "#701a75"] : ["#ffffff", "#f9f5ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.badgeRow}>
            {/* 🔹 Dynamic Status Badge */}
            <View style={[
              styles.statusBadge, 
              { backgroundColor: isCompleted ? "#10b981" : (isLive ? "#ff4444" : "#e9d5ff") }
            ]}>
              {isCompleted ? (
                <Ionicons name="checkmark-circle" size={12} color="#fff" style={{marginRight: 4}} />
              ) : (
                isLive && <View style={styles.liveIndicator} />
              )}
              <Text style={[styles.statusText, { color: (isLive || isCompleted) ? "#fff" : "#701a75" }]}>
                {isCompleted ? "COMPLETED" : item._group}
              </Text>
            </View>
            
          </View>

          <View style={styles.cardBody}>
            <View style={styles.mainInfo}>
              <Text style={[styles.cardTitle, { color: (isLive || isCompleted) ? "#fff" : "#2d0c57" }]} numberOfLines={1}>
                {item.title}
              </Text>
              
              <View style={styles.timeInfo}>
                <Ionicons 
                  name={isCompleted ? "medal-outline" : "time-outline"} 
                  size={14} 
                  color={(isLive || isCompleted) ? THEME_ACCENT : "#4a044e"} 
                />
                <Text style={[styles.cardSubtitle, { color: (isLive || isCompleted) ? "#fce7f3" : "#6b7280" }]}>
                  {isCompleted ? "You successfully finished this event" : `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                <View style={[styles.tag, { backgroundColor: (isLive || isCompleted) ? 'rgba(243, 201, 153, 0.2)' : '#f3e8ff' }]}>
                  <Text style={[styles.tagText, { color: (isLive || isCompleted) ? THEME_ACCENT : "#4a044e" }]}>
                    {item.totalQuestions} Questions
                  </Text>
                </View>
                {isCompleted && (
                   <View style={[styles.tag, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                    <Text style={[styles.tagText, { color: "#10b981" }]}>Ranked</Text>
                   </View>
                )}
              </View>
            </View>

            <View style={styles.actionArea}>
               <Ionicons 
                name={isCompleted ? "trophy" : "chevron-forward-circle"} 
                size={28} 
                color={(isLive || isCompleted) ? THEME_ACCENT : "#4a044e"} 
               />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator color="#4a044e" style={{ flex: 1 }} size="large" />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
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
  headerSection: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: THEME_DARK, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: "#6b7280", fontWeight: "500", marginTop: 2 },
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
  cardGradient: { borderRadius: 20, padding: 16 },
  badgeRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 12, gap: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: "900", textTransform: 'uppercase', letterSpacing: 0.5 },
  
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