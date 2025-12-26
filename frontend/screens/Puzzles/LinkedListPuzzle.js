import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LinkedListPuzzle() {
  const correctOrder = ['A', 'B', 'C', 'D'];
  
  const shuffleArray = (arr) => {
    let shuffled = [...arr];
    do {
      shuffled.sort(() => Math.random() - 0.5);
    } while (JSON.stringify(shuffled) === JSON.stringify(correctOrder));
    return shuffled;
  };

  const [nodes, setNodes] = useState(shuffleArray(correctOrder));
  const [solved, setSolved] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [swaps, setSwaps] = useState(0);

  const checkSolution = (arr) => {
    return JSON.stringify(arr) === JSON.stringify(correctOrder);
  };

  const handleNodePress = (index) => {
    if (solved) return;
    
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex !== index) {
        // Swap nodes
        let newNodes = [...nodes];
        [newNodes[selectedIndex], newNodes[index]] = [newNodes[index], newNodes[selectedIndex]];
        setNodes(newNodes);
        setSwaps(swaps + 1);
        
        if (checkSolution(newNodes)) {
          setSolved(true);
          Alert.alert("🎉 Congratulations!", `You've correctly linked all nodes in ${swaps + 1} swaps!`);
        }
      }
      setSelectedIndex(null);
    }
  };

  const resetPuzzle = () => {
    setNodes(shuffleArray(correctOrder));
    setSolved(false);
    setSelectedIndex(null);
    setSwaps(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="link-variant" size={28} color="#a21caf" />
        </View>
        <Text style={styles.title}>Linked List Puzzle</Text>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="swap-horizontal" size={20} color="#a21caf" />
          <Text style={styles.statLabel}>Swaps</Text>
          <Text style={styles.statValue}>{swaps}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="link" size={20} color="#a21caf" />
          <Text style={styles.statLabel}>Nodes</Text>
          <Text style={styles.statValue}>{nodes.length}</Text>
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Ionicons name="information-circle" size={20} color="#a21caf" />
        <Text style={styles.instruction}>
          Arrange nodes in order: <Text style={styles.highlight}>A → B → C → D</Text>
        </Text>
      </View>

      {/* Goal Display */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalLabel}>Target Order:</Text>
        <View style={styles.goalNodes}>
          {correctOrder.map((letter, index) => (
            <View key={index} style={styles.goalNodeWrapper}>
              <View style={styles.goalNode}>
                <Text style={styles.goalNodeText}>{letter}</Text>
              </View>
              {index < correctOrder.length - 1 && (
                <Ionicons name="arrow-forward" size={16} color="#a21caf" style={styles.goalArrow} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Linked List Visualization */}
      <View style={styles.puzzleArea}>
        <Text style={styles.puzzleLabel}>Your Current Order:</Text>
        <View style={styles.linkedListContainer}>
          {nodes.map((node, index) => (
            <View key={index} style={styles.nodeWrapper}>
              <TouchableOpacity 
                style={[
                  styles.node,
                  selectedIndex === index && styles.nodeSelected,
                  solved && styles.nodeSolved
                ]}
                onPress={() => handleNodePress(index)}
                disabled={solved}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.nodeText,
                  selectedIndex === index && styles.nodeTextSelected,
                  solved && styles.nodeTextSolved
                ]}>{node}</Text>
                {selectedIndex === index && !solved && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>1</Text>
                  </View>
                )}
              </TouchableOpacity>
              {index < nodes.length - 1 && (
                <View style={styles.arrow}>
                  <Ionicons 
                    name="arrow-forward" 
                    size={28} 
                    color={solved ? "#10b981" : selectedIndex === index || selectedIndex === index + 1 ? "#a21caf" : "#d1d5db"} 
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Success Message */}
      {solved && (
        <View style={styles.successContainer}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={40} color="#FFD700" />
          </View>
          <Text style={styles.successTitle}>Perfect Link!</Text>
          <Text style={styles.successSubtitle}>
            Completed in {swaps} {swaps === 1 ? 'swap' : 'swaps'}
          </Text>
          <View style={styles.successPath}>
            {nodes.map((node, index) => (
              <View key={index} style={styles.successNodeWrapper}>
                <View style={styles.successNode}>
                  <Text style={styles.successNodeText}>{node}</Text>
                </View>
                {index < nodes.length - 1 && (
                  <Ionicons name="checkmark" size={16} color="#10b981" style={styles.successCheck} />
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetPuzzle}
        activeOpacity={0.8}
      >
        <Ionicons name={solved ? "play-circle" : "refresh-circle"} size={22} color="#FFFFFF" />
        <Text style={styles.resetButtonText}>{solved ? "New Puzzle" : "Reset"}</Text>
      </TouchableOpacity>

      {/* How to Play */}
      <View style={styles.howToPlayContainer}>
        <View style={styles.howToPlayHeader}>
          <Ionicons name="game-controller" size={18} color="#a21caf" />
          <Text style={styles.howToPlayTitle}>How to Play</Text>
        </View>
        <View style={styles.howToPlaySteps}>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Tap a node to select it (it will turn yellow)</Text>
          </View>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Tap another node to swap their positions</Text>
          </View>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Link all nodes correctly: A → B → C → D</Text>
          </View>
        </View>
      </View>

      {/* Principle Box */}
      <View style={styles.hintContainer}>
        <View style={styles.hintIcon}>
          <Ionicons name="book" size={18} color="#a21caf" />
        </View>
        <Text style={styles.hintText}>
          <Text style={styles.hintBold}>Linked List Principle:</Text> A linear data structure where elements (nodes) are connected via pointers. Each node contains data and a reference to the next node, enabling efficient insertion and deletion.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#fafaf9',
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
    shadowColor: '#a21caf',
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
    color: '#a21caf',
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
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    flex: 1,
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
    backgroundColor: '#a21caf',
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
  highlight: {
    fontWeight: '800',
    color: '#a21caf',
  },
  goalContainer: {
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
  goalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  goalNodes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalNodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fdf4ff',
    borderWidth: 2,
    borderColor: '#d8b4fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalNodeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#a21caf',
  },
  goalArrow: {
    marginHorizontal: 6,
  },
  puzzleArea: {
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
  puzzleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a21caf',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  linkedListContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  nodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  node: {
    backgroundColor: '#fdf4ff',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d8b4fe',
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    position: 'relative',
  },
  nodeSelected: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    transform: [{ scale: 1.1 }],
    shadowColor: '#f59e0b',
  },
  nodeSolved: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  nodeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#a21caf',
  },
  nodeTextSelected: {
    color: '#f59e0b',
  },
  nodeTextSolved: {
    color: '#10b981',
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  arrow: {
    marginHorizontal: 10,
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
  successPath: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  successNodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successNode: {
    backgroundColor: '#d1fae5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  successNodeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  successCheck: {
    marginHorizontal: 4,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a21caf',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    gap: 10,
  },
  hintIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fdf4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  hintBold: {
    fontWeight: '800',
    color: '#a21caf',
  },
});
