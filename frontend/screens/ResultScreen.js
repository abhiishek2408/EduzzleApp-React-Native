import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AppState,
  View,
  Dimensions,
} from "react-native";
import Toast from 'react-native-root-toast';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function ResultComponent({
  score,
  totalPossible,
  passed,
  feedback,
  setFeedback,
  rating,
  setRating,
  submitted,
  onSubmit,
  isFinished,
  onViewAttemptReview,
}) {
  const hasSubmittedRef = useRef(false);
  const navigation = useNavigation();
  const [showToast, setShowToast] = useState(false);

  const handleSubmitOnce = () => {
    if (!hasSubmittedRef.current && isFinished && !submitted) {
      hasSubmittedRef.current = true;
      onSubmit();
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (showToast) {
      Toast.show('Successfully submitted!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      setShowToast(false);
    }
  }, [showToast]);

  useEffect(() => {
    return () => handleSubmitOnce();
  }, [isFinished, submitted]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") handleSubmitOnce();
    });
    return () => sub.remove();
  }, [isFinished, submitted]);

  const renderStars = () => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={40}
            color={star <= rating ? "#facc15" : "#d1d5db"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSpacer} />
      
      <View style={styles.card}>
        {/* Animated-style Icon Header */}
        <View style={[styles.iconCircle, { backgroundColor: passed ? '#dcfce7' : '#fee2e2' }]}>
          <Ionicons
            name={passed ? "trophy" : "ribbon"}
            size={60}
            color={passed ? "#15803d" : "#b91c1c"}
          />
        </View>

        <Text style={styles.title}>
          {passed ? "Congratulations!" : "Keep Pushing!"}
        </Text>
        <Text style={styles.subtitle}>You've completed the challenge</Text>

        {/* Score Display Area */}
        <View style={styles.scoreDashboard}>
          <View style={styles.scoreCircle}>
             <Text style={styles.scoreLabel}>SCORE</Text>
             <Text style={styles.scoreText}>{score}</Text>
             <View style={styles.scoreDivider} />
             <Text style={styles.totalText}>{totalPossible}</Text>
          </View>
          
          <View style={[styles.statusBadge, passed ? styles.passBadge : styles.failBadge]}>
            <Ionicons
              name={passed ? "checkmark-circle" : "alert-circle"}
              size={20}
              color={passed ? "#15803d" : "#b91c1c"}
            />
            <Text style={[styles.statusText, { color: passed ? "#15803d" : "#b91c1c" }]}>
              {passed ? "PASSED" : "FAILED"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {submitted && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={onViewAttemptReview}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={22} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.buttonText}>Review Detailed Answers</Text>
          </TouchableOpacity>
        )}

        {!submitted && (
          <View style={styles.feedbackSection}>
            <View style={styles.inputContainer}>
               <Text style={styles.inputLabel}>How was the test?</Text>
               <TextInput
                placeholder="Write a quick feedback..."
                placeholderTextColor="#94a3b8"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                style={styles.input}
              />
            </View>

            <Text style={styles.ratingTitle}>Rate your experience</Text>
            {renderStars()}

            <TouchableOpacity
              onPress={handleSubmitOnce}
              disabled={submitted || !rating}
              style={[
                styles.submitButton,
                (submitted || !rating) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.submitButtonText}>Finish & Save Results</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {submitted && (
          <View style={styles.submittedContainer}>
            <View style={styles.successIconBg}>
               <Ionicons name="heart" size={30} color="#701a75" />
            </View>
            <Text style={styles.successText}>
              Results Saved! Your progress has been updated in your profile.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: "#F8F9FD" },
  headerSpacer: { height: 40 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -75, // Pull icon up for modern overlap effect
    borderWidth: 5,
    borderColor: '#F8F9FD'
  },
  title: { fontSize: 26, fontWeight: "900", color: "#1e293b", marginTop: 15, textAlign: 'center' },
  subtitle: { fontSize: 15, color: "#64748b", marginBottom: 25, fontWeight: '500' },
  scoreDashboard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#faf5ff',
    borderWidth: 2,
    borderColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: { fontSize: 10, fontWeight: '800', color: '#a78bfa', letterSpacing: 2 },
  scoreText: { fontSize: 42, fontWeight: "900", color: "#701a75", height: 45 },
  scoreDivider: { height: 2, width: 40, backgroundColor: '#e2e8f0', marginVertical: 4 },
  totalText: { fontSize: 18, fontWeight: "700", color: "#94a3b8" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  passBadge: { backgroundColor: "#dcfce7" },
  failBadge: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 13, fontWeight: "800", marginLeft: 6 },
  feedbackSection: { width: '100%' },
  inputContainer: { marginTop: 10 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8 },
  input: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#f8fafc",
    fontSize: 15,
    color: "#1e293b",
    textAlignVertical: "top",
  },
  ratingTitle: { fontSize: 16, marginTop: 25, marginBottom: 15, color: "#1e293b", fontWeight: "800", textAlign: 'center' },
  starRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  starButton: { marginHorizontal: 4 },
  submitButton: {
    backgroundColor: "#701a75",
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#701a75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  submitButtonText: { color: "#fff", fontWeight: "800", fontSize: 16, marginRight: 10 },
  reviewButton: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  buttonDisabled: { backgroundColor: "#cbd5e1", shadowOpacity: 0 },
  submittedContainer: { 
    alignItems: "center", 
    marginTop: 20, 
    padding: 20, 
    backgroundColor: '#f8fafc', 
    borderRadius: 20,
    width: '100%' 
  },
  successIconBg: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  successText: { fontSize: 15, color: "#475569", textAlign: "center", fontWeight: "600", lineHeight: 22 },
});