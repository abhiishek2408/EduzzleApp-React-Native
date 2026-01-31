import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export default function AttemptReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { attempt } = route.params || {};

  if (!attempt) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons name="database-search" size={60} color="#cbd5e1" />
        <Text style={styles.noDataText}>No attempt data found.</Text>
      </View>
    );
  }

  const { levelAttempts = [] } = attempt;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FD' }}>
      {/* Header Area */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#701a75" />
        </TouchableOpacity>
        <View style={styles.headerTextContent}>
          <Text style={styles.headerLabel}>Review Results</Text>
          <Text style={styles.quizName} numberOfLines={1}>{attempt.quizId.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Score Summary Dashboard */}
        <View style={styles.scoreDashboard}>
          <View style={styles.scoreInfo}>
            <Text style={styles.dashboardLabel}>TOTAL SCORE</Text>
            <Text style={styles.dashboardValue}>
              {attempt.totalScore}<Text style={styles.dashboardSubValue}> / {attempt.quizId.totalMarks}</Text>
            </Text>
          </View>
          <View style={styles.trophyContainer}>
             <MaterialCommunityIcons name="trophy-variant" size={40} color="#f59e42" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Performance breakdown</Text>

        {levelAttempts.map((level, idx) => {
          let quizQuestions = [];
          if (attempt.quizId && Array.isArray(attempt.quizId.levels)) {
            const quizLevel = attempt.quizId.levels.find(lvl => lvl.name === level.levelName);
            if (quizLevel && Array.isArray(quizLevel.questions)) quizQuestions = quizLevel.questions;
          }

          return (
            <View key={level.levelName + idx} style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <View style={styles.levelTitleRow}>
                  <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" style={{marginRight: 6}} />
                  <Text style={styles.levelTitle}>{level.levelName} Mode</Text>
                </View>
                <View style={styles.statPill}>
                  <Text style={styles.statPillText}>{level.score} Pts</Text>
                </View>
              </View>

              {level.answers && level.answers.length > 0 ? (
                level.answers.map((ans, qidx) => {
                  let questionStatement = "Question Content";
                  let optionsList = [];
                  if (quizQuestions.length > 0) {
                    const quizQ = quizQuestions.find(q => q._id?.toString() === ans.questionId?.toString());
                    if (quizQ) {
                      questionStatement = quizQ.question;
                      optionsList = quizQ.options;
                    }
                  }

                  return (
                    <View key={ans.questionId + qidx} style={styles.questionSection}>
                      <View style={styles.questionHeader}>
                        <View style={styles.qCircle}><Text style={styles.qText}>{qidx + 1}</Text></View>
                        <Text style={styles.questionStatement}>{questionStatement}</Text>
                      </View>

                      {/* Options List with Interactive Look */}
                      <View style={styles.optionsList}>
                        {optionsList.map((opt, oidx) => {
                          const isSelected = ans.selectedOption === opt;
                          const isCorrect = ans.correctOption === opt;
                          
                          let containerStyle = styles.optionBox;
                          let iconName = null;

                          if (isSelected && ans.isCorrect) {
                            containerStyle = [styles.optionBox, styles.optCorrect];
                            iconName = "checkmark-circle";
                          } else if (isSelected && !ans.isCorrect) {
                            containerStyle = [styles.optionBox, styles.optWrong];
                            iconName = "close-circle";
                          } else if (isCorrect) {
                            containerStyle = [styles.optionBox, styles.optHighlightCorrect];
                            iconName = "checkmark-circle-outline";
                          }

                          return (
                            <View key={oidx} style={containerStyle}>
                              <Text style={[styles.optionText, (isSelected || isCorrect) && styles.boldText]}>
                                {String.fromCharCode(65 + oidx)}. {opt}
                              </Text>
                              {iconName && <Ionicons name={iconName} size={18} color={isCorrect ? "#16a34a" : "#dc2626"} />}
                            </View>
                          );
                        })}
                      </View>

                      {/* Summary Status */}
                      <View style={[styles.statusBanner, ans.isCorrect ? styles.bannerPass : styles.bannerFail]}>
                         <Text style={[styles.bannerText, {color: ans.isCorrect ? '#166534' : '#991b1b'}]}>
                           {ans.isCorrect ? "Correctly Answered" : `Mistake • Answer was: ${ans.correctOption}`}
                         </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noQuestions}>No attempts in this level.</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#faf5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContent: { flex: 1 },
  headerLabel: { fontSize: 12, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  quizName: { fontSize: 18, fontWeight: '800', color: '#701a75' },
  
  container: { padding: 20 },
  scoreDashboard: {
    flexDirection: 'row',
    backgroundColor: '#701a75',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#701a75',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  dashboardLabel: { color: 'rgba(255,255,255,0.6)', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  dashboardValue: { color: '#fff', fontSize: 32, fontWeight: '900' },
  dashboardSubValue: { color: 'rgba(255,255,255,0.4)', fontSize: 18 },
  trophyContainer: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 20 },
  
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 0.5 },
  
  levelCard: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    marginBottom: 30, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  levelHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#f8fafc', 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#701a75', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  levelTitle: { fontSize: 13, fontWeight: '800', color: '#fff' },
  statPill: { backgroundColor: '#f1f5f9', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10 },
  statPillText: { color: '#475569', fontWeight: '800', fontSize: 12 },

  questionSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  questionHeader: { flexDirection: 'row', marginBottom: 15 },
  qCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  qText: { color: '#701a75', fontWeight: '900', fontSize: 14 },
  questionStatement: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1e293b', lineHeight: 22 },

  optionsList: { gap: 8, marginBottom: 15 },
  optionBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  optionText: { fontSize: 14, color: '#64748b', flex: 1 },
  boldText: { fontWeight: '700' },
  
  optCorrect: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  optWrong: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
  optHighlightCorrect: { borderStyle: 'dashed', borderColor: '#22c55e', backgroundColor: '#f0fdf4' },

  statusBanner: { padding: 10, borderRadius: 10, alignItems: 'center' },
  bannerPass: { backgroundColor: '#f0fdf4' },
  bannerFail: { backgroundColor: '#fff1f2' },
  bannerText: { fontSize: 12, fontWeight: '800' },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { color: '#64748b', fontWeight: '600', marginTop: 10 },
  noQuestions: { padding: 20, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }
});