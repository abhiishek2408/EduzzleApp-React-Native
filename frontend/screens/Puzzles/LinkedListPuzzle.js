import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LinkedListPuzzle() {
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
}

const styles = StyleSheet.create({
  instruction: { fontSize: 17, marginBottom: 30, textAlign: 'center', color: '#4A148C' },
  highlight: { fontWeight: 'bold', color: '#9C27B0' },
  blockContainer: { width: '100%', alignItems: 'center' },
  block: { backgroundColor: '#E1BEE7', width: '100%', height: 60, padding: 3, marginVertical: 8, borderRadius: 15, flexDirection: 'row', alignItems: 'center', paddingLeft: 20 },
  blockText: { fontSize: 22, fontWeight: '700', color: '#4A148C' },
  playAgainButton: { backgroundColor: '#9C27B0', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 15 },
  playAgainText: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
