import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { API_URL } from '../config/api';
import axios from 'axios';

const MCQListScreen = ({ route }) => {

  const { course, subject, syllabus, category, topic } = route.params || {};
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>MCQs</Text>
      {loading && <ActivityIndicator size="small" color="#a21caf" />}
      {!loading && mcqs.length === 0 && (
        <Text style={{ color: '#a21caf', marginTop: 20 }}>No MCQs found for this selection.</Text>
      )}
      {mcqs.map((mcq, idx) => (
        <View key={mcq._id || idx} style={{ marginBottom: 24, padding: 16, backgroundColor: '#f9f5ff', borderRadius: 12 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{mcq.question?.text}</Text>
          {mcq.question?.images && mcq.question.images.map((img, i) => (
            <Text key={i} style={{ color: '#888', fontSize: 12 }}>[Image: {img}]</Text>
          ))}
          {mcq.options && mcq.options.map((opt, i) => (
            <Text key={i} style={{ marginLeft: 8, marginVertical: 2 }}>
              {String.fromCharCode(65 + i)}. {opt.text}
            </Text>
          ))}
          {mcq.solution?.text && (
            <Text style={{ marginTop: 8, color: '#701a75', fontSize: 13 }}>
              Solution: {mcq.solution.text}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default MCQListScreen;
