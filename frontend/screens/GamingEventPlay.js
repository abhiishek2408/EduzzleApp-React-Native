import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
  const basePerQTimerRef = useRef(0);
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
      if (res.data?.perQuestionTimerSec) {
        basePerQTimerRef.current = res.data.perQuestionTimerSec;
        setPerQTimer(basePerQTimerRef.current);
      } else {
        basePerQTimerRef.current = 0;
        setPerQTimer(0);
      }
      if (res.data?.totalTimerSec) setTotalTimer(res.data.totalTimerSec);
      totalStartRef.current = Date.now();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load questions");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [eventId]);

  useEffect(() => {
    if (!questions.length) return;
    // reset per-question timer using question.timeLimit if provided, else global base
    clearInterval(intervalRef.current);
    const current = questions[idx];
    const startVal = (current?.timeLimit ?? basePerQTimerRef.current) || 0;
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
    const existingIndex = answers.findIndex((a) => a.questionId === (q._id || q.questionBankId));
    const newAns = { questionId: q._id || q.questionBankId, selectedOption: option };
    if (existingIndex >= 0) {
      const copy = [...answers];
      copy[existingIndex] = newAns;
      setAnswers(copy);
    } else {
      setAnswers((prev) => [...prev, newAns]);
    }
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
      const res = await axios.post(`${API_BASE}/gaming-events/${eventId}/submit`, {
        userId: user._id,
        answers,
        durationSec,
      });
      Alert.alert("Submitted", `Score: ${res.data?.score ?? 0}`);
      navigation.goBack();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      if (status === 409) {
        // Already submitted/completed — handle gracefully
        Alert.alert("Already submitted", msg || "You have already completed this event.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else if (status === 403) {
        Alert.alert("Event not live", msg || "This event isn't currently live.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        console.error(e);
        Alert.alert("Error", msg || "Failed to submit");
      }
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  if (loading) return <ActivityIndicator color={THEME} style={{ marginTop: 16 }} />;
  if (!questions.length) return <View style={styles.container}><Text style={{ padding: 16 }}>No questions available.</Text></View>;

  const q = questions[idx];
  const currentAnswer = answers.find((a) => a.questionId === (q._id || q.questionBankId));
  const selectedOption = currentAnswer?.selectedOption;

  return (
    <View style={styles.container}>
      <View style={styles.timersRow}>
        {totalTimer > 0 && <Text style={styles.timer}>Total: {formatHMS(totalTimer)}</Text>}
        {perQTimer > 0 && <Text style={styles.timer}>Q: {perQTimer}s</Text>}
      </View>
      <View style={styles.card}>
        <Text style={styles.qText}>{q.text || q.question}</Text>
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
  option: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: "#ede9fe" },
  optionSelected: { borderColor: THEME, borderWidth: 2, backgroundColor: "#faf5ff" },
  optionText: { color: "#1f2937", fontWeight: "600" },
  optionTextSelected: { color: THEME, fontWeight: "800" },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12 },
  progress: { color: "#6b7280", fontWeight: "700" },
  nextBtn: { backgroundColor: THEME, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
});
