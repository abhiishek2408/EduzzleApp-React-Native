import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar 
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function PreviousAttemptsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { quizId, userId } = route.params || {};
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId || !userId) return;
    const fetchAttempts = async () => {
      try {
        const res = await axios.get(`https://eduzzleapp-react-native.onrender.com/api/attempts/quiz/${quizId}/user/${userId}`);
        // Sorting by date so the newest is at the top
        const sortedAttempts = (res.data.attempts || []).sort((a, b) => 
          new Date(b.startedAt) - new Date(a.startedAt)
        );
        setAttempts(sortedAttempts);
      } catch (err) {
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [quizId, userId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#701a75" />
        <Text style={styles.loadingText}>Fetching your progress...</Text>
      </View>
    );
  }

  if (!attempts.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataEmoji}>📭</Text>
        <Text style={styles.noDataText}>No previous attempts found.</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FD' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>History</Text>
        <Text style={styles.subHeader}>Track your performance over time</Text>

        {attempts.map((att, idx) => {
          const isPassed = att.result?.toLowerCase() === 'passed';
          const attemptDate = new Date(att.startedAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
          });
          const attemptTime = new Date(att.startedAt).toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
          });

          return (
            <TouchableOpacity
              key={att._id || idx}
              activeOpacity={0.9}
              style={styles.attemptCard}
              onPress={() => navigation.navigate("AttemptReviewScreen", { levelAttempts: att.levelAttempts })}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.attemptNumber}>Attempt #{attempts.length - idx}</Text>
                  <Text style={styles.dateTimeText}>{attemptDate} • {attemptTime}</Text>
                </View>
                <View style={[styles.statusBadge, isPassed ? styles.passBadge : styles.failBadge]}>
                  <Text style={[styles.statusText, isPassed ? styles.passText : styles.failText]}>
                    {att.result || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>SCORE</Text>
                  <Text style={styles.statValue}>{att.totalScore}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>TIME</Text>
                  <Text style={styles.statValue}>{att.totalTimeTaken ? `${att.totalTimeTaken}s` : '--'}</Text>
                </View>
                <View style={styles.reviewLink}>
                  <Text style={styles.reviewLinkText}>Review Details →</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FD' },
  loadingText: { marginTop: 12, color: '#701a75', fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noDataEmoji: { fontSize: 60, marginBottom: 10 },
  noDataText: { fontSize: 18, color: '#64748b', marginBottom: 20 },
  goBackBtn: { backgroundColor: '#701a75', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  goBackBtnText: { color: '#fff', fontWeight: 'bold' },
  header: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  subHeader: { fontSize: 16, color: '#64748b', marginBottom: 24 },
  attemptCard: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  attemptNumber: { fontSize: 18, fontWeight: '700', color: '#334155' },
  dateTimeText: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  passBadge: { backgroundColor: '#dcfce7' },
  failBadge: { backgroundColor: '#fee2e2' },
  statusText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  passText: { color: '#15803d' },
  failText: { color: '#b91c1c' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 14 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  statBox: { marginRight: 25 },
  statLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '800', letterSpacing: 1 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#475569' },
  reviewLink: { marginLeft: 'auto' },
  reviewLinkText: { fontSize: 13, color: '#701a75', fontWeight: '700' },
});