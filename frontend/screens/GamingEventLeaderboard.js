import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, StatusBar } from "react-native";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME_ACCENT = "#f3c999"; 
const THEME_DARK = "#4a044e";

export default function GamingEventLeaderboard({ route, navigation }) {
  const { eventId } = route.params;
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lbRes, anRes] = await Promise.all([
          axios.get(`${API_BASE}/gaming-events/${eventId}/leaderboard`),
          axios.get(`${API_BASE}/gaming-events/${eventId}/analytics`)
        ]);
        setLeaderboard(lbRes.data || []);
        setAnalytics(anRes.data || null);
      } catch (e) {
        console.error('Leaderboard error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const renderTopThree = () => {
    if (leaderboard.length === 0) return null;
    const top3 = leaderboard.slice(0, 3);
    // Reorder for Podium: [2nd, 1st, 3rd]
    const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

    return (
      <View style={styles.podiumContainer}>
        {podium.map((user, index) => {
          const isFirst = user?._id === top3[0]?._id;
          return (
            <View key={user?._id || index} style={[styles.podiumSpot, isFirst && styles.firstSpot]}>
              <View style={styles.avatarWrapper}>
                <Ionicons name="person-circle" size={isFirst ? 70 : 55} color={isFirst ? THEME_ACCENT : "#fff"} />
                <View style={[styles.rankBadge, { backgroundColor: isFirst ? "#fbbf24" : "#94a3b8" }]}>
                  <Text style={styles.rankBadgeText}>{leaderboard.indexOf(user) + 1}</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{user?.userId?.name || "User"}</Text>
              <Text style={styles.podiumScore}>{user?.score} pts</Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={THEME_DARK} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.header}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <View style={{ width: 40 }} /> 
        </View>

        {renderTopThree()}

        {analytics && (
          <View style={styles.analyticsRow}>
            <AnalyticChip icon="people" val={analytics.participants} label="Players" />
            <AnalyticChip icon="star" val={Math.round(analytics.avgScore || 0)} label="MARKS" />
            <AnalyticChip icon="timer-outline" val={`${Math.round(analytics.avgDuration || 0)}s`} label="Time" />
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={leaderboard.slice(3)}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rankText}>{index + 4}</Text>
            <View style={styles.userInitial}>
              <Text style={styles.initialText}>{(item.userId?.name || "U")[0]}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>{item.userId?.name || "Anonymous"}</Text>
              <Text style={styles.durationText}>{item.durationSec}s duration</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreText}>{item.score}</Text>
              <Text style={styles.ptsLabel}>pts</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          leaderboard.length <= 3 && leaderboard.length > 0 ? null : (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="trophy-variant-outline" size={60} color="#cbd5e1" />
              <Text style={styles.emptyText}>No rankings yet</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const AnalyticChip = ({ icon, val, label }) => (
  <View style={styles.chip}>
    <Ionicons name={icon} size={14} color={THEME_ACCENT} />
    <View style={{marginLeft: 5}}>
        <Text style={styles.chipVal}>{val}</Text>
        <Text style={styles.chipLabel}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingTop: 45, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  
  // Podium Styles
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginVertical: 10, height: 160 },
  podiumSpot: { alignItems: 'center', width: '30%', marginHorizontal: 5 },
  firstSpot: { marginTop: -20 },
  avatarWrapper: { position: 'relative' },
  rankBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4a044e' },
  rankBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  podiumName: { color: '#fff', fontWeight: '800', fontSize: 13, marginTop: 8 },
  podiumScore: { color: THEME_ACCENT, fontWeight: '900', fontSize: 14 },

  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 20, padding: 12 },
  chip: { flexDirection: 'row', alignItems: 'center' },
  chipVal: { color: '#fff', fontSize: 13, fontWeight: '900' },
  chipLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },

  listContent: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 12, elevation: 3, shadowColor: '#4a044e', shadowOpacity: 0.05, shadowRadius: 10 },
  rankText: { fontSize: 15, fontWeight: '900', color: '#94a3b8', width: 30 },
  userInitial: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  initialText: { color: '#4a044e', fontWeight: '900', fontSize: 16 },
  userInfo: { flex: 1 },
  nameText: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  durationText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  scoreInfo: { alignItems: 'flex-end' },
  scoreText: { fontSize: 18, fontWeight: '900', color: THEME_DARK },
  ptsLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#94a3b8', fontSize: 16, fontWeight: '700', marginTop: 10 }
});