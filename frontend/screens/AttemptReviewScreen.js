import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function AttemptReviewScreen() {
  const route = useRoute();
  const { levelAttempts } = route.params || {};

  if (!levelAttempts) {
    return (
      <View style={styles.centered}><Text>No attempt data found.</Text></View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Quiz Attempt Review</Text>
      {levelAttempts.map((level, idx) => (
        <View key={level.levelName + idx} style={styles.levelBox}>
          <Text style={styles.levelTitle}>Level: {level.levelName}</Text>
          {level.answers && level.answers.length > 0 ? (
            level.answers.map((ans, qidx) => (
              <View key={ans.questionId + qidx} style={styles.questionBox}>
                <Text style={styles.question}>{qidx + 1}. {ans.questionText || ans.questionId}</Text>
                <Text style={styles.option}>Your Answer: <Text style={{color: ans.isCorrect ? 'green' : 'red'}}>{ans.selectedOption ?? 'Not answered'}</Text></Text>
                <Text style={styles.option}>Correct Answer: <Text style={{color: 'green'}}>{ans.correctOption}</Text></Text>
              </View>
            ))
          ) : (
            <Text style={styles.noQuestions}>No questions attempted in this level.</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 18, color: '#4a044e', textAlign: 'center' },
  levelBox: { marginBottom: 24, padding: 14, backgroundColor: '#f3e8ff', borderRadius: 10 },
  levelTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#701a75' },
  questionBox: { marginBottom: 10, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#e0e7ff' },
  question: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  option: { fontSize: 14, marginBottom: 2 },
  noQuestions: { fontStyle: 'italic', color: '#888' },
});
