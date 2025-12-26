import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";

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
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#a21caf" /></View>;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        {analytics && (
          <View style={styles.analyticsBox}>
            <Text style={styles.analyticsText}>Participants: {analytics.participants}</Text>
            <Text style={styles.analyticsText}>Avg Score: {Math.round(analytics.avgScore || 0)}</Text>
            <Text style={styles.analyticsText}>Avg Duration: {Math.round(analytics.avgDuration || 0)}s</Text>
            <Text style={styles.analyticsText}>Avg Accuracy: {Math.round((analytics.avgAccuracy || 0) * 100)}%</Text>
          </View>
        )}
      </LinearGradient>
      <FlatList
        data={leaderboard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index < 3 && styles.topRow]}> 
            <Text style={styles.rank}>{index + 1}</Text>
            <Ionicons name="person-circle" size={32} color="#a21caf" style={{marginRight: 8}} />
            <Text style={styles.name}>{item.userId?.name || "User"}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
            <Text style={styles.duration}>{item.durationSec}s</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center',marginTop:40,color:'#888'}}>No leaderboard data yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backBtn: { position: 'absolute', left: 20, top: 50, zIndex: 2 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center' },
  analyticsBox: { marginTop: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10 },
  analyticsText: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  listContent: { padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, elevation: 2 },
  topRow: { backgroundColor: '#f3c999' },
  rank: { fontSize: 18, fontWeight: '900', width: 30, textAlign: 'center', color: '#a21caf' },
  name: { flex: 1, fontSize: 15, fontWeight: '700', color: '#2d0c57' },
  score: { fontSize: 15, fontWeight: '900', color: '#701a75', marginLeft: 10 },
  duration: { fontSize: 13, color: '#888', marginLeft: 10 }
});
