import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

// Added an 'icon' for better visual distinction
const gamesList = [
  { id: 1, name: 'Bubble Sort Puzzle', icon: '🔢' },
  { id: 2, name: 'Linked List Puzzle', icon: '🔗' },
  { id: 3, name: 'Stack Quiz', icon: '📦' },
];

// ------------------ Inner Components (No change needed) ------------------ //

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
        <Text style={{ marginTop: 20, fontSize: 20, color: '#6A1B9A', textAlign: 'center' }}>🎉 Stack operations complete!</Text>
      )}
    </>
  );
};

// ------------------ Main Screen ------------------ //

export default function PlayScreen() {
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGame = () => {
    if (!selectedGame) return null;
    if (selectedGame.id === 1) return <BubbleSortPuzzle />;
    if (selectedGame.id === 2) return <LinkedListPuzzle />;
    if (selectedGame.id === 3) return <StackQuiz />;
  };

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

      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
        {/* Game Cards - Decreased Height */}
        {!selectedGame &&
          gamesList.map((game) => (
            <TouchableOpacity key={game.id} style={styles.card} onPress={() => setSelectedGame(game)}>
              <Text style={styles.cardIcon}>{game.icon}</Text> 
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{game.name}</Text>
                <Text style={styles.cardSubtitle}>Start your {game.name.split(' ')[0]} challenge!</Text>
              </View>
              <Text style={styles.cardArrow}>▶</Text>
            </TouchableOpacity>
          ))}

        {/* Selected Game */}
        {selectedGame && (
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.title}>{selectedGame.name}</Text>
              {renderGame()}
            </ScrollView>

            {/* Back Button at Bottom */}
            <TouchableOpacity style={styles.backButtonBottom} onPress={() => setSelectedGame(null)}>
              <Text style={styles.backButtonText}>⬅ Back to Games</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ------------------ Styles ------------------ //
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  title: {
    fontSize: 28,
    fontWeight: '700', 
    marginBottom: 20,
    color: '#4A148C', 
    textAlign: 'center',
  },
  instruction: { 
    fontSize: 17, 
    marginBottom: 30, 
    textAlign: 'center', 
    color: '#4A148C', 
  },
  highlight: { fontWeight: 'bold', color: '#9C27B0' },
  
  // --- Redesigned Card Styles (Decreased Height) ---
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', 
    paddingVertical: 15, // Reduced vertical padding from 20 to 15
    paddingHorizontal: 20, // Kept horizontal padding
    borderRadius: 20, 
    marginVertical: 8, // Reduced vertical margin from 10 to 8
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    shadowColor: '#6A1B9A',
    shadowOpacity: 0.25, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6, 
  },
  cardIcon: {
    fontSize: 28, // Reduced icon size from 32 to 28
    marginRight: 15,
    padding: 8, // Reduced icon padding from 10 to 8
    backgroundColor: '#F3E5F5', 
    borderRadius: 10, // Reduced border radius
  },
  cardContent: {
    flex: 1, 
    marginRight: 10,
  },
  cardText: { 
    fontSize: 18, // Reduced title font size from 20 to 18
    fontWeight: '800', 
    color: '#4A148C', 
    marginBottom: 2, // Reduced bottom margin
  },
  cardSubtitle: {
    fontSize: 13, // Reduced subtitle font size from 14 to 13
    color: '#6A1B9A', 
    fontWeight: '500',
  },
  cardArrow: {
    fontSize: 18, // Reduced arrow size from 20 to 18
    color: '#9C27B0',
    marginLeft: 10,
  },
  // ----------------------------------------------------

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
  playAgainText: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
  backButtonBottom: {
    backgroundColor: '#ffffffff',
    padding: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 10,
    marginBottom:150,
    width: '60%', 
    alignItems: 'center',
  },
  backButtonText: { color: '#9C27B0', fontWeight: '700', fontSize: 16 },
});