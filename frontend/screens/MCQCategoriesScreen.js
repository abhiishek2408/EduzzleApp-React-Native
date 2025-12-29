import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

import { API_URL } from '../config/api';
import axios from 'axios';

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

  // Fetch subjects on mount
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/mcqs/subjects`).then(res => {
      setSubjects(res.data.subjects || []);
      setLoading(false);
    });
  }, []);

  // Fetch courses when subject changes
  useEffect(() => {
    if (selectedSubject) {
      setLoading(true);
      axios.get(`${API_URL}/api/mcqs/courses?subject=${selectedSubject}`).then(res => {
        setCourses(res.data.courses || []);
        setLoading(false);
      });
    } else {
      setCourses([]);
      setSelectedCourse(null);
    }
  }, [selectedSubject]);

  // Fetch syllabus when course changes
  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      axios.get(`${API_URL}/api/mcqs/syllabus?course=${selectedCourse}`).then(res => {
        setSyllabus(res.data.syllabus || []);
        setLoading(false);
      });
    } else {
      setSyllabus([]);
      setSelectedSyllabus(null);
    }
  }, [selectedCourse]);

  // Fetch categories when syllabus changes
  useEffect(() => {
    if (selectedSyllabus) {
      setLoading(true);
      axios.get(`${API_URL}/api/mcqs/categories?syllabus=${selectedSyllabus}`).then(res => {
        setCategories(res.data.categories || []);
        setLoading(false);
      });
    } else {
      setCategories([]);
      setSelectedCategory(null);
    }
  }, [selectedSyllabus]);

  // Fetch topics when category changes
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      axios.get(`${API_URL}/api/mcqs/topics?category=${selectedCategory}`).then(res => {
        setTopics(res.data.topics || []);
        setLoading(false);
      });
    } else {
      setTopics([]);
      setSelectedTopic(null);
    }
  }, [selectedCategory]);

  const handleBrowseMCQs = () => {
    navigation.navigate('MCQListScreen', {
      subject: selectedSubject,
      course: selectedCourse,
      syllabus: selectedSyllabus,
      category: selectedCategory,
      topic: selectedTopic,
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Browse MCQs</Text>
      {loading && <ActivityIndicator size="small" color="#a21caf" />}
      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Subject</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        {subjects.map(subj => (
          <TouchableOpacity
            key={subj}
            style={{
              backgroundColor: selectedSubject === subj ? '#a21caf' : '#f3e8ff',
              padding: 10,
              borderRadius: 10,
              marginRight: 8,
            }}
            onPress={() => {
              setSelectedSubject(subj);
              setSelectedCourse(null);
              setSelectedSyllabus(null);
              setSelectedCategory(null);
              setSelectedTopic(null);
            }}
          >
            <Text style={{ color: selectedSubject === subj ? '#fff' : '#701a75', fontWeight: 'bold' }}>{subj}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedSubject && <>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Course</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {courses.map(course => (
            <TouchableOpacity
              key={course}
              style={{
                backgroundColor: selectedCourse === course ? '#a21caf' : '#f3e8ff',
                padding: 10,
                borderRadius: 10,
                marginRight: 8,
              }}
              onPress={() => {
                setSelectedCourse(course);
                setSelectedSyllabus(null);
                setSelectedCategory(null);
                setSelectedTopic(null);
              }}
            >
              <Text style={{ color: selectedCourse === course ? '#fff' : '#701a75', fontWeight: 'bold' }}>{course}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>}
      {selectedCourse && <>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Syllabus</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {syllabus.map(syl => (
            <TouchableOpacity
              key={syl}
              style={{
                backgroundColor: selectedSyllabus === syl ? '#a21caf' : '#f3e8ff',
                padding: 10,
                borderRadius: 10,
                marginRight: 8,
              }}
              onPress={() => {
                setSelectedSyllabus(syl);
                setSelectedCategory(null);
                setSelectedTopic(null);
              }}
            >
              <Text style={{ color: selectedSyllabus === syl ? '#fff' : '#701a75', fontWeight: 'bold' }}>{syl}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>}
      {selectedSyllabus && <>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={{
                backgroundColor: selectedCategory === cat ? '#a21caf' : '#f3e8ff',
                padding: 10,
                borderRadius: 10,
                marginRight: 8,
              }}
              onPress={() => {
                setSelectedCategory(cat);
                setSelectedTopic(null);
              }}
            >
              <Text style={{ color: selectedCategory === cat ? '#fff' : '#701a75', fontWeight: 'bold' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>}
      {selectedCategory && <>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Topic</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {topics.map(topic => (
            <TouchableOpacity
              key={topic}
              style={{
                backgroundColor: selectedTopic === topic ? '#a21caf' : '#f3e8ff',
                padding: 10,
                borderRadius: 10,
                marginRight: 8,
              }}
              onPress={() => setSelectedTopic(topic)}
            >
              <Text style={{ color: selectedTopic === topic ? '#fff' : '#701a75', fontWeight: 'bold' }}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>}
      <TouchableOpacity
        style={{
          backgroundColor: '#a21caf',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 20,
          opacity: selectedSubject && selectedCourse && selectedSyllabus && selectedCategory && selectedTopic ? 1 : 0.5,
        }}
        disabled={!(selectedSubject && selectedCourse && selectedSyllabus && selectedCategory && selectedTopic)}
        onPress={handleBrowseMCQs}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Browse MCQs</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MCQCategoriesScreen;
