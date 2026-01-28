import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
// Import Icons
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export default function AttemptReviewScreen() {
  const route = useRoute();
  const { levelAttempts } = route.params || {};
  const totalScore = Array.isArray(levelAttempts)
    ? levelAttempts.reduce((sum, level) => sum + (level.score || 0), 0)
    : 0;
  // Try to debug maxScore if not visible
  let maxScore = 0;
  if (Array.isArray(levelAttempts)) {
    maxScore = levelAttempts.reduce((sum, level) => {
      if (typeof level.maxScore === 'number') return sum + level.maxScore;
      if (Array.isArray(level.answers)) {
        let pointsPerQuestion = null;
        if (level.levelName === 0 || level.levelName === 'Easy') pointsPerQuestion = 2;
        else if (level.levelName === 1 || level.levelName === 'Medium') pointsPerQuestion = 4;
        else if (level.levelName === 6 || level.levelName === 'Hard') pointsPerQuestion = 6;
        if (pointsPerQuestion !== null) {
          return sum + (level.answers.length * pointsPerQuestion);
        }
        // If not level 0, 1, or 6, do not add to maxScore
        return sum;
      }
      return sum;
    }, 0);
  }

  if (!levelAttempts) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons name="database-search" size={60} color="#cbd5e1" />
        <Text style={styles.noDataText}>No attempt data found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FD' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Review Performance</Text>
        <Text style={styles.subHeader}>Check your answers and learn from mistakes</Text>

        <View style={styles.totalScoreBox}>
          <MaterialCommunityIcons name="trophy-award" size={22} color="#f59e42" style={{marginRight: 8}} />
          <Text style={styles.totalScoreText}>
            Total Score: <Text style={{color:'#701a75'}}>{totalScore}</Text>
            <Text style={{color:'#64748b'}}> / {maxScore}</Text>
          </Text>
        </View>
        {/* Debug: show maxScore values for each level for developer */}
        {/* <Text style={{fontSize:10, color:'#aaa', alignSelf:'center'}}>maxScores: {JSON.stringify(levelAttempts.map(l=>l.maxScore))}</Text> */}

        {levelAttempts.map((level, idx) => (
          <View key={level.levelName + idx} style={styles.levelCard}>
            {/* Level Header */}
            <View style={styles.levelHeader}>
              <View style={styles.levelTitleRow}>
                <MaterialCommunityIcons name="layers-triple" size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.levelTitle}>{level.levelName} Level</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statPillText}>
                  Score: {level.score}
                  {typeof level.maxScore === 'number' && (
                    <Text style={{color:'#fde68a'}}> / {level.maxScore}</Text>
                  )}
                </Text>
              </View>
            </View>

            {level.answers && level.answers.length > 0 ? (
              level.answers.map((ans, qidx) => (
                <View key={ans.questionId + qidx} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>{qidx + 1}.</Text>
                    <Text style={styles.questionText}>
                      {ans.questionText || "Question Content"}
                    </Text>
                  </View>

                  {/* Display all options for the question */}
                  {Array.isArray(ans.options) && ans.options.length > 0 && (
                    <View style={styles.optionsList}>
                      {ans.options.map((opt, oidx) => {
                        // Highlight if selected or correct
                        let optionStyle = [styles.optionText];
                        if (ans.selectedOption === opt && ans.isCorrect) optionStyle.push(styles.selectedCorrectOption);
                        else if (ans.selectedOption === opt) optionStyle.push(styles.selectedOption);
                        if (ans.correctOption === opt && !ans.isCorrect) optionStyle.push(styles.correctOption);
                        return (
                          <Text key={oidx} style={optionStyle}>
                            {String.fromCharCode(65 + oidx)}. {opt}
                          </Text>
                        );
                      })}
                    </View>
                  )}

                  <View style={styles.answerSection}>
                    {/* User Answer Row */}
                    <View style={[
                        styles.answerRow, 
                        ans.isCorrect ? styles.correctBg : styles.incorrectBg
                      ]}>
                      <Ionicons 
                        name={ans.isCorrect ? "checkmark-circle" : "close-circle"} 
                        size={22} 
                        color={ans.isCorrect ? "#166534" : "#991b1b"} 
                        style={styles.statusIcon}
                      />
                      <View>
                        <Text style={styles.label}>Your Answer</Text>
                        <Text style={[styles.answerValue, { color: ans.isCorrect ? '#166534' : '#991b1b' }]}>
                          {ans.selectedOption ?? 'Skipped'}
                        </Text>
                      </View>
                    </View>

                    {/* Correct Answer Row (Show if user was wrong) */}
                    {!ans.isCorrect && (
                      <View style={[styles.answerRow, styles.solutionBg]}>
                        <MaterialCommunityIcons 
                          name="lightbulb-on" 
                          size={22} 
                          color="#1e40af" 
                          style={styles.statusIcon} 
                        />
                        <View>
                          <Text style={styles.label}>Correct Answer</Text>
                          <Text style={[styles.answerValue, { color: '#1e40af' }]}>
                            {ans.correctOption}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="comment-Question-outline" size={24} color="#94a3b8" />
                <Text style={styles.noQuestions}>No questions attempted in this level.</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsList: {
    marginBottom: 8,
    marginLeft: 8,
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
    paddingVertical: 2,
    paddingLeft: 2,
  },
  selectedOption: {
    backgroundColor: '#fef9c3',
    color: '#b45309',
    fontWeight: '700',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  selectedCorrectOption: {
    backgroundColor: '#bbf7d0',
    color: '#166534',
    fontWeight: '700',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  correctOption: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontWeight: '700',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  container: { padding: 20, paddingBottom: 40 },
  totalScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 18,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
    elevation: 2,
    shadowColor: '#f59e42',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  totalScoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f59e42',
    letterSpacing: 0.2,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FD' },
  noDataText: { color: '#64748b', fontSize: 16, marginTop: 10, fontWeight: '600' },
  header: { fontSize: 28, fontWeight: '800', color: '#1e293b', textAlign: 'center' },
  subHeader: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 25, marginTop: 4 },
  levelCard: { 
    marginBottom: 30, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  levelHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#701a75', 
    padding: 16 
  },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center' },
  levelTitle: { fontSize: 18, fontWeight: '800', color: '#fff', textTransform: 'capitalize' },
  statPill: { backgroundColor: 'rgba(255,255,255,0.25)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  statPillText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  questionCard: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  questionHeader: { flexDirection: 'row', marginBottom: 15 },
  questionNumber: { fontSize: 16, fontWeight: '800', color: '#701a75', marginRight: 8 },
  questionText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#334155', lineHeight: 22 },
  answerSection: { gap: 10 },
  answerRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },
  correctBg: { backgroundColor: '#f0fdf4' },
  incorrectBg: { backgroundColor: '#fef2f2' },
  solutionBg: { backgroundColor: '#eff6ff' },
  statusIcon: { marginRight: 12 },
  label: { fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  answerValue: { fontSize: 15, fontWeight: '700' },
  emptyState: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  noQuestions: { marginTop: 8, fontStyle: 'italic', color: '#94a3b8' },
});