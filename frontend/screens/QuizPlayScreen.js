import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
// Import Toast
import Toast from 'react-native-toast-message';
import { useFonts, Lato_100Thin, Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import Svg, { Rect, Defs, LinearGradient, Stop, Circle } from "react-native-svg";

import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import ResultComponent from "./ResultScreen";

const { width } = Dimensions.get('window');

export default function QuizPlayScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { quizId } = route.params || {};
  const { user } = useContext(AuthContext);
  const { resetRetries, setScore } = useContext(GameContext);

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const [userAnswers, setUserAnswers] = useState([]);
  const [levelAttempts, setLevelAttempts] = useState([]);
  const [levelStartTime, setLevelStartTime] = useState(null);

  const [isFinished, setIsFinished] = useState(false);
  const [score, setLocalScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const questionStartTime = useRef(null);

  const [fontsLoaded] = useFonts({ Lato_100Thin, Lato_400Regular, Lato_700Bold });

  const startQuiz = async (id) => {
    resetRetries();
    setScore(0);
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/by-id/${id}`
      );

      setQuizData(data);
      setActiveQuiz(id);
      setStartTime(Date.now());
      setCurrentLevelIndex(0);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setLevelAttempts([]);
      setLevelStartTime(Date.now());
      setIsFinished(false);
      setLocalScore(0);
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load quiz data' });
      navigation.replace("QuizSelection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quizId) {
      navigation.replace("QuizSelection");
    } else {
      startQuiz(quizId);
    }
  }, [quizId]);

  useEffect(() => {
    if (!quizData) return;

    const limit = quizData.levels[currentLevelIndex]?.timeLimit || 60;
    setTimer(limit);
    questionStartTime.current = Date.now();

    if (intervalId) clearInterval(intervalId);

    const iv = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(iv);
          autoAdvanceLevel();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    setIntervalId(iv);
    return () => clearInterval(iv);
  }, [currentLevelIndex, quizData]);

  const autoAdvanceLevel = () => {
    const lvl = quizData.levels[currentLevelIndex];
    const now = Date.now();
    const unanswered = lvl.questions.slice(currentQuestionIndex).map((q) => ({
      questionId: q._id,
      selectedOption: null,
      correctOption: q.answer,
      isCorrect: false,
      timeTaken: 0,
      pointsEarned: 0,
    }));

    setLevelAttempts((a) => {
      const filtered = a.filter((entry) => entry.levelName !== lvl.name);
      return [
        ...filtered,
        {
          levelName: lvl.name,
          startedAt: new Date(levelStartTime),
          endedAt: new Date(now),
          timeTaken: Math.floor((now - levelStartTime) / 1000),
          totalQuestions: lvl.questions.length,
          correctAnswers: 0,
          wrongAnswers: lvl.questions.length,
          unanswered: lvl.questions.length,
          score: 0,
          passed: false,
          answers: unanswered,
        },
      ];
    });

    setSelectedOption(null);

    if (currentLevelIndex < quizData.levels.length - 1) {
      setCurrentLevelIndex((i) => i + 1);
      setCurrentQuestionIndex(0);
      setLevelStartTime(now);
    } else {
      setEndTime(now);
      setIsFinished(true);
    }
  };

  const handleOptionSelect = (opt) => setSelectedOption(opt);

  const handleNext = () => {
    const lvl = quizData.levels[currentLevelIndex];
    const ques = lvl.questions[currentQuestionIndex];
    const correct = selectedOption === ques.answer;
    const pts = correct ? ques.points || 1 : 0;
    const now = Date.now();
    const tTaken = Math.floor((now - questionStartTime.current) / 1000);

    const answerRecord = {
      questionId: ques._id,
      selectedOption,
      correctOption: ques.answer,
      isCorrect: correct,
      timeTaken: tTaken,
      pointsEarned: pts,
    };

    const allAns = [...userAnswers, answerRecord];
    setUserAnswers(allAns);
    setLocalScore((s) => s + pts);
    setSelectedOption(null);

    if (currentQuestionIndex < lvl.questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      questionStartTime.current = Date.now();
    } else {
      const levelScore = allAns.reduce((sum, a) => sum + a.pointsEarned, 0);
      setLevelAttempts((a) => {
        const filtered = a.filter((entry) => entry.levelName !== lvl.name);
        return [
          ...filtered,
          {
            levelName: lvl.name,
            startedAt: new Date(levelStartTime),
            endedAt: new Date(now),
            timeTaken: Math.floor((now - levelStartTime) / 1000),
            totalQuestions: lvl.questions.length,
            correctAnswers: allAns.filter((a) => a.isCorrect).length,
            wrongAnswers: allAns.filter((a) => !a.isCorrect).length,
            unanswered: allAns.filter((a) => a.selectedOption == null).length,
            score: levelScore,
            passed: levelScore >= lvl.passingMarks,
            answers: allAns,
          },
        ];
      });

      if (currentLevelIndex < quizData.levels.length - 1) {
        setCurrentLevelIndex((i) => i + 1);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setLevelStartTime(now);
      } else {
        setEndTime(now);
        setIsFinished(true);
      }
    }
  };

  const getTotalPassingMarks = () =>
    quizData.levels.reduce((sum, l) => sum + l.passingMarks, 0);

  const submitResults = async () => {
    const payload = {
      userId: user._id,
      quizId: activeQuiz,
      startedAt: new Date(startTime),
      endedAt: new Date(endTime),
      totalTimeTaken: Math.floor((endTime - startTime) / 1000),
      totalScore: score,
      result: score >= getTotalPassingMarks() ? "Passed" : "Failed",
      levelAttempts,
      feedback,
      rating,
    };

    try {
      setSubmitted(true);
      await axios.post("https://eduzzleapp-react-native.onrender.com/api/puzzle-attempts", payload);
      // REPLACED ALERT WITH TOAST
      Toast.show({
        type: 'success',
        text1: 'Success! 🎉',
        text2: 'Results submitted successfully',
        position: 'bottom'
      });
    } catch {
      Toast.show({ type: 'error', text1: 'Submission failed', text2: 'Please try again later' });
      setSubmitted(false);
    }
  };

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#701a75" />
        <Text style={styles.loadingText}>Preparing your quiz...</Text>
      </View>
    );
  }

  if (!quizData) return null;

  const showPreviousAttempts = !isFinished && quizData && user && quizId;
  const previousAttemptsBtn = showPreviousAttempts ? (
    <TouchableOpacity
      style={styles.prevBtn}
      onPress={() => navigation.navigate("PreviousAttemptsScreen", { quizId, userId: user._id })}
    >
      <Text style={styles.prevBtnText}>View Previous Attempts</Text>
    </TouchableOpacity>
  ) : null;

  if (isFinished) {
    const easyLevel = quizData.levels.find(l => l.name.toLowerCase() === "easy");
    const mediumLevel = quizData.levels.find(l => l.name.toLowerCase() === "medium");
    const hardLevel = quizData.levels.find(l => l.name.toLowerCase() === "hard");
    const easyQ = easyLevel ? easyLevel.questions.length : 0;
    const mediumQ = mediumLevel ? mediumLevel.questions.length : 0;
    const hardQ = hardLevel ? hardLevel.questions.length : 0;
    const totalPossible = (2 * easyQ) + (4 * mediumQ) + (6 * hardQ);
    const passed = score >= getTotalPassingMarks();

    return (
      <>
        <ResultComponent
          score={score}
          totalPossible={totalPossible}
          passed={passed}
          feedback={feedback}
          setFeedback={setFeedback}
          rating={rating}
          setRating={setRating}
          submitted={submitted}
          onSubmit={submitResults}
          levelAttempts={levelAttempts}
          isFinished={isFinished}
          submitResults={submitResults}
          onViewAttemptReview={() => navigation.navigate("AttemptReviewScreen", { levelAttempts })}
        />
        <Toast />
      </>
    );
  }

  const lvl = quizData.levels[currentLevelIndex];
  const ques = lvl.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lvl.questions.length) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FD' }}>
      <ScrollView contentContainerStyle={styles.testcontainer}>
        {previousAttemptsBtn}
        
        <Text style={styles.header}>{quizData.name}</Text>
        
        <View style={styles.badgeContainer}>
           <Text style={styles.levelBadge}>{lvl.name} Level</Text>
        </View>

        <View style={styles.questionTimeInfoRow}>
          <Text style={styles.questionCount}>
            Question <Text style={{color: '#701a75'}}>{currentQuestionIndex + 1}</Text> of {lvl.questions.length}
          </Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>⏱ {timer}s</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>{ques.question}</Text>

          {ques.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              onPress={() => handleOptionSelect(opt)}
              style={[
                styles.optionBtn,
                selectedOption === opt && styles.selectedOption,
              ]}
            >
              <View style={[styles.radio, selectedOption === opt && styles.radioSelected]} />
              <Text style={[styles.optionText, selectedOption === opt && styles.selectedOptionText]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedOption}
          style={[styles.nextBtn, !selectedOption && styles.disabledBtn]}
        >
          <Text style={styles.nextBtnText}>Next Question</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Toast component must be at the very bottom of the root view */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, color: '#701a75', fontFamily: 'Lato_400Regular' },
  testcontainer: {
    padding: 20,
    paddingTop: 40,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: '#1a1a1a',
    fontFamily: "Lato_700Bold",
  },
  badgeContainer: { alignItems: 'center', marginBottom: 20 },
  levelBadge: {
    fontSize: 14,
    fontWeight: "700",
    color: "#701a75",
    textTransform: 'uppercase',
    backgroundColor: "#f3e8ff",
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  prevBtn: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 20, 
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%'
  },
  prevBtnText: { color: '#701a75', fontWeight: '700', fontSize: 14, textAlign: 'center' },
  questionTimeInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  questionCount: { fontSize: 16, color: "#64748b", fontWeight: "600" },
  timerContainer: {
    backgroundColor: "#4a044e",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  timer: { fontSize: 14, fontWeight: "800", color: "#fff" },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 25,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#701a75',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  question: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: '#1e293b',
    marginBottom: 24,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    backgroundColor: '#f8fafc'
  },
  selectedOption: {
    backgroundColor: "#faf5ff",
    borderColor: "#701a75",
  },
  optionText: { fontSize: 16, color: '#475569', fontWeight: '500', marginLeft: 10 },
  selectedOptionText: { color: '#701a75', fontWeight: '700' },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  radioSelected: {
    borderColor: '#701a75',
    backgroundColor: '#701a75',
    borderWidth: 5,
  },
  nextBtn: {
    backgroundColor: "#701a75",
    padding: 18,
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#701a75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  disabledBtn: { backgroundColor: "#cbd5e1", shadowOpacity: 0, elevation: 0 },
});