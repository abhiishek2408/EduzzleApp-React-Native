import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StackQuiz() {
  const questions = [
    { question: 'Push 5 onto stack', action: 'push', value: 5 },
    { question: 'Push 3 onto stack', action: 'push', value: 3 },
    { question: 'Pop top value', action: 'pop' },
  ];
  const [stack, setStack] = useState([]);
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step >= questions.length) return;
    const q = questions[step];
    let newStack = [...stack];
    if (q.action === 'push') newStack.push(q.value);
    else if (q.action === 'pop') newStack.pop();
    setStack(newStack);
    setStep(step + 1);
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={styles.instruction}>Follow the stack operations step by step:</Text>
      <View style={styles.blockContainer}>
        {stack.map((item, index) => (
          <View key={index} style={styles.block}>
            <Text style={styles.blockText}>{item}</Text>
          </View>
        ))}
      </View>
      {step < questions.length ? (
        <TouchableOpacity style={styles.playAgainButton} onPress={handleNext}>
          <Text style={styles.playAgainText}>{questions[step].question}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.completedText}>🎉 Stack operations complete!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  instruction: { fontSize: 17, marginBottom: 30, textAlign: 'center', color: '#4A148C' },
  blockContainer: { width: '100%', alignItems: 'center' },
  block: { backgroundColor: '#E1BEE7', width: '100%', height: 60, padding: 3, marginVertical: 8, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingLeft: 20 },
  blockText: { fontSize: 22, fontWeight: '700', color: '#4A148C' },
  playAgainButton: { backgroundColor: '#9C27B0', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 15, alignSelf: 'center' },
  playAgainText: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
  completedText: { marginTop: 20, fontSize: 20, color: '#6A1B9A', textAlign: 'center' },
});
