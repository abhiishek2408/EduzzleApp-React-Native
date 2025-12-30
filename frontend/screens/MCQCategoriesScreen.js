import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, 
  ActivityIndicator, StyleSheet, Dimensions, Animated, Easing, Pressable 
} from 'react-native';
import { API_URL } from '../config/api';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MCQCategoriesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width * 0.75)).current; 

  const progressAnim = useRef(new Animated.Value(0)).current;

  const getStep = () => {
    if (selectedTopic) return 5;
    if (selectedCategory) return 4;
    if (selectedSyllabus) return 3;
    if (selectedSubject) return 2;
    if (selectedCourse) return 1;
    return 0;
  };

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (getStep() / 5) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [selectedTopic, selectedCategory, selectedSyllabus, selectedSubject, selectedCourse]);

  useEffect(() => { fetchData('courses', setCourses); }, []);

  const fetchData = async (endpoint, setter, params = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/mcqs/${endpoint}${params}`);
      setter(res.data[endpoint] || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedCourse) fetchData('subjects', setSubjects, `?course=${selectedCourse}`); resetFrom('subject'); }, [selectedCourse]);
  useEffect(() => { if (selectedSubject) fetchData('syllabus', setSyllabus, `?course=${selectedCourse}&subject=${selectedSubject}`); resetFrom('syllabus'); }, [selectedSubject]);
  useEffect(() => { if (selectedSyllabus) fetchData('categories', setCategories, `?course=${selectedCourse}&subject=${selectedSubject}&syllabus=${selectedSyllabus}`); resetFrom('category'); }, [selectedSyllabus]);
  useEffect(() => { if (selectedCategory) fetchData('topics', setTopics, `?course=${selectedCourse}&subject=${selectedSubject}&syllabus=${selectedSyllabus}&category=${selectedCategory}`); resetFrom('topic'); }, [selectedCategory]);

  const resetFrom = (level) => {
    if (level === 'subject') { setSelectedSubject(null); setSelectedSyllabus(null); setSelectedCategory(null); setSelectedTopic(null); }
    if (level === 'syllabus') { setSelectedSyllabus(null); setSelectedCategory(null); setSelectedTopic(null); }
    if (level === 'category') { setSelectedCategory(null); setSelectedTopic(null); }
    if (level === 'topic') { setSelectedTopic(null); }
  };

  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: drawerVisible ? 0 : -width * 0.75,
      duration: 350,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
      useNativeDriver: false,
    }).start();
  }, [drawerVisible]);

  const RenderPillList = ({ title, data, selectedValue, onSelect, icon }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={icon} size={16} color="#701a75" />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {data.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            activeOpacity={0.8}
            style={[styles.pill, selectedValue === item ? styles.pillSelected : styles.pillUnselected]}
          >
            <Text style={[styles.pillText, selectedValue === item ? styles.textSelected : styles.textUnselected]}>
              {item}
            </Text>
            {selectedValue === item && <MaterialCommunityIcons name="check-circle" size={14} color="#fff" style={{marginLeft: 6}} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // side menu Drawer
  const CourseDrawer = () => (
    <>
      {drawerVisible && (
        <Pressable style={styles.drawerOverlay} onPress={() => setDrawerVisible(false)}>
           <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        </Pressable>
      )}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerAnim }] }]}> 
        <LinearGradient colors={['#701a75', '#4a044e']} style={styles.drawerHeader}>
          <Text style={styles.drawerHeaderText}>Configure Path</Text>
          <Text style={styles.drawerHeaderSub}>Choose your base course</Text>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.drawerScroll}>
          <View style={styles.drawerSection}>
            <Text style={styles.drawerLabel}>COURSES</Text>
            {courses.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.drawerItem, selectedCourse === item && styles.drawerItemSelected]}
                onPress={() => {
                  setSelectedCourse(item);
                  setSelectedSubject(null);
                }}
              >
                <MaterialCommunityIcons 
                  name={selectedCourse === item ? "book-open-page-variant" : "book-outline"} 
                  size={20} color={selectedCourse === item ? "#701a75" : "#64748b"} 
                />
                <Text style={[styles.drawerItemText, selectedCourse === item && styles.drawerItemTextSelected]}>{item}</Text>
                {selectedCourse === item && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {selectedCourse && (
            <View style={[styles.drawerSection, { marginTop: 10 }]}>
              <Text style={styles.drawerLabel}>SUBJECTS ({selectedCourse})</Text>
              {subjects.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.drawerItem, selectedSubject === item && styles.drawerItemSelected]}
                  onPress={() => {
                    setSelectedSubject(item);
                    setDrawerVisible(false);
                  }}
                >
                  <MaterialCommunityIcons 
                    name={selectedSubject === item ? "bookmark-check" : "bookmark-outline"} 
                    size={20} color={selectedSubject === item ? "#701a75" : "#64748b"} 
                  />
                  <Text style={[styles.drawerItemText, selectedSubject === item && styles.drawerItemTextSelected]}>{item}</Text>
                  {selectedSubject === item && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fcfaff' }}>
      <CourseDrawer />
      <LinearGradient colors={['#4a044e', '#701a75']} style={styles.topHeader}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.menuBtn}>
            <MaterialCommunityIcons name="tune-vertical" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>Study Path</Text>
            <Text style={styles.headerSubtitle}>Follow steps to generate quiz</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
           <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({
             inputRange: [0, 100], outputRange: ['0%', '100%']
           }) }]} />
        </View>

        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View key={s} style={[styles.stepDot, getStep() >= s && styles.stepDotActive]}>
              {getStep() > s ? (
                <MaterialCommunityIcons name="check" size={14} color="#fff" />
              ) : (
                <Text style={[styles.stepNum, getStep() >= s && { color: '#fff' }]}>{s}</Text>
              )}
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator size="small" color="#701a75" style={{ marginTop: 20 }} />}
        
        {/* current selection context */}
        {(selectedCourse || selectedSubject) && (
          <View style={styles.contextContainer}>
            {selectedCourse && (
              <View style={styles.contextChip}>
                <Text style={styles.contextLabel}>Course</Text>
                <Text style={styles.contextValue}>{selectedCourse}</Text>
              </View>
            )}
            {selectedSubject && (
              <View style={[styles.contextChip, { backgroundColor: '#fdf4ff' }]}>
                <Text style={styles.contextLabel}>Subject</Text>
                <Text style={styles.contextValue}>{selectedSubject}</Text>
              </View>
            )}
          </View>
        )}

        {!selectedSubject && !loading && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gesture-tap" size={50} color="#e2e8f0" />
            <Text style={styles.emptyText}>Tap the menu to select a Course & Subject</Text>
          </View>
        )}

        {selectedSubject && <RenderPillList title="Module / Syllabus" icon="layers-triple-outline" data={syllabus} selectedValue={selectedSyllabus} onSelect={setSelectedSyllabus} />}
        {selectedSyllabus && <RenderPillList title="Question Category" icon="filter-variant" data={categories} selectedValue={selectedCategory} onSelect={setSelectedCategory} />}
        {selectedCategory && <RenderPillList title="Specific Topic" icon="bullseye-arrow" data={topics} selectedValue={selectedTopic} onSelect={setSelectedTopic} />}
        
        <View style={{ height: 150 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={getStep() < 5}
          onPress={() => navigation.navigate('MCQListScreen', { course: selectedCourse, subject: selectedSubject, syllabus: selectedSyllabus, category: selectedCategory, topic: selectedTopic })}
        >
          <LinearGradient
            colors={getStep() === 5 ? ['#4a044e', '#701a75'] : ['#f1f5f9', '#e2e8f0']}
            style={styles.launchBtn}
          >
            <Text style={[styles.launchBtnText, getStep() < 5 && { color: '#94a3b8' }]}>Start Practice</Text>
            <MaterialCommunityIcons name="play-circle" size={24} color={getStep() === 5 ? "#fff" : "#94a3b8"} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: { paddingHorizontal: 25, paddingBottom: 35, paddingTop: 60, borderBottomLeftRadius: 45, borderBottomRightRadius: 45, elevation: 15 },
  navRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  menuBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  headerTextWrapper: { marginLeft: 15 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 13, color: '#f5d0fe', fontWeight: '500', marginTop: 2 },
  
  progressTrack: { height: 6, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 10 },

  stepIndicator: { flexDirection: 'row', justifyContent: 'space-between' },
  stepDot: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  stepDotActive: { backgroundColor: '#4a044e', borderColor: '#fff' },
  stepNum: { fontSize: 13, fontWeight: '900', color: '#f5d0fe' },

  body: { paddingHorizontal: 20 },
  contextContainer: { marginTop: 20, gap: 10 },
  contextChip: { backgroundColor: '#fff', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  contextLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  contextValue: { fontSize: 15, fontWeight: '700', color: '#701a75' },

  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#94a3b8', fontSize: 14, marginTop: 15, textAlign: 'center', width: '70%', fontWeight: '500' },

  sectionContainer: { marginTop: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconCircle: { width: 40, height: 40, backgroundColor: '#fdf4ff', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fae8ff' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1e293b', marginLeft: 12 },
  
  scrollContent: { paddingRight: 20, paddingVertical: 5 },
  pill: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 18, marginRight: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5 },
  pillUnselected: { backgroundColor: '#fff', borderColor: '#f1f5f9', elevation: 2 },
  pillSelected: { backgroundColor: '#701a75', borderColor: '#4a044e', elevation: 5 },
  pillText: { fontSize: 14, fontWeight: '700' },
  textUnselected: { color: '#64748b' },
  textSelected: { color: '#fff' },

  footer: { position: 'absolute', bottom: 0, width: width, padding: 25, backgroundColor: 'rgba(252,250,255,0.9)', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  launchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 22, gap: 12, elevation: 8 },
  launchBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },

  // Drawer styles
  drawerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },
  drawerContainer: { position: 'absolute', top: 0, left: 0, width: width * 0.75, height: height, backgroundColor: '#fff', zIndex: 101, elevation: 25, borderTopRightRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' },
  drawerHeader: { padding: 30, paddingTop: 60 },
  drawerHeaderText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  drawerHeaderSub: { color: '#f5d0fe', fontSize: 12, marginTop: 4 },
  drawerScroll: { padding: 20 },
  drawerSection: { marginBottom: 25 },
  drawerLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1, marginBottom: 10 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 8 },
  drawerItemSelected: { backgroundColor: '#fdf4ff' },
  drawerItemText: { marginLeft: 12, fontSize: 15, color: '#475569', fontWeight: '500' },
  drawerItemTextSelected: { color: '#701a75', fontWeight: '800' },
  activeIndicator: { width: 4, height: 20, backgroundColor: '#701a75', borderRadius: 2, position: 'absolute', right: 10 }
});

export default MCQCategoriesScreen;