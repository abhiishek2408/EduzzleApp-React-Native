import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Toast from "react-native-toast-message";

const API_BASE = "https://eduzzleapp-react-native.onrender.com/api";
const THEME = "#4a044e";

export default function GamingEventPlay({ route, navigation }) {
  const { eventId } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [perQTimer, setPerQTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const totalStartRef = useRef(null);
  const intervalRef = useRef(null);
  const submittingRef = useRef(false);

  const formatHMS = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/gaming-events/${eventId}/questions`);
      setQuestions(res.data?.questions || []);
      setPerQTimer(0);
      if (res.data?.totalTimerSec) setTotalTimer(res.data.totalTimerSec);
      totalStartRef.current = Date.now();
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Failed to load questions",
        position: "bottom",
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [eventId]);

  useEffect(() => {
    if (!questions.length) return;
    // reset per-question timer using question.timeLimit
    clearInterval(intervalRef.current);
    const current = questions[idx];
    const startVal = current?.timeLimit || 0;
    setPerQTimer(startVal);
    if (startVal > 0) {
      let t = startVal;
      intervalRef.current = setInterval(() => {
        t -= 1;
        setPerQTimer(t);
        if (t <= 0) {
          clearInterval(intervalRef.current);
          onNext();
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [idx, questions]);

  useEffect(() => {
    if (totalTimer > 0) {
      const id = setInterval(() => {
        setTotalTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            submitNow();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [totalTimer]);

  const onSelect = (option) => {
    const q = questions[idx];
    const qIndex = q.questionIndex ?? idx;
    const newAns = { questionIndex: qIndex, selectedOption: option };
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => Number(a.questionIndex) === Number(qIndex));
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = newAns;
        return copy;
      }
      return [...prev, newAns];
    });
  };

  const onNext = () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
    } else {
      submitNow();
    }
  };

  const submitNow = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const durationSec = Math.floor((Date.now() - totalStartRef.current) / 1000);
      const answerMap = new Map();
      (answers || []).forEach((a) => answerMap.set(Number(a.questionIndex), a.selectedOption));
      const finalAnswers = (questions || []).map((q, index) => {
        const qIndex = q.questionIndex ?? index;
        return { questionIndex: qIndex, selectedOption: answerMap.get(qIndex) ?? null };
      });

      const res = await axios.post(`${API_BASE}/gaming-events/${eventId}/submit`, {
        userId: user._id,
        answers: finalAnswers,
        durationSec,
      });
      Toast.show({
        type: "success",
        text1: "Quiz submitted",
        position: "bottom",
      });
      navigation.goBack();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      if (status === 409) {
        // Already submitted/completed — handle silently
        Toast.show({
          type: "info",
          text1: "Already submitted",
          position: "bottom",
        });
        navigation.goBack();
      } else if (status === 403) {
        Toast.show({
          type: "info",
          text1: msg || "Event not live",
          position: "bottom",
        });
        navigation.goBack();
      } else {
        console.error(e);
        Toast.show({
          type: "error",
          text1: msg || "Failed to submit",
          position: "bottom",
        });
      }
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  if (loading) return <ActivityIndicator color={THEME} style={{ marginTop: 16 }} />;
  if (!questions.length) return <View style={styles.container}><Text style={{ padding: 16 }}>No questions available.</Text></View>;

  const q = questions[idx];
  const currentAnswer = answers.find((a) => Number(a.questionIndex) === Number(q.questionIndex ?? idx));
  const selectedOption = currentAnswer?.selectedOption;

  return (
    <View style={styles.container}>
      <View style={styles.timersRow}>
        {totalTimer > 0 && <Text style={styles.timer}>Total: {formatHMS(totalTimer)}</Text>}
        {perQTimer > 0 && <Text style={styles.timer}>Q: {perQTimer}s</Text>}
      </View>
      <View style={styles.card}>
        <Text style={styles.qText}>{q.question || q.text}</Text>
        {!!q.text && q.text !== q.question && (
          <Text style={styles.qSubText}>{q.text}</Text>
        )}
        {(q.options || []).map((op, i) => {
          const isSelected = selectedOption === op;
          return (
            <TouchableOpacity 
              key={i} 
              style={[
                styles.option, 
                isSelected && styles.optionSelected
              ]} 
              onPress={() => onSelect(op)}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{op}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.progress}>Question {idx + 1} / {questions.length}</Text>
        <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>{idx === questions.length - 1 ? "Submit" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff",marginTop: 16 },
  timersRow: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  timer: { color: THEME, fontWeight: "800" },
  card: { backgroundColor: "#faf5ff", margin: 12, padding: 16, borderRadius: 14 },
  qText: { fontSize: 18, fontWeight: "800", color: "#2d0c57", marginBottom: 12 },
  qSubText: { fontSize: 13, fontWeight: "600", color: "#6b7280", marginBottom: 10 },
  option: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: "#ede9fe" },
  optionSelected: { borderColor: THEME, borderWidth: 2, backgroundColor: "#faf5ff" },
  optionText: { color: "#1f2937", fontWeight: "600" },
  optionTextSelected: { color: THEME, fontWeight: "800" },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12 },
  progress: { color: "#6b7280", fontWeight: "700" },
  nextBtn: { backgroundColor: THEME, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
});
