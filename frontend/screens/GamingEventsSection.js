import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import GamingEventsSectionSkeleton from "../components/GamingEventsSectionSkeleton";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME_ACCENT = "#f3c999";
const THEME_DARK = "#4a044e";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.90; 
const CARD_MARGIN = 12;

export default function GamingEventsSection({ navigation }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [completedMap, setCompletedMap] = useState({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [liveRes, upcomingRes] = await Promise.all([
        axios.get(`${API_BASE}/gaming-events?scope=live`),
        axios.get(`${API_BASE}/gaming-events?scope=upcoming`),
      ]);
      const combined = [...(liveRes.data || []), ...(upcomingRes.data || [])].slice(0, 6);
      setEvents(combined);
      // Fetch completion status for each event
      if (user && user._id) {
        const checks = await Promise.all(
          combined.map(ev =>
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
      console.error("GamingEvents fetch error", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <GamingEventsSectionSkeleton />;
  if (!events.length) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy-sharp" size={20} color="#701a75" />
          </View>
          <View>
            <Text style={styles.mainTitle}>Gaming Events</Text>
            <Text style={styles.subTitle}>Play & Win Rewards</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate("GamingEventsScreen")}
          style={styles.viewAllBtn}
        >
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollPadding}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        disableIntervalMomentum={true}
      >
        {events.map((item) => {
          const nowDt = new Date(now);
          const start = new Date(item.startTime);
          const end = new Date(item.endTime);
          const status = nowDt < start ? "Upcoming" : nowDt > end ? "Completed" : "Live";
          const isCompleted = completedMap[item._id];
          let remainingMs = status === "Upcoming" ? start - nowDt : status === "Live" ? end - nowDt : 0;
          const hh = Math.max(0, Math.floor(remainingMs / 1000 / 3600));
          const mm = Math.max(0, Math.floor((remainingMs / 1000 % 3600) / 60));
          const ss = Math.max(0, Math.floor(remainingMs / 1000 % 60));
          const countdown = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

          return (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.9}
              onPress={() => !isCompleted && navigation.navigate("GamingEventDetail", { eventId: item._id })}
              style={[styles.cardWrapper, { width: CARD_WIDTH, opacity: isCompleted ? 0.7 : 1 }]}
            >
              <LinearGradient
                colors={isCompleted ? ["#64748b", "#334155"] : status === "Live" ? ["#4a044e", "#701a75"] : ["#701a75", "#2e1065"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.statusBadge, { backgroundColor: isCompleted ? "#22c55e" : status === "Live" ? "#ef4444" : "rgba(255,255,255,0.15)" }]}> 
                    {isCompleted ? <Ionicons name="checkmark-done" size={12} color="#fff" style={{marginRight: 5}} /> : status === "Live" && <View style={styles.pulseDot} />}
                    <Text style={styles.statusText}>{isCompleted ? "Completed" : status}</Text>
                  </View>
                  <View style={styles.entryCostBadge}>
                    <MaterialCommunityIcons name="database" size={12} color={THEME_ACCENT} />
                    <Text style={styles.entryCostText}>{item.entryCostCoins || 'FREE'}</Text>
                  </View>
                </View>

                <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>

                {/* Info Box or Completed UI */}
                {isCompleted ? (
                  <View style={[styles.infoGlassBox, { justifyContent: 'center', alignItems: 'center' }]}> 
                    <Ionicons name="trophy" size={28} color="#facc15" style={{marginBottom: 4}} />
                    <Text style={{color:'#fff', fontWeight:'bold', fontSize:15, marginTop:2}}>You have completed this event!</Text>
                  </View>
                ) : (
                  <View style={styles.infoGlassBox}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>{status === "Live" ? "ENDS IN" : "STARTS IN"}</Text>
                      <Text style={styles.infoValue}>{countdown}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>QUESTS</Text>
                      <Text style={styles.infoValue}>{item.totalQuestions}</Text>
                    </View>
                  </View>
                )}

                {/* Action Button only if not completed */}
                {!isCompleted && (
                  <View style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>ENTER TOURNAMENT</Text>
                    <Ionicons name="chevron-forward-circle" size={16} color={THEME_DARK} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: { marginTop: 8, marginBottom: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  titleGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconContainer: { backgroundColor: '#fdf4ff', padding: 8, borderRadius: 12 },
  mainTitle: { fontSize: 18, fontWeight: '900', color: '#1e1b4b' },
  subTitle: { fontSize: 11, color: '#701a75', fontWeight: '700', marginTop: -2 },
  viewAllBtn: { backgroundColor: '#f3e8ff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  viewAllText: { fontSize: 10, fontWeight: '900', color: '#701a75' },
  
  scrollPadding: { paddingLeft: 20, paddingRight: 20, paddingBottom: 5 },
  cardWrapper: { marginRight: CARD_MARGIN, elevation: 6, shadowColor: '#4a044e', shadowOpacity: 0.25, shadowRadius: 10, borderRadius: 24 },
  cardGradient: { borderRadius: 24, padding: 15, paddingBottom: 15 }, 
  
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pulseDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#fff', marginRight: 5 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  entryCostBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  entryCostText: { color: THEME_ACCENT, fontSize: 11, fontWeight: '900', marginLeft: 4 },
  
  eventTitle: { color: '#fff', fontSize: 19, fontWeight: '900', letterSpacing: 0.3, marginBottom: 10 },
  
  infoGlassBox: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15, padding: 10, alignItems: 'center' },
  infoItem: { flex: 1, alignItems: 'center' },
  infoLabel: { color: '#e9d5ff', fontSize: 9, fontWeight: '900', marginBottom: 1 },
  infoValue: { color: THEME_ACCENT, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  verticalDivider: { width: 1, height: 25, backgroundColor: 'rgba(255,255,255,0.1)' },
  
  actionBtn: { 
    backgroundColor: THEME_ACCENT, 
    height: 44, 
    borderRadius: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 6,
    marginTop: 12, // Reduced from 20 to 12
    elevation: 3,
  },
  actionBtnText: { color: THEME_DARK, fontWeight: '900', fontSize: 13, letterSpacing: 0.4 }
});