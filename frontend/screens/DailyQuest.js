import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";

export default function DailyQuest({ navigation }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [quest, setQuest] = useState({ quizzesAttempted: 0, completed: false, currentStreak: 0 });
  const [badges, setBadges] = useState([]);
  const [rewards, setRewards] = useState([]);

  const fetchData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const [questRes, badgesRes, rewardsRes] = await Promise.all([
        axios.get(`${API_BASE}/daily-quests/${user._id}`),
        axios.get(`${API_BASE}/badges/${user._id}`),
        axios.get(`${API_BASE}/rewards/${user._id}`),
      ]);

      setQuest(questRes.data || { quizzesAttempted: 0, completed: false, currentStreak: 0 });
      setBadges(Array.isArray(badgesRes.data) ? badgesRes.data : []);
      setRewards(Array.isArray(rewardsRes.data) ? rewardsRes.data : []);
    } catch (err) {
      console.error("DailyQuest fetch error:", err?.response?.data || err.message || err);
      Alert.alert("Error", "Could not load daily quest data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?._id]);

  const claimBadge = async (badgeId) => {
    try {
      await axios.patch(`${API_BASE}/badges/claim/${badgeId}`);
      // refresh
      fetchData();
      Alert.alert("Success", "Badge reward claimed");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not claim badge");
    }
  };

  const claimReward = async (rewardId) => {
    try {
      await axios.patch(`${API_BASE}/rewards/claim/${rewardId}`);
      fetchData();
      Alert.alert("Success", "Reward claimed");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not claim reward");
    }
  };

  if (loading) return <ActivityIndicator size="small" color="#a21caf" style={{ marginVertical: 12 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quest</Text>

      <View style={styles.card}>
        <Text style={styles.questText}>Quizzes attempted today</Text>
        <Text style={styles.questValue}>{quest.quizzesAttempted}</Text>
        <Text style={styles.small}>Streak: {quest.currentStreak || 0} days</Text>
        <Text style={[styles.small, { marginTop: 8 }]}>Completed: {quest.completed ? "Yes" : "No"}</Text>
      </View>

      <Text style={[styles.subTitle, { marginTop: 12 }]}>Badges</Text>
      {badges.length === 0 ? (
        <Text style={styles.emptyText}>No badges yet.</Text>
      ) : (
        <FlatList
          data={badges}
          keyExtractor={(i) => i._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.badgeItem}>
              <Text style={styles.badgeName}>{item.name || item.title || "Badge"}</Text>
              <Text style={styles.badgeMeta}>{item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString() : ""}</Text>
              <TouchableOpacity
                style={[styles.claimBtn, item.claimed ? styles.claimed : null]}
                onPress={() => !item.claimed && claimBadge(item._id)}
              >
                <Text style={styles.claimText}>{item.claimed ? "Claimed" : "Claim"}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={[styles.subTitle, { marginTop: 12 }]}>Rewards</Text>
      {rewards.length === 0 ? (
        <Text style={styles.emptyText}>No rewards yet.</Text>
      ) : (
        <FlatList
          data={rewards}
          keyExtractor={(i) => i._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.rewardItem}>
              <Text style={styles.rewardName}>{item.title || item.name || "Reward"}</Text>
              <Text style={styles.badgeMeta}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</Text>
              <TouchableOpacity
                style={[styles.claimBtn, item.claimed ? styles.claimed : null]}
                onPress={() => !item.claimed && claimReward(item._id)}
              >
                <Text style={styles.claimText}>{item.claimed ? "Claimed" : "Claim"}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", color: "#2d0c57" },
  subTitle: { fontSize: 15, fontWeight: "700", color: "#4a4a6a" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  questText: { fontSize: 13, color: "#666" },
  questValue: { fontSize: 36, color: "#a21caf", fontWeight: "900", marginTop: 6 },
  small: { fontSize: 12, color: "#666" },
  emptyText: { color: "#999", marginTop: 8 },
  badgeItem: {
    backgroundColor: "#fff8fb",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
    width: 140,
  },
  badgeName: { fontSize: 14, fontWeight: "800", color: "#2d0c57" },
  badgeMeta: { fontSize: 11, color: "#777", marginTop: 6 },
  claimBtn: {
    marginTop: 10,
    backgroundColor: "#a21caf",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  claimText: { color: "#fff", fontWeight: "700" },
  claimed: { backgroundColor: "#999" },
  rewardItem: {
    backgroundColor: "#f5fff6",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
    width: 140,
  },
  rewardName: { fontSize: 14, fontWeight: "800", color: "#2d0c57" },
});
