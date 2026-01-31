import React, { useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RecommendedPuzzlesSection = ({ navigation, searchQuery = "" }) => {
  const recommendedScrollRef = useRef(null);

  const puzzles = [
    {
      key: 'stack',
      screen: 'StackQuizScreen',
      puzzleId: 'stack-basics',
      icon: "layers-triple",
      title: 'Stack Quiz',
      desc: 'Master stack LIFO logic',
      color: '#7C3AED', 
      badge: 'Popular',
      time: '5 min',
    },
    {
      key: 'linkedlist',
      screen: 'LinkedListPuzzleScreen',
      puzzleId: 'linked-list',
      icon: "link-variant",
      title: 'Linked List',
      desc: 'Connect the data nodes',
      color: '#0D9488', 
      time: '7 min',
    },
    {
      key: 'bubblesort',
      screen: 'BubbleSortPuzzleScreen',
      puzzleId: 'bubble-sort',
      icon: "sort-variant",
      title: 'Bubble Sort',
      desc: 'Order the array chaos',
      color: '#CA8A04', 
      badge: 'New',
      time: '6 min',
    },
    {
      key: 'binarytree',
      screen: 'BinaryTreePuzzleScreen',
      puzzleId: 'binary-tree',
      icon: "file-tree",
      title: 'Binary Tree',
      desc: 'Traverse the root paths',
      color: '#DB2777', 
      time: '8 min',
    },
  ];

  // Filter puzzles by searchQuery (case-insensitive)
  const filteredPuzzles = puzzles.filter(puzzle =>
    puzzle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    puzzle.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="mt-8 mb-6">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
          <View style={{ backgroundColor: '#fdf4ff', padding: 8, borderRadius: 12, marginRight: 10 }}>
            <Ionicons name="extension-puzzle-outline" size={20} color="#701a75" />
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e1b4b' }}>Recommended</Text>
            <Text style={{ fontSize: 11, color: '#701a75', fontWeight: '700', marginTop: -2 }}>Handpicked for you</Text>
          </View>
        </View>
      </View>

      {/* --- Horizontal Scroll List --- */}
      <ScrollView
        ref={recommendedScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 8, paddingRight: 10 }}
        snapToInterval={180} 
        decelerationRate="fast"
      >
        {filteredPuzzles.map((puzzle) => (
          <TouchableOpacity
            key={puzzle.key}
            onPress={() => navigation.navigate(puzzle.screen, { puzzleId: puzzle.puzzleId })}
            activeOpacity={0.95}
            style={styles.cardShadow}
            className="w-[165px] mr-4 bg-white rounded-[32px] p-5 border border-slate-50 overflow-hidden relative"
          >
            <View 
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.08]" 
              style={{ backgroundColor: puzzle.color }} 
            />

            {puzzle.badge && (
              <View 
                className="absolute top-4 right-4 px-2 py-1 rounded-lg"
                style={{ backgroundColor: `${puzzle.color}20` }}
              >
                <Text className="text-[9px] font-black" style={{ color: puzzle.color }}>
                  {puzzle.badge}
                </Text>
              </View>
            )}

            {/* Icon Box */}
            <LinearGradient
              colors={[`${puzzle.color}30`, `${puzzle.color}10`]}
              style={{ width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
            >
              <MaterialCommunityIcons name={puzzle.icon} size={30} color={puzzle.color} />
            </LinearGradient>

            {/* Content */}
            <View className="mb-4">
              <Text className="text-[17px] font-black text-slate-800 mb-1" numberOfLines={1}>
                {puzzle.title}
              </Text>
              <Text className="text-[11px] text-slate-400 font-bold leading-4" numberOfLines={2}>
                {puzzle.desc}
              </Text>
            </View>

            {/* Footer Row */}
            <View className="flex-row items-center justify-between mt-auto">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="clock-outline" size={13} color="#94a3b8" />
                <Text className="text-[11px] font-black text-slate-500 ml-1">{puzzle.time}</Text>
              </View>
              
              <View className="bg-slate-900 w-8 h-8 rounded-full items-center justify-center shadow-md">
                <Ionicons name="play" size={14} color="#fff" style={{ marginLeft: 2 }} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#6b21a8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20, 
  }
});

export default RecommendedPuzzlesSection;
// For HomeScreen import compatibility
export { RecommendedPuzzlesSection as PuzzlesScreen };