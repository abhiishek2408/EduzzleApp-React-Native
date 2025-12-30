import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function StackQuiz() {
  const operations = [
    { id: 1, action: 'push', value: 8, description: 'Push 8' },
    { id: 2, action: 'push', value: 3, description: 'Push 3' },
    { id: 3, action: 'push', value: 12, description: 'Push 12' },
    { id: 4, action: 'pop', description: 'Pop' },
    { id: 5, action: 'push', value: 5, description: 'Push 5' },
    { id: 6, action: 'pop', description: 'Pop' },
  ];

  const [stack, setStack] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [completed, setCompleted] = useState(false);

  const executeOperation = () => {
    if (currentStep >= operations.length) return;

    const operation = operations[currentStep];
    let newStack = [...stack];
    let poppedValue = null;

    if (operation.action === 'push') {
      newStack.push(operation.value);
    } else if (operation.action === 'pop') {
      if (newStack.length > 0) {
        poppedValue = newStack.pop();
      }
    }

    setStack(newStack);
    setHistory([...history, { 
      step: currentStep + 1, 
      operation: operation.description, 
      result: poppedValue !== null ? `Popped: ${poppedValue}` : `Stack: [${newStack.join(', ')}]`,
      isManual: false
    }]);
    
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (nextStep >= operations.length) {
      setCompleted(true);
      Alert.alert("🎉 Completed!", `All stack operations finished!\nFinal Stack: [${newStack.join(', ')}]`);
    }
  };

  const manualPop = () => {
    if (stack.length === 0) return;

    let newStack = [...stack];
    const poppedValue = newStack.pop();
    
    setStack(newStack);
    setHistory([...history, { 
      step: history.length + 1, 
      operation: 'Manual Pop', 
      result: `Popped: ${poppedValue}`,
      isManual: true
    }]);
    
    Alert.alert("Popped!", `Value ${poppedValue} removed from stack`);
  };

  const resetQuiz = () => {
    setStack([]);
    setCurrentStep(0);
    setHistory([]);
    setCompleted(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="layers-triple" size={28} color="#4a044e" />
        </View>
        <Text style={styles.title}>Stack Operations</Text>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="list" size={20} color="#4a044e" />
          <Text style={styles.statLabel}>Items</Text>
          <Text style={styles.statValue}>{stack.length}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="footsteps" size={20} color="#4a044e" />
          <Text style={styles.statLabel}>Step</Text>
          <Text style={styles.statValue}>{currentStep}/{operations.length}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="time" size={20} color="#4a044e" />
          <Text style={styles.statLabel}>Operations</Text>
          <Text style={styles.statValue}>{history.length}</Text>
        </View>
      </View>

      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Ionicons name="bulb" size={18} color="#4a044e" />
        <Text style={styles.instruction}>
          Watch LIFO in action: Last In, First Out
        </Text>
      </View>

      {/* Stack Visualization */}
      <View style={styles.stackContainer}>
        <View style={styles.stackHeader}>
          <View style={styles.stackLabel}>
            <MaterialCommunityIcons name="stack-overflow" size={22} color="#4a044e" />
            <Text style={styles.stackLabelText}>Stack State</Text>
          </View>
          {stack.length > 0 && (
            <View style={styles.stackSize}>
              <Text style={styles.stackSizeText}>Size: {stack.length}</Text>
            </View>
          )}
        </View>
        <View style={styles.stackItems}>
          {stack.length === 0 ? (
            <View style={styles.emptyStack}>
              <MaterialCommunityIcons name="inbox" size={48} color="#d1d5db" />
              <Text style={styles.emptyStackText}>Empty Stack</Text>
              <Text style={styles.emptyStackHint}>Push items to begin</Text>
            </View>
          ) : (
            [...stack].reverse().map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.stackBlock,
                  index === 0 && styles.stackBlockTop
                ]}
              >
                <View style={styles.stackBlockContent}>
                  <View style={styles.stackNumber}>
                    <Text style={styles.stackBlockText}>{item}</Text>
                  </View>
                  {index === 0 && (
                    <View style={styles.topBadge}>
                      <Ionicons name="arrow-up" size={14} color="#ffffff" />
                      <Text style={styles.topBadgeText}>TOP</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Manual Pop Button - Always visible when stack is not empty */}
      {stack.length > 0 && (
        <View style={styles.manualPopContainer}>
          <Text style={styles.manualPopLabel}>Manual Control:</Text>
          <TouchableOpacity 
            style={styles.manualPopButton} 
            onPress={manualPop}
            activeOpacity={0.8}
          >
            <View style={styles.manualPopIcon}>
              <Ionicons name="arrow-up-circle" size={24} color="#ffffff" />
            </View>
            <View style={styles.manualPopDetails}>
              <Text style={styles.manualPopTitle}>Pop from Stack</Text>
              <Text style={styles.manualPopSubtitle}>Remove top element</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Operation */}
      <View style={styles.operationContainer}>
        {currentStep < operations.length ? (
          <>
            <View style={styles.operationHeader}>
              <Text style={styles.operationLabel}>Next Operation</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressText}>{currentStep + 1} of {operations.length}</Text>
              </View>
            </View>
            <View style={[
              styles.operationCard,
              operations[currentStep].action === 'push' ? styles.pushCard : styles.popCard
            ]}>
              <View style={[
                styles.operationIcon,
                operations[currentStep].action === 'push' ? styles.pushIcon : styles.popIcon
              ]}>
                <Ionicons 
                  name={operations[currentStep].action === 'push' ? 'add' : 'remove'} 
                  size={24} 
                  color="#ffffff" 
                />
              </View>
              <View style={styles.operationDetails}>
                <Text style={styles.operationAction}>
                  {operations[currentStep].action.toUpperCase()}
                </Text>
                <Text style={styles.operationText}>{operations[currentStep].description}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.executeButton} 
              onPress={executeOperation}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.executeButtonText}>Execute Operation</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.completedContainer}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
            </View>
            <Text style={styles.completedTitle}>Quiz Complete!</Text>
            <Text style={styles.completedText}>All {operations.length} operations executed successfully</Text>
            <View style={styles.finalStackBox}>
              <Text style={styles.finalStackLabel}>Final Stack:</Text>
              <Text style={styles.finalStackValue}>[{stack.join(', ')}]</Text>
            </View>
          </View>
        )}
      </View>

      {/* Operation History */}
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <MaterialCommunityIcons name="history" size={22} color="#4a044e" />
            <Text style={styles.historyTitle}>Execution Log</Text>
            <View style={styles.historyCount}>
              <Text style={styles.historyCountText}>{history.length}</Text>
            </View>
          </View>
          <View style={styles.historyList}>
            {history.map((item, index) => (
              <View key={index} style={[styles.historyItem, item.isManual && styles.historyItemManual]}>
                <View style={[styles.historyStep, item.isManual && styles.historyStepManual]}>
                  <Text style={styles.historyStepText}>{item.step}</Text>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.historyOperationRow}>
                    <Text style={styles.historyOperation}>{item.operation}</Text>
                    {item.isManual && (
                      <View style={styles.manualBadge}>
                        <Text style={styles.manualBadgeText}>Manual</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.historyResult}>{item.result}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={18} color={item.isManual ? "#ef4444" : "#10b981"} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetQuiz}
        activeOpacity={0.8}
      >
        <Ionicons name="refresh-circle" size={22} color="#FFFFFF" />
        <Text style={styles.resetButtonText}>{completed ? "New Quiz" : "Reset"}</Text>
      </TouchableOpacity>

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
            <Text style={styles.stepText}>Execute operations one by one using the "Execute" button</Text>
          </View>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Use manual pop when stack has items to remove elements anytime</Text>
          </View>
          <View style={styles.howToPlayStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Observe LIFO behavior: last pushed item is first to be popped</Text>
          </View>
        </View>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="information" size={18} color="#4a044e" />
        </View>
        <Text style={styles.infoText}>
          <Text style={styles.infoBold}>LIFO Principle:</Text> The last element pushed onto the stack is the first one to be popped off
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
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
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
    fontSize: 13,
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
  manualPopContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fee2e2',
  },
  manualPopLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manualPopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  manualPopIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  manualPopDetails: {
    flex: 1,
  },
  manualPopTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  manualPopSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
  },
  stackContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 250,
  },
  stackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stackLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stackLabelText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
  },
  stackSize: {
    backgroundColor: '#fdf4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  stackSizeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4a044e',
  },
  stackItems: {
    alignItems: 'center',
    width: '100%',
  },
  emptyStack: {
    padding: 50,
    alignItems: 'center',
  },
  emptyStackText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '700',
    marginTop: 12,
  },
  emptyStackHint: {
    fontSize: 13,
    color: '#d1d5db',
    marginTop: 4,
    fontStyle: 'italic',
  },
  stackBlock: {
    backgroundColor: '#fae8ff',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#d8b4fe',
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  stackBlockTop: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderWidth: 3,
  },
 
  topBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  operationContainer: {
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
  operationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  operationLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  progressBadge: {
    backgroundColor: '#fdf4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4a044e',
  },
  operationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  pushCard: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  popCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  operationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pushIcon: {
    backgroundColor: '#10b981',
  },
  popIcon: {
    backgroundColor: '#ef4444',
  },
  operationDetails: {
    flex: 1,
  },
  operationAction: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 4,
    letterSpacing: 1,
  },
  operationText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  executeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a044e',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  executeButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  completedContainer: {
    alignItems: 'center',
    padding: 24,
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
  completedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 16,
  },
  finalStackBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    width: '100%',
    alignItems: 'center',
  },
  finalStackLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  finalStackValue: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '800',
  },
  historyContainer: {
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
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    flex: 1,
  },
  historyCount: {
    backgroundColor: '#fdf4ff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  historyCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4a044e',
  },
  historyList: {
    gap: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#fafaf9',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  historyStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4a044e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyStepText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  historyDetails: {
    flex: 1,
  },
  historyItemManual: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  historyStepManual: {
    backgroundColor: '#ef4444',
  },
  historyOperationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  historyOperation: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f2937',
  },
  manualBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  manualBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyResult: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a044e',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
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
