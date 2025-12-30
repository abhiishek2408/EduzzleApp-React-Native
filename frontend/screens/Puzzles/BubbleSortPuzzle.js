import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Animated, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [swaps, setSwaps] = useState(0);

  const isSorted = (arr) => arr.every((v, i, a) => i === 0 || a[i - 1] <= v);

  const swap = (index) => {
    if (index < array.length - 1) {
      let newArray = [...array];
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
      setArray(newArray);
      setSwaps(swaps + 1);
      if (isSorted(newArray)) {
        setSorted(true);
        Alert.alert("🎉 Puzzle Solved!", `You've successfully sorted the array in ${swaps + 1} swaps!`);
      }
    }
  };

  const resetGame = () => {
    setArray(generateRandomArray());
    setSorted(false);
    setSwaps(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="sort-ascending" size={28} color="#4a044e" />
        </View>
        <Text style={styles.title}>Bubble Sort Puzzle</Text>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="swap-horizontal" size={20} color="#4a044e" />
          <Text style={styles.statLabel}>Swaps</Text>
          <Text style={styles.statValue}>{swaps}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="analytics" size={20} color="#4a044e" />
          <Text style={styles.statLabel}>Numbers</Text>
          <Text style={styles.statValue}>{array.length}</Text>
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Ionicons name="information-circle" size={20} color="#4a044e" />
        <Text style={styles.instruction}>
          Tap <Ionicons name="swap-vertical" size={16} color="#4a044e" /> to swap adjacent numbers
        </Text>
      </View>

      {/* Sorting Area */}
      <View style={styles.sortingArea}>
        <Text style={styles.goalText}>Goal: Sort in ascending order</Text>
        <View style={styles.blockContainer}>
          {array.map((num, index) => (
            <View key={index} style={styles.blockWrapper}>
              <View style={[styles.block, sorted && styles.blockSorted]}>
                <View style={styles.numberCircle}>
                  <Text style={[styles.blockText, sorted && styles.blockTextSorted]}>{num}</Text>
                </View>
                {index < array.length - 1 && (
                  <TouchableOpacity 
                    style={[styles.swapButton, sorted && styles.swapButtonDisabled]} 
                    onPress={() => swap(index)} 
                    disabled={sorted}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="swap-vertical" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              {index < array.length - 1 && !sorted && (
                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-down" size={16} color="#d8b4fe" />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Success Message */}
      {sorted && (
        <View style={styles.successContainer}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={40} color="#FFD700" />
          </View>
          <Text style={styles.successTitle}>Perfect Sort!</Text>
          <Text style={styles.successSubtitle}>
            Completed in {swaps} {swaps === 1 ? 'swap' : 'swaps'}
          </Text>
          <View style={styles.sortedArray}>
            {array.map((num, index) => (
              <View key={index} style={styles.sortedNumberBadge}>
                <Text style={styles.sortedNumberText}>{num}</Text>
                {index < array.length - 1 && (
                  <Ionicons name="chevron-forward" size={16} color="#10b981" style={styles.sortedArrow} />
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controlButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetGame}
          activeOpacity={0.8}
        >
          <Ionicons name={sorted ? "play" : "refresh"} size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{sorted ? "New Puzzle" : "Reset"}</Text>
        </TouchableOpacity>
      </View>

      {/* How to Play */}
      <View style={styles.howToPlayContainer}>
        <View style={styles.howToPlayHeader}>
          <Ionicons name="game-controller" size={18} color="#4a044e" />
          <Text style={styles.howToPlayTitle}>How to Play</Text>
        </View>
        <View style={styles.howToPlaySteps}>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Tap the swap button between numbers to exchange them</Text>
          </View>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Arrange numbers in ascending order (smallest to largest)</Text>
          </View>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Complete the puzzle in minimum swaps for the best score!</Text>
          </View>
        </View>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="book" size={18} color="#4a044e" />
        </View>
        <Text style={styles.infoText}>
          <Text style={styles.infoBold}>Bubble Sort Principle:</Text> Repeatedly compare adjacent elements and swap them if they are in wrong order. The largest element "bubbles up" to its correct position in each pass.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fdf4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4a044e',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fdf4ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  instruction: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  howToPlayContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  howToPlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  howToPlayTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
  },
  howToPlaySteps: {
    gap: 10,
  },
  howToPlayStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4a044e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
    paddingTop: 2,
  },
  sortingArea: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  goalText: {
    fontSize: 14,
    color: '#4a044e',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  blockContainer: {
    width: '100%',
    alignItems: 'center',
  },
  blockWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  block: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 80,
    marginVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  blockSorted: {
    backgroundColor: '#d1fae5',
  },
  numberCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fdf4ff',
    borderWidth: 3,
    borderColor: '#4a044e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  blockText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4a044e',
  },
  blockTextSorted: {
    color: '#10b981',
  },
  swapButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4a044e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  swapButtonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0,
  },
  arrowContainer: {
    marginVertical: 2,
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fffbeb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#fde68a',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 16,
  },
  sortedArray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortedNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  sortedNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  sortedArrow: {
    marginLeft: 4,
  },
  controlButtons: {
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  resetButton: {
    backgroundColor: '#4a044e',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    gap: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fdf4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '800',
    color: '#4a044e',
  },
});