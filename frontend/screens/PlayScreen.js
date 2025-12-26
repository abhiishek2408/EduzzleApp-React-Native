import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import puzzles from Puzzles folder


const gamesList = [
  { id: 1, name: 'Bubble Sort Puzzle', icon: '🔢', screen: 'BubbleSortPuzzleScreen' },
  { id: 2, name: 'Linked List Puzzle', icon: '🔗', screen: 'LinkedListPuzzleScreen' },
  { id: 3, name: 'Stack Quiz', icon: '📦', screen: 'StackQuizScreen' },
  { id: 4, name: 'Binary Tree Puzzle', icon: '🌲', screen: 'BinaryTreePuzzleScreen' },
];

// ...existing code...

// ------------------ Main Screen ------------------ //

export default function PlayScreen({ navigation }) {
  const [selectedGame, setSelectedGame] = useState(null);


  const handleGamePress = (game) => {
    if (game.screen) {
      navigation.navigate(game.screen);
    } else {
      setSelectedGame(game);
    }
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header (simple, no card) */}
        {!selectedGame && (
          <View style={styles.simpleHeader}>
            <MaterialCommunityIcons name="gamepad-variant" size={22} color="#a21caf" style={{ marginRight: 8 }} />
            <Text style={[styles.simpleHeaderTitle, { marginLeft: 6 }]}>Play Puzzles</Text>
          </View>
        )}

        {/* Game Cards - Decreased Height */}
        {!selectedGame &&
          gamesList.map((game) => (
            <TouchableOpacity key={game.id} style={styles.card} onPress={() => handleGamePress(game)}>
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
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4A148C',
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  simpleHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4A148C',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6A1B9A',
    marginTop: 2,
    fontWeight: '600',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0e5f5',
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  headerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f1d7ff',
  },
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