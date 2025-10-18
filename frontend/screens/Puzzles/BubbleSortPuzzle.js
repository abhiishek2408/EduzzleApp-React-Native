import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed

export default function BubbleSortPuzzle() {
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
        Alert.alert("Puzzle Solved!", "You've successfully sorted the array!");
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
        Tap the <Text style={styles.highlight}><Ionicons name="chevron-down" size={18} /></Text> to swap numbers and sort them!
      </Text>
      <View style={styles.blockContainer}>
        {array.map((num, index) => (
          <View key={index} style={[styles.block, sorted && styles.blockSorted]}>
            <Text style={styles.blockText}>{num}</Text>
            {index < array.length - 1 && (
              <TouchableOpacity style={styles.swapButton} onPress={() => swap(index)} disabled={sorted}>
                <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {sorted && (
        <View style={styles.sortedMessageContainer}>
          <Text style={styles.success}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" /> Awesome! You did it!
          </Text>
          <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
            <Ionicons name="refresh" size={22} color="#FFFFFF" /> 
            <Text style={styles.playAgainText}> Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  instruction: { fontSize: 17, marginBottom: 30, textAlign: 'center', color: '#4A148C' },
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
  sortedMessageContainer: { alignItems: 'center', marginTop: 15, padding: 20, backgroundColor: '#F3E5F5', borderRadius: 15 },
  success: { fontSize: 20, color: '#6A1B9A', fontWeight: '700', marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  playAgainButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9C27B0', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 15 },
  playAgainText: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
