import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function QuizOverviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quiz, onViewPreviousAttempts } = route.params || {};

  // Example rules, replace with real quiz.rules or similar if available
  const rules = quiz?.rules || [
    'Each question has a time limit.',
    'No negative marking.',
    'You cannot go back to previous questions.',
    'Points: Easy (2), Medium (4), Hard (6).',
    'Submit before time runs out.'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.prevAttemptBtn} onPress={onViewPreviousAttempts}>
        <Text style={styles.prevAttemptText}>View Previous Attempts</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{quiz?.title || 'Quiz Overview'}</Text>
      <Text style={styles.sectionTitle}>Rules:</Text>
      {rules.map((rule, idx) => (
        <Text key={idx} style={styles.ruleText}>• {rule}</Text>
      ))}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => navigation.replace('QuizPlayScreen', { quiz })}
      >
        <Text style={styles.startBtnText}>Start Test</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevAttemptBtn: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    backgroundColor: '#ede9fe',
    padding: 10,
    borderRadius: 8,
  },
  prevAttemptText: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a044e',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6d28d9',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  ruleText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  startBtn: {
    marginTop: 40,
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
