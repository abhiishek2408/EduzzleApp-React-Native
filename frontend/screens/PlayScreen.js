import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const gamesList = [
  { id: 1, name: 'Bubble Sort Puzzle' },
  { id: 2, name: 'Linked List Puzzle' },
  { id: 3, name: 'Stack Quiz' },
];

// ------------------ Inner Components ------------------ //

// 1️⃣ Bubble Sort Puzzle
const BubbleSortPuzzle = () => {
  const generateRandomArray = () => {
    const arr = [];
    while (arr.length < 4) {
      const num = Math.floor(Math.random() * 9) + 1;
      if (!arr.includes(num)) arr.push(num);
    }
    return arr;
  };

  const [array, setArray] = useState(generateRandomArray());
  const [sorted, setSorted] = useState(false);

  const isSorted = (arr) => arr.every((v, i, a) => i === 0 || a[i - 1] <= v);

  const swap = (index) => {
    if (index < array.length - 1) {
      let newArray = [...array];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      setArray(newArray);
      if (isSorted(newArray)) {
        setSorted(true);
        Alert.alert("🎉 Puzzle Solved!", "You've successfully sorted the array!");
      }
    }
  };

  const resetGame = () => {
    setArray(generateRandomArray());
    setSorted(false);
  };

  return (
    <>
      <Text style={styles.instruction}>
        Tap the <Text style={styles.highlight}>🔽 arrow</Text> to swap numbers and sort them!
      </Text>
      <View style={styles.blockContainer}>
        {array.map((num, index) => (
          <View key={index} style={[styles.block, sorted && styles.blockSorted]}>
            <Text style={styles.blockText}>{num}</Text>
            {index < array.length - 1 && (
              <TouchableOpacity style={styles.swapButton} onPress={() => swap(index)} disabled={sorted}>
                <Text style={styles.swapText}>🔽</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {sorted && (
        <View style={styles.sortedMessageContainer}>
          <Text style={styles.success}>✅ Awesome! You did it!</Text>
          <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
            <Text style={styles.playAgainText}>🔁 Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

// 2️⃣ Linked List Puzzle (simple interactive visualization)
const LinkedListPuzzle = () => {
  const initialNodes = ['A', 'B', 'C', 'D'];
  const [nodes, setNodes] = useState(initialNodes);

  const shuffleNodes = () => {
    let shuffled = [...nodes].sort(() => Math.random() - 0.5);
    setNodes(shuffled);
  };

  return (
    <>
      <Text style={styles.instruction}>
        Arrange nodes in correct order: <Text style={styles.highlight}>A → B → C → D</Text>
      </Text>
      <View style={styles.blockContainer}>
        {nodes.map((node, index) => (
          <View key={index} style={styles.block}>
            <Text style={styles.blockText}>{node}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.playAgainButton} onPress={shuffleNodes}>
        <Text style={styles.playAgainText}>🔀 Shuffle Nodes</Text>
      </TouchableOpacity>
    </>
  );
};

// 3️⃣ Stack Quiz
const StackQuiz = () => {
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
    <>
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
        <Text style={{ marginTop: 20, fontSize: 20, color: '#6A1B9A' }}>🎉 Stack operations complete!</Text>
      )}
    </>
  );
};

// ------------------ Main Screen ------------------ //
export default function PlayScreen() {
  const [selectedGame, setSelectedGame] = useState(gamesList[0]);

  const selectGame = (game) => setSelectedGame(game);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Background SVG */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#f9f3fbff" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#a52096ff" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#backgroundGradient)" />
          <Circle cx="15%" cy="10%" r="35" fill="#F3E5F5" fillOpacity="0.6" />
          <Circle cx="85%" cy="25%" r="45" fill="#a111b7ff" fillOpacity="0.4" />
          <Circle cx="40%" cy="45%" r="30" fill="#F3E5F5" fillOpacity="0.5" />
          <Circle cx="20%" cy="70%" r="50" fill="#a111b7ff" fillOpacity="0.3" />
          <Circle cx="70%" cy="80%" r="28" fill="#F3E5F5" fillOpacity="0.7" />
          <Circle cx="5%" cy="95%" r="40" fill="#a111b7ff" fillOpacity="0.45" />
        </Svg>
      </View>

      {/* Sidebar */}
      <View style={styles.sidebar}>
        <ScrollView>
          {gamesList.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[
                styles.sidebarItem,
                selectedGame.id === game.id && styles.sidebarItemActive
              ]}
              onPress={() => selectGame(game)}
            >
              <Text style={styles.sidebarText}>{game.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{selectedGame.name}</Text>
        {selectedGame.id === 1 && <BubbleSortPuzzle />}
        {selectedGame.id === 2 && <LinkedListPuzzle />}
        {selectedGame.id === 3 && <StackQuiz />}
      </View>
    </View>
  );
}

// ------------------ Styles ------------------ //
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#ffffff' },
  sidebar: {
    width: 180,
    backgroundColor: '#fde8ff',
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  sidebarItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff8fc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sidebarItemActive: {
    backgroundColor: '#a21caf',
  },
  sidebarText: {
    color: '#4c1d95',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 20,
    color: '#614a4aff',
  },
  instruction: { fontSize: 17, marginBottom: 30, textAlign: 'center', color: '#fff' },
  highlight: { fontWeight: 'bold', color: '#9C27B0' },
  blockContainer: { width: '100%', alignItems: 'center' },
  block: {
    backgroundColor: '#E1BEE7',
    width: '100%',
    height: 60,
    padding: 3,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
  },
  blockSorted: { backgroundColor: '#C8E6C9', borderColor: '#4CAF50', borderWidth: 1, paddingLeft: 60 },
  blockText: { fontSize: 22, fontWeight: '700', color: '#4A148C' },
  swapButton: { padding: 4, backgroundColor: '#BA68C8', borderRadius: 8 },
  swapText: { fontSize: 22, color: '#FFFFFF' },
  sortedMessageContainer: {
    alignItems: 'center',
    marginTop: 15,
    padding: 20,
    backgroundColor: '#F3E5F5',
    borderRadius: 15,
  },
  success: { fontSize: 20, color: '#6A1B9A', fontWeight: '700', marginBottom: 15 },
  playAgainButton: { backgroundColor: '#9C27B0', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 15 },
  playAgainText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
