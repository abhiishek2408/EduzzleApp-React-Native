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
      // 1. Fetch Event Details
      const res = await axios.get(`${API_BASE}/gaming-events/${eventId}`);
      setEvent(res.data);
    } catch (e) {
      Alert.alert("Error", "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  // On mount: fetch event and check completion
  useEffect(() => {
    fetchEvent();
    // Check completion status
    if (user && user._id && eventId) {
      axios.get(`${API_BASE}/gaming-events/check-completed/${eventId}/${user._id}`)
        .then(res => {
          if (res.data?.completed) setIsCompleted(true);
        })
        .catch(() => {});
    }
  }, [eventId, user]);

  useEffect(() => {
    if (!event || isCompleted) return;
    const computeCountdown = () => {
      const now = new Date();
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      let diff = now < start ? start - now : now <= end ? end - now : 0;
      if (diff <= 0) return "Completed";
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hh = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mm = Math.floor((diff / 1000 % 3600) / 60);
      const ss = Math.floor(diff / 1000 % 60);
      let timeStr = `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
      if (days > 0) {
        timeStr = `${days} day${days > 1 ? 's' : ''} ` + timeStr;
      }
      return timeStr;
    };
    setCountdown(computeCountdown());
    timerRef.current = setInterval(() => setCountdown(computeCountdown()), 1000);
    return () => clearInterval(timerRef.current);
  }, [event, isCompleted]);

  const joinEvent = async () => {
    try {
      // 1. Check completion first
      const check = await axios.get(`${API_BASE}/gaming-events/check-completed/${eventId}/${user._id}`);
      if (check.data?.completed) {
        setIsCompleted(true);
        Alert.alert("Already Completed", "You have already completed this event.");
        return;
      }
      // 2. If not completed, try to join
      const res = await axios.post(`${API_BASE}/gaming-events/${eventId}/join`, { userId: user._id });
      if (res.data?.attemptId) {
        navigation.navigate("GamingEventPlay", { eventId, attemptId: res.data.attemptId });
      }
    } catch (e) {
      if (e?.response?.status === 409) {
        setIsCompleted(true); // Fallback agar server par already completed hai
      } else {
        Alert.alert("Join Failed", e?.response?.data?.message || "Error");
      }
    }
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator color={THEME_DARK} size="large" /></View>;
  if (!event) return null;

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.hero}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.heroContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={isCompleted ? "trophy-award" : "controller-classic"} 
              size={50} 
              color={THEME_ACCENT} 
            />
          </View>
          <Text style={styles.heroTitle}>{event.title}</Text>
          <View style={[styles.statusPill, isCompleted && {backgroundColor: '#10b981'}]}>
            <Text style={[styles.statusPillText, isCompleted && {color: '#fff'}]}>
                {isCompleted ? "PARTICIPATION RECORDED" : "TOURNAMENT LIVE"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {isCompleted ? (
          /* ✅ DIRECT COMPLETED VIEW - NO JOIN BUTTON, NO TIMER */
          <View style={styles.completedSection}>
            <View style={styles.completedCard}>
              <LinearGradient colors={["#ffffff", "#f8fafc"]} style={styles.cardInner}>
                <View style={styles.successIconWrapper}>
                  <View style={styles.outerCircle}>
                    <View style={styles.innerCircle}>
                      <Ionicons name="checkmark-done" size={40} color="#10b981" />
                    </View>
                  </View>
                </View>
                
                <Text style={styles.completedTitle}>Great Effort!</Text>
                <Text style={styles.completedSub}>
                    You have finished the tournament. Final rankings will be announced shortly after the event closes.
                </Text>
                
                <View style={styles.scoreRow}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>STATUS</Text>
                    <View style={styles.statusRowMini}>
                        <View style={styles.dot} />
                        <Text style={[styles.scoreValue, {color: '#10b981'}]}>Submitted</Text>
                    </View>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>QUESTS</Text>
                    <Text style={[styles.scoreValue, {color: THEME_DARK}]}>{event.totalQuestions} Questions</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.leaderboardBtn}
              onPress={() => navigation.navigate("GamingEventLeaderboard", { eventId })}
            >
              <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.btnGradient}>
                <MaterialCommunityIcons name="podium-gold" size={24} color={THEME_ACCENT} />
                <Text style={styles.btnTextWhite}>CHECK LEADERBOARD</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerNote}>Check back later to see your final rank!</Text>
          </View>
        ) : (
          /* 🎮 ACTIVE VIEW - SHOW STATS, TIMER AND JOIN BUTTON */
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
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: { paddingBottom: 50, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingHorizontal: 20 },
  backBtn: { marginTop: 45, width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  heroContent: { alignItems: 'center', marginTop: 10 },
  iconContainer: { width: 90, height: 90, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  statusPill: { backgroundColor: THEME_ACCENT, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 25, marginTop: 12 },
  statusPillText: { fontSize: 11, fontWeight: '900', color: THEME_DARK, letterSpacing: 0.5 },
  
  body: { paddingHorizontal: 20, marginTop: -30 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statItem: { backgroundColor: '#fff', width: '31%', padding: 15, borderRadius: 25, alignItems: 'center', elevation: 8, shadowColor: '#4a044e', shadowOpacity: 0.1, shadowRadius: 10 },
  statLabel: { fontSize: 9, color: '#64748b', fontWeight: '800', marginTop: 6, textTransform: 'uppercase' },
  statVal: { fontSize: 14, fontWeight: '900', color: THEME_DARK, marginTop: 2 },

  descBox: { backgroundColor: '#fff', padding: 22, borderRadius: 28, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: THEME_DARK, marginBottom: 10 },
  descText: { fontSize: 14, color: '#475569', lineHeight: 22 },

  completedSection: { marginTop: 10, paddingBottom: 40 },
  completedCard: { borderRadius: 35, overflow: 'hidden', elevation: 12, shadowColor: THEME_DARK, shadowOpacity: 0.15, shadowRadius: 20 },
  cardInner: { padding: 35, alignItems: 'center' },
  successIconWrapper: { marginBottom: 20 },
  outerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ecfdf5', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  completedTitle: { fontSize: 24, fontWeight: '900', color: '#064e3b' },
  completedSub: { textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 12, lineHeight: 22 },
  scoreRow: { flexDirection: 'row', marginTop: 30, borderTopWidth: 1, borderColor: '#f1f5f9', paddingTop: 25 },
  scoreItem: { flex: 1, alignItems: 'center' },
  statusRowMini: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  scoreLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '900', marginBottom: 6 },
  scoreValue: { fontSize: 16, fontWeight: '900' },
  scoreDivider: { width: 1, height: 40, backgroundColor: '#f1f5f9' },
  leaderboardBtn: { height: 62, borderRadius: 22, overflow: 'hidden', marginTop: 30, elevation: 5 },
  footerNote: { textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: '600', marginTop: 20 },

  actionSection: { marginBottom: 40 },
  timeBox: { alignItems: 'center', marginBottom: 25 },
  timeLabel: { fontSize: 11, fontWeight: '900', color: '#64748b', letterSpacing: 2 },
  timeVal: { fontSize: 32, fontWeight: '900', color: THEME_DARK },
  primaryBtn: { height: 60, borderRadius: 22, overflow: 'hidden', elevation: 8 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  btnTextDark: { fontSize: 16, fontWeight: '900', color: THEME_DARK, letterSpacing: 0.5 },
  btnTextWhite: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 0.5 }
});