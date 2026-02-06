import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const gamesList = [
  { id: 1, name: 'Bubble Sort', icon: 'sort-variant', color: '#7c3aed', subtitle: 'Order the chaos', screen: 'BubbleSortPuzzleScreen' },
  { id: 2, name: 'Linked List', icon: 'link-variant', color: '#0d9488', subtitle: 'Connect the nodes', screen: 'LinkedListPuzzleScreen' },
  { id: 3, name: 'Stack Quiz', icon: 'layers-triple', color: '#db2777', subtitle: 'Master LIFO logic', screen: 'StackQuizScreen' },
  { id: 4, name: 'Binary Tree', icon: 'file-tree', color: '#ca8a04', subtitle: 'Traverse the roots', screen: 'BinaryTreePuzzleScreen' },
];

export default function PlayScreen({ navigation }) {
  
  const handleGamePress = (game) => {
    if (game.screen) {
      navigation.navigate(game.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* --- Simple Header --- */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Puzzle Arcade</Text>
        </View>

        {/* --- Cards List --- */}
        <View style={styles.listContainer}>
          {gamesList.map((game) => (
            <TouchableOpacity 
              key={game.id} 
              style={styles.card} 
              onPress={() => handleGamePress(game)}
              activeOpacity={0.7}
            >
              <View style={styles.cardRow}>
                {/* Left: Icon Box */}
                <View style={[styles.iconBox, { backgroundColor: `${game.color}15` }]}>
                  <MaterialCommunityIcons name={game.icon} size={32} color={game.color} />
                </View>

                {/* Middle: Text Info */}
                <View style={styles.cardContent}>
                  <Text style={styles.gameTitle}>{game.name}</Text>
                  <Text style={styles.gameSub}>{game.subtitle}</Text>
                </View>

                {/* Right: Play Arrow */}
                <View style={styles.playArrow}>
                  <MaterialCommunityIcons name="chevron-right" size={28} color="#cbd5e1" />
                </View>
              </View>

              {/* Decorative side accent */}
              <View style={[styles.sideAccent, { backgroundColor: game.color }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Bottom Feature Card --- */}
        <LinearGradient
          colors={['#701a75', '#38053aff']}
          style={styles.promoCard}
        >
          <View>
            <Text style={styles.promoTitle}>DSA based Puzzles</Text>
            <Text style={styles.promoText}>Play puzzles, boost your skills!</Text>
          </View>
          <MaterialCommunityIcons name="lightning-bolt" size={40} color="#fbbf24" />
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 40 
  },
  headerSection: { 
    marginBottom: 25 
  },
  headerLabel: { 
    color: '#701a75', 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 1.2,
    marginBottom: 4 
  },
  headerTitle: { 
    color: '#1e293b', 
    fontSize: 32, 
    fontWeight: '900' 
  },
  listContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  gameSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  playArrow: {
    marginLeft: 10,
  },
  sideAccent: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 20,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  promoCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  promoText: {
    color: '#ddd6fe',
    fontSize: 14,
    fontWeight: '600',
  }
});