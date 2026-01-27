import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
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
        setAttempts(res.data.attempts || []);
      } catch (err) {
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [quizId, userId]);

  if (loading) return <ActivityIndicator style={{marginTop: 40}} />;
  if (!attempts.length) return <View style={styles.centered}><Text>No previous attempts found.</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Previous Attempts</Text>
      {attempts.map((att, idx) => (
        <TouchableOpacity
          key={att._id || idx}
          style={styles.attemptBox}
          onPress={() => navigation.navigate("AttemptReviewScreen", { levelAttempts: att.levelAttempts })}
        >
          <Text style={styles.attemptTitle}>Attempt #{idx + 1}</Text>
          <Text>Date: {new Date(att.startedAt).toLocaleString()}</Text>
          <Text>Score: {att.totalScore}</Text>
          <Text>Status: {att.result}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#4a044e', textAlign: 'center' },
  attemptBox: { marginBottom: 18, padding: 14, backgroundColor: '#f3e8ff', borderRadius: 10 },
  attemptTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4, color: '#701a75' },
});
