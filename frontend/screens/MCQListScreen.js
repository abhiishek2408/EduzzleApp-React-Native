import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, ActivityIndicator, 
  StyleSheet, TouchableOpacity, Image, Dimensions 
} from 'react-native';
import { API_URL } from '../config/api';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MCQListScreen = ({ route, navigation }) => {
  const { course, subject, syllabus, category, topic } = route.params || {};
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState({}); // To toggle individual solutions

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/mcqs`, {
        params: { course, subject, syllabus, category, topic },
      })
      .then((res) => {
        setMcqs(res.data.mcqs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [course, subject, syllabus, category, topic]);

  const toggleSolution = (id) => {
    setShowSolution(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {/* --- STICKY HEADER --- */}
      <LinearGradient colors={['#4a044e', '#701a75']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{topic || 'Question Bank'}</Text>
            <Text style={styles.headerSubtitle}>{mcqs.length} Questions Found</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4a044e" />
            <Text style={styles.loaderText}>Loading Questions...</Text>
          </View>
        ) : mcqs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="comment-question-outline" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>No MCQs available for this topic yet.</Text>
          </View>
        ) : (
          mcqs.map((mcq, idx) => (
            <View key={mcq._id || idx} style={styles.card}>
              {/* Question Meta */}
              <View style={styles.cardHeader}>
                <View style={styles.qBadge}>
                  <Text style={styles.qBadgeText}>Q.{idx + 1}</Text>
                </View>
                <TouchableOpacity>
                   <MaterialCommunityIcons name="bookmark-outline" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {/* Question Text */}
              <Text style={styles.questionText}>{mcq.question?.text}</Text>

              {/* Question Images */}
              {mcq.question?.images && mcq.question.images.map((img, i) => (
                <Image 
                  key={i} 
                  source={{ uri: img }} 
                  style={styles.qImage} 
                  resizeMode="contain" 
                />
              ))}

              {/* Options */}
              <View style={styles.optionsContainer}>
                {mcq.options && mcq.options.map((opt, i) => (
                  <View key={i} style={styles.optionRow}>
                    <View style={styles.optionCircle}>
                      <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
                    </View>
                    <Text style={styles.optionText}>{opt.text}</Text>
                  </View>
                ))}
              </View>

              {/* Solution Toggle */}
              {mcq.solution?.text && (
                <View style={styles.solutionBox}>
                  <TouchableOpacity 
                    onPress={() => toggleSolution(mcq._id || idx)}
                    style={styles.solutionToggle}
                  >
                    <Text style={styles.solutionToggleText}>
                      {showSolution[mcq._id || idx] ? 'Hide Solution' : 'View Solution'}
                    </Text>
                    <MaterialCommunityIcons 
                      name={showSolution[mcq._id || idx] ? "chevron-up" : "chevron-down"} 
                      size={20} color="#701a75" 
                    />
                  </TouchableOpacity>
                  
                   {showSolution[mcq._id || idx] && (
                    <View style={styles.solutionContent}>
                          <View style={styles.answerBox}>
                            <Text style={styles.answerText}>Answer: {mcq.answer}</Text>
                          </View>
                          <View style={{height: 10}} />
                          <Text>
                            <Text style={[styles.solutionText, {fontWeight: 'bold'}]}>Explanation: </Text>
                            <Text style={styles.solutionText}>{mcq.solution.text}</Text>
                          </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#fff', flex: 1 },
  headerSubtitle: { fontSize: 12, color: '#f5d0fe', fontWeight: '600' },

  scrollBody: { padding: 16 },
  loaderContainer: { marginTop: 100, alignItems: 'center' },
  loaderText: { marginTop: 10, color: '#64748b', fontWeight: '600' },
  
  emptyContainer: { marginTop: 100, alignItems: 'center', padding: 40 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 15, fontSize: 16, fontWeight: '600' },

  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#701a75',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  qBadge: { backgroundColor: '#fdf4ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fae8ff' },
  qBadgeText: { color: '#701a75', fontWeight: '900', fontSize: 12 },
  
  questionText: { fontSize: 17, fontWeight: '700', color: '#1e293b', lineHeight: 24, marginBottom: 15 },
  qImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15, backgroundColor: '#f1f5f9' },

  optionsContainer: { gap: 10, marginBottom: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#f1f5f9' },
  optionCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  optionLetter: { fontSize: 12, fontWeight: '900', color: '#64748b' },
  optionText: { fontSize: 15, color: '#334155', fontWeight: '600', flex: 1 },

  solutionBox: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  solutionToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 5 },
  solutionToggleText: { color: '#701a75', fontWeight: '800', fontSize: 14 },
  solutionContent: { backgroundColor: '#fdf4ff', padding: 15, borderRadius: 15, marginTop: 10 },
  solutionText: { color: '#4a044e', fontSize: 14, lineHeight: 20, fontWeight: '500' }
});

export default MCQListScreen;