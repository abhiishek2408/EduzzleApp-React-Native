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
} from "react-native";
import { useFonts, Lato_100Thin, Lato_400Regular } from "@expo-google-fonts/lato";
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Ellipse,
  Line,
  Polyline,
  Polygon,
  Path,
} from "react-native-svg";

import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import ResultComponent from "./ResultScreen";

export default function PuzzleScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { puzzleId } = route.params || {};
  const { user } = useContext(AuthContext);
  const { resetRetries, setScore } = useContext(GameContext);

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [activePuzzle, setActivePuzzle] = useState(null);
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

  // ---- Start Quiz ----
  const startQuiz = async (id) => {
    resetRetries();
    setScore(0);
    setLoading(true);

    try {
      const { data } = await axios.get(
        `http://10.124.194.56:3000/api/fetch-puzzles/by-id/${id}`
      );

      setQuizData(data);
      setActivePuzzle(id);
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
      Alert.alert("Error", "Could not load puzzle data");
      navigation.replace("PuzzleSelection");
    } finally {
      setLoading(false);
    }
  };

  // ---- Load Puzzle ----
  useEffect(() => {
    if (!puzzleId) {
      navigation.replace("PuzzleSelection");
    } else {
      startQuiz(puzzleId);
    }
  }, [puzzleId]);

  // ---- Timer ----
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

  // ---- Auto Advance ----
  const autoAdvanceLevel = () => {
    const lvl = quizData.levels[currentLevelIndex];
    const now = Date.now();

    const unanswered = lvl.questions
      .slice(currentQuestionIndex)
      .map((q) => ({
        questionId: q._id,
        selectedOption: null,
        correctOption: q.answer,
        isCorrect: false,
        timeTaken: 0,
        pointsEarned: 0,
      }));

    setLevelAttempts((a) => [
      ...a,
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
    ]);

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

  // ---- Answer Handling ----
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

      setLevelAttempts((a) => [
        ...a,
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
      ]);

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

  // ---- Submit Results ----
  const submitResults = async () => {
    const payload = {
      user: user._id,
      puzzle: activePuzzle,
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
      await axios.post("http://10.124.194.56:3000/api/puzzle-attempts", payload);
      Alert.alert("Success", "Results submitted successfully");
    } catch {
      Alert.alert("Error", "Submission failed");
      setSubmitted(false);
    }
  };

  // ---- Render ----
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!quizData) {
    return null; // fallback
  }

  // ---- Show result screen ----
  if (isFinished) {
    const totalPossible = levelAttempts.reduce((sum, l) => sum + l.score, 0);
    const passed = score >= getTotalPassingMarks();

    return (
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
      />
    );
  }

  // ---- Otherwise show the quiz ----
  const lvl = quizData.levels[currentLevelIndex];
  const ques = lvl.questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.testcontainer}>
      {/* SVG Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%">
          {/* Gradients, shapes, puzzle symbols here */}
        </Svg>
      </View>

      <Text style={styles.header}>{quizData.name}</Text>
      <Text style={styles.level}>Level: {lvl.name}</Text>

      <View style={styles.questionTimeInfoRow}>
        <Text style={styles.questionCount}>
          Question {currentQuestionIndex + 1} / {lvl.questions.length}
        </Text>
        <Text style={styles.timer}>⏱ {timer}s</Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.question}>{ques.question}</Text>

        {ques.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleOptionSelect(opt)}
            style={[
              styles.optionBtn,
              selectedOption === opt && styles.selectedOption,
            ]}
          >
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleNext}
        disabled={!selectedOption}
        style={[styles.nextBtn, !selectedOption && styles.disabledBtn]}
      >
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  testcontainer: {
    padding: 25,
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 760,
    borderRadius: 12,
    elevation: 6,
    marginHorizontal: "auto",
  },
  header: {
    fontSize: 32,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Lato_400Regular",
  },
  level: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.8,
    backgroundColor: "#fce4ec",
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionTimeInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  questionCount: {
    fontSize: 17,
    color: "#555",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
    backgroundColor: "#f1f2f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#a21caf",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 25,
    textAlign: "center",
    overflow: "hidden",
    letterSpacing: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  questionCard: {
    borderWidth: 1,
    padding: 25,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
  },
  optionBtn: {
    padding: 14,
    marginVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: "#d1ecf1",
    borderColor: "#a4d9e7",
  },
  nextBtn: {
    backgroundColor: "#28a745",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  disabledBtn: {
    backgroundColor: "#adb5bd",
    opacity: 0.6,
  },
});
