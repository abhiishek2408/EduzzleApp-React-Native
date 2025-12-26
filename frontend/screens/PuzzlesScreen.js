import React, { useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const RecommendedPuzzlesSection = ({ navigation }) => {
  const recommendedScrollRef = useRef(null);

  const puzzles = [
    {
      key: 'stack',
      screen: 'StackQuizScreen',
      puzzleId: 'stack-basics',
      icon: "layers-triple",
      title: 'Stack Quiz',
      desc: 'Master stack logic',
      color: '#7C3AED', // Violet
      badge: 'Popular',
      time: '5 min',
    },
    {
      key: 'linkedlist',
      screen: 'LinkedListPuzzleScreen',
      puzzleId: 'linked-list',
      icon: "link-variant",
      title: 'Linked List',
      desc: 'Connect the nodes',
      color: '#0D9488', // Teal
      time: '7 min',
    },
    {
      key: 'bubblesort',
      screen: 'BubbleSortPuzzleScreen',
      puzzleId: 'bubble-sort',
      icon: "sort-variant",
      title: 'Bubble Sort',
      desc: 'Order the chaos',
      color: '#CA8A04', // Yellow/Gold
      time: '6 min',
    },
    {
      key: 'binarytree',
      screen: 'BinaryTreePuzzleScreen',
      puzzleId: 'binary-tree',
      icon: "file-tree",
      title: 'Binary Tree',
      desc: 'Traverse the roots',
      color: '#DB2777', // Pink
      time: '8 min',
    },
  ];

  return (
    <View className="mt-6 mb-4">
      {/* Header Section */}
      <View className="flex-row justify-between items-end mb-4 px-0">
        <View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="pricetag" size={28} color="#a21caf" style={{ marginLeft: 8 }} />
            <Text className="text-[18px] font-extrabold font-[Inter] bg-gradient-to-r from-violet-700 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md tracking-wide">Recommended</Text>
          </View>
        </View>
        <TouchableOpacity className="bg-[#faf5ff] px-3 py-1.5 rounded-full border border-[#e9d5ff] flex-row items-center" style={{ alignSelf: 'flex-start' }}>
          <Text className="text-xs font-bold" style={{ color: '#a21caf', marginRight: 4 }}>View All</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#a21caf" />
        </TouchableOpacity>
      </View>

      <View className="relative">
        <ScrollView
          ref={recommendedScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 10 }}
          snapToInterval={170} // Card width (160) + gap
          decelerationRate="fast"
        >
          {puzzles.map((puzzle) => (
            <TouchableOpacity
              key={puzzle.key}
              onPress={() => navigation.navigate(puzzle.screen, { puzzleId: puzzle.puzzleId })}
              activeOpacity={0.9}
              className="w-40 mr-4 bg-white rounded-3xl p-4 shadow-md border border-slate-100 overflow-hidden"
              style={{ elevation: 5 }}
            >
              {/* Decorative Background Blob */}
              <View 
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10" 
                style={{ backgroundColor: puzzle.color }} 
              />

              {/* Icon Container */}
              <View 
                className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: `${puzzle.color}20` }}
              >
                <MaterialCommunityIcons name={puzzle.icon} size={26} color={puzzle.color} />
              </View>

              {/* Content */}
              <View className="mb-3">
                <Text className="text-[16px] font-bold text-slate-800 leading-5 mb-1" numberOfLines={1}>
                  {puzzle.title}
                </Text>
                <Text className="text-[11px] text-slate-500 font-medium leading-4" numberOfLines={2}>
                  {puzzle.desc}
                </Text>
              </View>

              {/* Footer Metadata */}
              <View className="flex-row items-center justify-between mt-auto">
                <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-lg">
                  <Ionicons name="time-outline" size={12} color="#64748b" />
                  <Text className="text-[10px] font-bold text-slate-500 ml-1">{puzzle.time}</Text>
                </View>
                
                <View className="bg-slate-900 rounded-full p-1.5">
                    <Ionicons name="play" size={12} color="white" />
                </View>
              </View>

              {/* Badge */}
              {puzzle.badge && (
                <View className="absolute top-3 right-3 bg-amber-400 px-2 py-0.5 rounded-md transform rotate-3">
                  <Text className="text-[8px] font-black text-amber-900 uppercase">
                    {puzzle.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default RecommendedPuzzlesSection;