import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BinaryTreePuzzle() {
  // Binary Tree structure: Each node has value, left, right
  const initialTree = {
    value: 50,
    left: { value: 30, left: { value: 20 }, right: { value: 40 } },
    right: { value: 70, left: { value: 60 }, right: { value: 80 } }
  };

  const [currentNode, setCurrentNode] = useState(50);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [traversalType, setTraversalType] = useState(null);
  const [completed, setCompleted] = useState(false);

  const correctTraversals = {
    inorder: [20, 30, 40, 50, 60, 70, 80],
    preorder: [50, 30, 20, 40, 70, 60, 80],
    postorder: [20, 40, 30, 60, 80, 70, 50]
  };

  const getNodeByValue = (tree, value) => {
    if (!tree) return null;
    if (tree.value === value) return tree;
    return getNodeByValue(tree.left, value) || getNodeByValue(tree.right, value);
  };

  const startTraversal = (type) => {
    setTraversalType(type);
    setVisitedNodes([]);
    setCurrentNode(50);
    setCompleted(false);
  };

  const visitNode = (value) => {
    if (completed) return;

    const newVisited = [...visitedNodes, value];
    setVisitedNodes(newVisited);

    // Check if traversal is complete
    if (newVisited.length === 7) {
      const isCorrect = JSON.stringify(newVisited) === JSON.stringify(correctTraversals[traversalType]);
      if (isCorrect) {
        setCompleted(true);
        Alert.alert('🎉 Perfect!', `You've successfully completed ${traversalType.toUpperCase()} traversal!`);
      } else {
        Alert.alert('❌ Incorrect', `This is not the correct ${traversalType.toUpperCase()} order. Try again!`, [
          { text: 'Restart', onPress: () => startTraversal(traversalType) }
        ]);
      }
    }
  };

  const resetPuzzle = () => {
    setTraversalType(null);
    setVisitedNodes([]);
    setCurrentNode(50);
    setCompleted(false);
  };

  const renderNode = (value, position = 'root') => {
    const isVisited = visitedNodes.includes(value);
    const visitOrder = visitedNodes.indexOf(value) + 1;

    return (
      <TouchableOpacity
        style={[
          styles.treeNode,
          isVisited && styles.treeNodeVisited,
          position === 'root' && styles.treeNodeRoot,
          !traversalType && styles.treeNodeDisabled
        ]}
        onPress={() => traversalType && !completed && visitNode(value)}
        disabled={!traversalType || completed}
      >
        <Text style={[styles.treeNodeText, isVisited && styles.treeNodeTextVisited]}>
          {value}
        </Text>
        {isVisited && (
          <View style={styles.orderBadge}>
            <Text style={styles.orderBadgeText}>{visitOrder}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="git-network" size={32} color="#a21caf" />
        <Text style={styles.title}>Binary Tree Traversal</Text>
      </View>

      <Text style={styles.instruction}>
        Learn tree traversal by visiting nodes in the correct order
      </Text>

      {/* Traversal Type Selection */}
      {!traversalType ? (
        <View style={styles.traversalSelection}>
          <Text style={styles.selectionTitle}>Choose Traversal Type:</Text>
          
          <TouchableOpacity
            style={[styles.traversalButton, styles.inorderButton]}
            onPress={() => startTraversal('inorder')}
          >
            <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
            <View style={styles.traversalButtonContent}>
              <Text style={styles.traversalButtonTitle}>In-Order</Text>
              <Text style={styles.traversalButtonSubtitle}>Left → Root → Right</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.traversalButton, styles.preorderButton]}
            onPress={() => startTraversal('preorder')}
          >
            <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
            <View style={styles.traversalButtonContent}>
              <Text style={styles.traversalButtonTitle}>Pre-Order</Text>
              <Text style={styles.traversalButtonSubtitle}>Root → Left → Right</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.traversalButton, styles.postorderButton]}
            onPress={() => startTraversal('postorder')}
          >
            <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
            <View style={styles.traversalButtonContent}>
              <Text style={styles.traversalButtonTitle}>Post-Order</Text>
              <Text style={styles.traversalButtonSubtitle}>Left → Right → Root</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Current Traversal Info */}
          <View style={styles.traversalInfo}>
            <Text style={styles.traversalInfoTitle}>
              {traversalType.toUpperCase()} Traversal
            </Text>
            <Text style={styles.traversalInfoSubtitle}>
              Tap nodes in the correct order
            </Text>
          </View>

          {/* Binary Tree Visualization */}
          <View style={styles.treeContainer}>
            {/* Root Level */}
            <View style={styles.treeLevel}>
              {renderNode(50, 'root')}
            </View>

            {/* Level 1 */}
            <View style={styles.treeLevel}>
              <View style={styles.treeBranch}>
                {renderNode(30)}
                <View style={styles.connector} />
              </View>
              <View style={styles.treeBranch}>
                <View style={styles.connector} />
                {renderNode(70)}
              </View>
            </View>

            {/* Level 2 */}
            <View style={styles.treeLevel}>
              {renderNode(20)}
              {renderNode(40)}
              {renderNode(60)}
              {renderNode(80)}
            </View>
          </View>

          {/* Visited Sequence */}
          <View style={styles.sequenceContainer}>
            <Text style={styles.sequenceLabel}>Your Path:</Text>
            <View style={styles.sequenceList}>
              {visitedNodes.length === 0 ? (
                <Text style={styles.sequenceEmpty}>Start by tapping a node</Text>
              ) : (
                visitedNodes.map((value, index) => (
                  <View key={index} style={styles.sequenceItem}>
                    <Text style={styles.sequenceItemText}>{value}</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Success Message */}
          {completed && (
            <View style={styles.successContainer}>
              <Ionicons name="trophy" size={48} color="#a21caf" />
              <Text style={styles.successText}>
                Perfect {traversalType.toUpperCase()} Traversal!
              </Text>
              <Text style={styles.successSubtext}>
                [{visitedNodes.join(', ')}]
              </Text>
            </View>
          )}

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, styles.restartButton]}
              onPress={() => startTraversal(traversalType)}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Restart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.backButton]}
              onPress={resetPuzzle}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Principle Box */}
      <View style={styles.infoBox}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="book" size={18} color="#a21caf" />
        </View>
        <Text style={styles.infoText}>
          <Text style={styles.infoBold}>Tree Traversal Principles:</Text> Inorder (Left-Root-Right) gives sorted order in BST. Preorder (Root-Left-Right) is used for tree copying. Postorder (Left-Right-Root) is used for tree deletion.
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
    backgroundColor: '#fae8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  instruction: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 22,
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
  traversalSelection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  traversalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  inorderButton: {
    backgroundColor: '#3B82F6',
  },
  preorderButton: {
    backgroundColor: '#10B981',
  },
  postorderButton: {
    backgroundColor: '#F59E0B',
  },
  traversalButtonContent: {
    flex: 1,
  },
  traversalButtonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  traversalButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  traversalInfo: {
    backgroundColor: '#fdf4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#a21caf',
  },
  traversalInfoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#a21caf',
    marginBottom: 4,
    textAlign: 'center',
  },
  traversalInfoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  treeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  treeLevel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
  },
  treeBranch: {
    alignItems: 'center',
  },
  connector: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  treeNode: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fdf4ff',
    borderWidth: 3,
    borderColor: '#a21caf',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  treeNodeRoot: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  treeNodeVisited: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  treeNodeDisabled: {
    opacity: 0.5,
  },
  treeNodeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#a21caf',
  },
  treeNodeTextVisited: {
    color: '#10B981',
  },
  orderBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sequenceContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sequenceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  sequenceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sequenceEmpty: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  sequenceItem: {
    backgroundColor: '#fae8ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#a21caf',
  },
  sequenceItemText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#a21caf',
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fdf4ff',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#a21caf',
  },
  successText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#a21caf',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  restartButton: {
    backgroundColor: '#a21caf',
  },
  backButton: {
    backgroundColor: '#6B7280',
  },
  controlButtonText: {
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
    color: '#a21caf',
  },
});
