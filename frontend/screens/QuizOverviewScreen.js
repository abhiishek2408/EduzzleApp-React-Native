import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function QuizOverviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quiz, onViewPreviousAttempts } = route.params || {};

  const rules = quiz?.rules || [
     'Each question has a time limit.',
     'No negative marking for wrong answers.',
     'You cannot go back to previous questions.',
     'Points: Easy (2), Medium (4), Hard (6).',
     'Submit before time runs out.',
     'It is mandatory to complete the review process; otherwise your attempt will not count.'
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.prevAttemptBtn} onPress={onViewPreviousAttempts}>
          <Text style={styles.prevAttemptText}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{quiz?.title || 'General Knowledge Quiz'}</Text>
        <Text style={styles.subtitle}>{quiz?.category || 'Educational'} • {quiz?.levels?.length || 3} Levels</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={styles.statLabel}>Timed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statLabel}>MCQ</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Rules & Guidelines</Text>
        {rules.map((rule, idx) => (
          <View key={idx} style={styles.ruleContainer}>
            <View style={styles.bullet} />
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        activeOpacity={0.8}
        onPress={() => navigation.replace('QuizPlayScreen', { quizId: quiz?._id })}
      >
        <Text style={styles.startBtnText}>Start Challenge</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F9FD', // Light, clean background
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backLinkText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  prevAttemptBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  prevAttemptText: {
    color: '#4a044e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 16,
    width: width * 0.22,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  ruleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4a044e',
    marginTop: 8,
    marginRight: 12,
  },
  ruleText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  startBtn: {
    marginTop: 30,
    backgroundColor: '#4a044e',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});