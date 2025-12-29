import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { API_URL } from '../config/api';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const MCQCategoriesScreen = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);


  // Fetch all courses on mount
  useEffect(() => {
    fetchData('courses', setCourses);
  }, []);

  const fetchData = async (endpoint, setter, params = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/mcqs/${endpoint}${params}`);
      setter(res.data[endpoint] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When course changes, fetch subjects
  useEffect(() => {
    if (selectedCourse) fetchData('subjects', setSubjects, `?course=${selectedCourse}`);
    else setSubjects([]);
    setSelectedSubject(null);
    setSelectedSyllabus(null);
    setSelectedCategory(null);
    setSelectedTopic(null);
  }, [selectedCourse]);

  // When subject changes, fetch syllabus
  useEffect(() => {
    if (selectedCourse && selectedSubject) fetchData('syllabus', setSyllabus, `?course=${selectedCourse}&subject=${selectedSubject}`);
    else setSyllabus([]);
    setSelectedSyllabus(null);
    setSelectedCategory(null);
    setSelectedTopic(null);
  }, [selectedSubject]);

  // When syllabus changes, fetch categories
  useEffect(() => {
    if (selectedCourse && selectedSubject && selectedSyllabus) fetchData('categories', setCategories, `?course=${selectedCourse}&subject=${selectedSubject}&syllabus=${selectedSyllabus}`);
    else setCategories([]);
    setSelectedCategory(null);
    setSelectedTopic(null);
  }, [selectedSyllabus]);

  // When category changes, fetch topics
  useEffect(() => {
    if (selectedCourse && selectedSubject && selectedSyllabus && selectedCategory) fetchData('topics', setTopics, `?course=${selectedCourse}&subject=${selectedSubject}&syllabus=${selectedSyllabus}&category=${selectedCategory}`);
    else setTopics([]);
    setSelectedTopic(null);
  }, [selectedCategory]);

  const RenderPillList = ({ title, data, selectedValue, onSelect, icon }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={18} color="#a21caf" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {data.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
            style={[
              styles.pill,
              selectedValue === item ? styles.pillSelected : styles.pillUnselected
            ]}
          >
            <Text style={[styles.pillText, selectedValue === item ? styles.textSelected : styles.textUnselected]}>
              {item}
            </Text>
            {selectedValue === item && (
              <MaterialCommunityIcons name="check-circle" size={14} color="#fff" style={{marginLeft: 5}} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const isAllSelected = selectedSubject && selectedCourse && selectedSyllabus && selectedCategory && selectedTopic;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* --- HEADER --- */}
      <LinearGradient colors={['#7c3aed', '#a21caf']} style={styles.topHeader}>
        <Text style={styles.headerTitle}>Curated MCQs</Text>
        <Text style={styles.headerSubtitle}>Pick your path and start testing</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator size="large" color="#a21caf" style={{ marginVertical: 10 }} />}

        <RenderPillList 
          title="Subject" icon="book-open-variant" data={subjects} 
          selectedValue={selectedSubject} 
          onSelect={(val) => { setSelectedSubject(val); setSelectedCourse(null); setSelectedSyllabus(null); setSelectedCategory(null); setSelectedTopic(null); }} 
        />

        {selectedSubject && (
          <RenderPillList 
            title="Course" icon="school" data={courses} 
            selectedValue={selectedCourse} 
            onSelect={(val) => { setSelectedCourse(val); setSelectedSyllabus(null); setSelectedCategory(null); setSelectedTopic(null); }} 
          />
        )}

        {selectedCourse && (
          <RenderPillList 
            title="Syllabus" icon="format-list-bulleted" data={syllabus} 
            selectedValue={selectedSyllabus} 
            onSelect={(val) => { setSelectedSyllabus(val); setSelectedCategory(null); setSelectedTopic(null); }} 
          />
        )}

        {selectedSyllabus && (
          <RenderPillList 
            title="Category" icon="shape" data={categories} 
            selectedValue={selectedCategory} 
            onSelect={(val) => { setSelectedCategory(val); setSelectedTopic(null); }} 
          />
        )}

        {selectedCategory && (
          <RenderPillList 
            title="Topic" icon="target" data={topics} 
            selectedValue={selectedTopic} 
            onSelect={setSelectedTopic} 
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- FLOATING ACTION BUTTON --- */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!isAllSelected}
          onPress={() => navigation.navigate('MCQListScreen', { subject: selectedSubject, course: selectedCourse, syllabus: selectedSyllabus, category: selectedCategory, topic: selectedTopic })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isAllSelected ? ['#4a044e', '#701a75'] : ['#e2e8f0', '#cbd5e1']}
            style={styles.browseBtn}
          >
            <Text style={styles.browseBtnText}>Explore MCQs</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: { padding: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: '#f5d0fe', fontWeight: '600' },
  body: { paddingHorizontal: 20 },
  sectionContainer: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginLeft: 8 },
  scrollContent: { paddingRight: 20 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  pillUnselected: { backgroundColor: '#fdf4ff', borderColor: '#fae8ff' },
  pillSelected: { backgroundColor: '#a21caf', borderColor: '#701a75', elevation: 4 },
  pillText: { fontSize: 14, fontWeight: '700' },
  textUnselected: { color: '#701a75' },
  textSelected: { color: '#fff' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(255,255,255,0.9)' },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
  },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});

export default MCQCategoriesScreen;