import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StatusBar } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME_ACCENT = "#f3c999"; 
const THEME_DARK = "#4a044e";   

export default function GamingEventDetail({ route, navigation }) {
  const { eventId } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/gaming-events/${eventId}`);
      setEvent(res.data);
      
      // 🔹 Check status logic
      const participant = res.data.participants?.find(p => p.userId === user._id);
      if (participant?.finished) {
        setIsCompleted(true);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvent(); }, [eventId]);

  useEffect(() => {
    if (!event || isCompleted) return; // 🔹 Completed hai toh timer ki zaroorat nahi
    const computeCountdown = () => {
      const now = new Date();
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      let diff = now < start ? start - now : now <= end ? end - now : 0;
      if (diff <= 0) return "Completed";
      const hh = Math.floor(diff / 1000 / 3600);
      const mm = Math.floor((diff / 1000 % 3600) / 60);
      const ss = Math.floor(diff / 1000 % 60);
      return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
    };
    setCountdown(computeCountdown());
    timerRef.current = setInterval(() => setCountdown(computeCountdown()), 1000);
    return () => clearInterval(timerRef.current);
  }, [event, isCompleted]);

  const joinEvent = async () => {
    try {
      const res = await axios.post(`${API_BASE}/gaming-events/${eventId}/join`, { userId: user._id });
      if (res.data?.attemptId) {
        navigation.navigate("GamingEventPlay", { eventId, attemptId: res.data.attemptId });
      }
    } catch (e) {
      if (e?.response?.status === 409) {
        setIsCompleted(true);
      } else {
        Alert.alert("Join Failed", e?.response?.data?.message || "Error");
      }
    }
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator color={THEME_DARK} size="large" /></View>;
  if (!event) return null;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar barStyle="light-content" />
      
      {/* 🔹 Hero Section */}
      <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.hero}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.heroContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={isCompleted ? "medal" : "controller-classic"} 
              size={50} 
              color={THEME_ACCENT} 
            />
          </View>
          <Text style={styles.heroTitle}>{event.title}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{isCompleted ? "FINISHED" : "TOURNAMENT LIVE"}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {isCompleted ? (
          /* ✅ COMPLETED UI: Only Scorecard & Leaderboard */
          <View style={styles.completedSection}>
            <View style={styles.completedCard}>
              <LinearGradient colors={["#fdfcfb", "#f5f3ff"]} style={styles.cardInner}>
                <View style={styles.successIconBg}>
                   <Ionicons name="checkmark-done-circle" size={50} color="#10b981" />
                </View>
                <Text style={styles.completedTitle}>Great Job!</Text>
                <Text style={styles.completedSub}>You have successfully submitted your entry for this event. Wait for the final results!</Text>
                
                <View style={styles.scoreRow}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>RESULT</Text>
                    <Text style={[styles.scoreValue, {color: '#10b981'}]}>Submitted</Text>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>ATTEMPT</Text>
                    <Text style={[styles.scoreValue, {color: THEME_DARK}]}>Finished</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.leaderboardBtn}
              onPress={() => navigation.navigate("Leaderboard", { eventId })}
            >
              <LinearGradient colors={["#701a75", "#4a044e"]} style={styles.btnGradient}>
                <Text style={styles.btnTextWhite}>VIEW LEADERBOARD</Text>
                <MaterialCommunityIcons name="podium-gold" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          /* 🎮 JOINING UI: Stats, Desc & Join Button */
          <View>
            <View style={styles.statsRow}>
              <StatItem icon="help-circle" label="Questions" val={event.totalQuestions} />
              <StatItem icon="flash" label="Difficulty" val={event.difficulty} />
              <StatItem icon="wallet" label="Fee" val={event.entryCostCoins || 'Free'} />
            </View>
            
            <View style={styles.descBox}>
              <Text style={styles.sectionTitle}>Tournament Info</Text>
              <Text style={styles.descText}>{event.description || "Compete with others and prove your skills in this limited-time event!"}</Text>
            </View>

            <View style={styles.actionSection}>
               <View style={styles.timeBox}>
                 <Text style={styles.timeLabel}>CLOSES IN</Text>
                 <Text style={styles.timeVal}>{countdown}</Text>
               </View>

               <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtn} onPress={joinEvent}>
                <LinearGradient colors={["#f3c999", "#d97706"]} style={styles.btnGradient}>
                  <Text style={styles.btnTextDark}>JOIN & PLAY NOW</Text>
                  <Ionicons name="play-circle" size={20} color={THEME_DARK} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const StatItem = ({ icon, label, val }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={20} color={THEME_DARK} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statVal}>{val}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: { paddingBottom: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, paddingHorizontal: 20 },
  backBtn: { marginTop: 45, width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  heroContent: { alignItems: 'center', marginTop: 15 },
  iconContainer: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center' },
  statusPill: { backgroundColor: THEME_ACCENT, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 },
  statusPillText: { fontSize: 10, fontWeight: '900', color: THEME_DARK },
  
  body: { paddingHorizontal: 20, marginTop: -25 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statItem: { backgroundColor: '#fff', width: '31%', padding: 12, borderRadius: 20, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  statLabel: { fontSize: 9, color: '#666', fontWeight: '800', marginTop: 5, textTransform: 'uppercase' },
  statVal: { fontSize: 13, fontWeight: '900', color: THEME_DARK },

  descBox: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 25, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: THEME_DARK, marginBottom: 8 },
  descText: { fontSize: 13, color: '#555', lineHeight: 20 },

  // ✅ Completed Styling
  completedSection: { marginTop: 10 },
  completedCard: { borderRadius: 30, overflow: 'hidden', elevation: 8, shadowColor: THEME_DARK, shadowOpacity: 0.2, shadowRadius: 15 },
  cardInner: { padding: 30, alignItems: 'center' },
  successIconBg: { backgroundColor: '#ecfdf5', padding: 15, borderRadius: 30, marginBottom: 10 },
  completedTitle: { fontSize: 22, fontWeight: '900', color: '#065f46' },
  completedSub: { textAlign: 'center', color: '#666', fontSize: 13, marginTop: 10, lineHeight: 20 },
  scoreRow: { flexDirection: 'row', marginTop: 25, borderTopWidth: 1, borderColor: '#eee', paddingTop: 20 },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreLabel: { fontSize: 10, color: '#999', fontWeight: '800', marginBottom: 5 },
  scoreValue: { fontSize: 16, fontWeight: '900' },
  scoreDivider: { width: 1, height: 35, backgroundColor: '#eee' },
  leaderboardBtn: { height: 55, borderRadius: 20, overflow: 'hidden', marginTop: 25, elevation: 4, marginBottom: 30 },

  actionSection: { marginBottom: 35 },
  timeBox: { alignItems: 'center', marginBottom: 20 },
  timeLabel: { fontSize: 10, fontWeight: '900', color: '#999', letterSpacing: 1 },
  timeVal: { fontSize: 24, fontWeight: '900', color: THEME_DARK },
  
  primaryBtn: { height: 58, borderRadius: 20, overflow: 'hidden', elevation: 6 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnTextDark: { fontSize: 15, fontWeight: '900', color: THEME_DARK, letterSpacing: 1 },
  btnTextWhite: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 1 }
});