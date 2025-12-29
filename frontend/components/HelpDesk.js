import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Smooth animation enable for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpDesk = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    { question: "How do I start a quiz?", answer: "Browse the available quizzes on the home screen and tap on any quiz card. Then click 'Start Quiz' to begin.", icon: "play-circle" },
    { question: "What are coins?", answer: "Coins are rewards earned by completing quizzes and quests. Use them to unlock badges and premium features.", icon: "dots-hexagon" },
    { question: "Leaderboard rules?", answer: "Rankings are based on total points. Higher quiz scores help you climb Friends and Global ranks.", icon: "trophy" },
    { question: "Daily quests?", answer: "Challenges that reset every 24 hours. Complete 5 quizzes to maintain your streak and earn bonus XP!", icon: "calendar-star" },
    { question: "How to add friends?", answer: "Search users by name in the Friends screen and send requests to compete together.", icon: "account-group" },
  ];

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* HEADER (PuzzleScreen style) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
          <View style={{ backgroundColor: '#fdf4ff', padding: 8, borderRadius: 12, marginRight: 10 }}>
            <MaterialCommunityIcons name="help-circle" size={20} color="#701a75" />
          </View>
          <View style={{ marginRight: 28 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e1b4b' }}>Help Desk</Text>
            <Text style={{ fontSize: 11, color: '#701a75', fontWeight: '700', marginTop: -2 }}>Frequently Asked Questions</Text>
          </View>
        </View>
      </View>

      {/* --- FAQ Accordion List --- */}
      <View style={styles.faqList}>
        {faqs.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <View key={index} style={[styles.faqCard, isExpanded && styles.activeCard]}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                activeOpacity={0.7}
                style={styles.faqHeader}
              >
                {/* Updated Icon Box style to match your request (#fdf4ff) */}
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name={faq.icon} size={22} color="#701a75" />
                </View>
                
                <Text style={[styles.questionText, isExpanded && { color: '#701a75' }]}>
                  {faq.question}
                </Text>

                <MaterialCommunityIcons
                  name={isExpanded ? "minus-circle-outline" : "plus-circle-outline"}
                  size={22}
                  color={isExpanded ? "#701a75" : "#cbd5e1"}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.answerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* --- Support Footer --- */}
      <LinearGradient
        colors={['#4a044e', '#701a75']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.supportCard}
      >
        <MaterialCommunityIcons name="email-fast-outline" size={24} color="#f5d0fe" />
        <View style={styles.supportTextContent}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportEmail}>support@eduzzle.com</Text>
        </View>
        <TouchableOpacity style={styles.contactBtn}>
           <Text style={styles.contactBtnText}>Email Us</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, marginVertical: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerIconBg: { padding: 6, borderRadius: 10, marginRight: 10 },
  titleText: { fontSize: 18, fontWeight: '900', color: '#1e293b', letterSpacing: -0.5 },

  faqList: { gap: 10 },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    // Soft Shadow
    elevation: 3,
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  activeCard: {
    borderColor: '#fae8ff',
    backgroundColor: '#fdf4ff', // Light purple tint when open
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#fdf4ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#fae8ff',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 66, // Align text with question (after icon)
  },
  divider: {
    height: 1,
    backgroundColor: '#fae8ff',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    fontWeight: '500',
  },

  supportCard: {
    marginTop: 20,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportTextContent: { flex: 1, marginLeft: 12 },
  supportTitle: { color: '#f5d0fe', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  supportEmail: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  contactBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  contactBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' }
});

export default HelpDesk;