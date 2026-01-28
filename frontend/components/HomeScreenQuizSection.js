import React, { useEffect, useState, useRef } from "react";
import { Dimensions, TouchableOpacity, View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QuizCardSkeleton from "./QuizCardSkeleton";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Added LinearGradient
import axios from "axios";

/* ===================== SECTION ===================== */

export function QuizScreen({ navigation, user, route }) {
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedQuizIds, setAttemptedQuizIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const currentOffset = useRef(0);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        "https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all-free-quizzes"
      );
      setQuizzes(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptedQuizzes = async () => {
    if (!user?._id) return;
    const res = await axios.get(
      `https://eduzzleapp-react-native.onrender.com/api/attempts/attempted-puzzles/${user._id}`
    );
    if (res.data.success) setAttemptedQuizIds(res.data.attemptedQuizIds);
  };

  useEffect(() => {
    if (user?._id) {
      fetchQuizzes();
      fetchAttemptedQuizzes();
    }
  }, [user]);

  if (loading) return <QuizCardSkeleton />;
  if (!quizzes.length) return null;

  return (
    <View className="mb-6 mx-3">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-0 mb-2">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0, marginLeft: 12 }}>
          <View style={{ backgroundColor: '#fdf4ff', padding: 8, borderRadius: 12, marginRight: 10 }}>
            <Ionicons name="star-outline" size={20} color="#701a75" />
          </View>
          <View style={{marginRight: 16}}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e1b4b' }}>Popular Challenges</Text>
            <Text style={{ fontSize: 11, color: '#701a75', fontWeight: '700', marginTop: -2 }}>Try trending quizzes</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("QuizzesScreen")}
          style={{ backgroundColor: '#f3e8ff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }}
        >
          <Text style={{ fontSize: 10, fontWeight: '900', color: '#701a75' }}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        {quizzes.map((quiz, index) => (
          <View
            key={quiz._id}
            className={index !== quizzes.length - 1 ? "mr-3" : ""}
          >
            <QuizCard
              title={quiz.name}
              category={quiz.category}
              attempted={attemptedQuizIds.includes(quiz._id)}
              isFree={quiz.isFree}
              onPress={() =>
                navigation.navigate("QuizOverviewScreen", {
                  quiz,
                  onViewPreviousAttempts: () => navigation.navigate("PreviousAttemptsScreen", { quizId: quiz._id, userId: user._id })
                })
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ===================== CARD ===================== */

const QuizCard = ({ title, category, attempted, isFree, onPress }) => {
  return (
    <View
      className="
        w-44 h-48 rounded-2xl
        border border-gray-200
        shadow-md
        bg-[#faf5ff]
        overflow-hidden
      "
    >
      <View className="flex-1 px-3 pt-3 pb-4 bg-transparent justify-between">

        {/* BADGES */}
        <View className="flex-row items-center gap-2">
          <View
            className={`${
              isFree ? "bg-[#4CAF50]" : "bg-[#FF5722]"
            } px-2 py-0.5 rounded-lg`}
          >
            <Text className="text-white text-xs font-bold">
              {isFree ? "Free" : "Premium"}
            </Text>
          </View>

          {attempted && (
            <View className="bg-[#ff9900] px-2 py-0.5 rounded-lg">
              <Text className="text-white text-xs font-bold">
                Attempted
              </Text>
            </View>
          )}
        </View>

        {/* TITLE */}
        <View className="flex-row items-center mt-3">
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={18}
            color="#4a044e"
          />
          <Text
            className="ml-1 text-[14px] font-extrabold text-[#2d0c57]"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* CATEGORY */}
        {category && (
          <Text className="text-xs text-purple-700 font-medium mt-1">
            {category}
          </Text>
        )}

        {/* BUTTON - GRADIENT APPLIED */}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          className="mt-4"
        >
          <LinearGradient
            colors={["#4a044e", "#701a75", "#86198f"]} // Same as your main BG
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <Text 
              style={{ 
                color: '#f3c999', // Updated to your preferred shade
                textAlign: 'center', 
                fontWeight: '900',
                fontSize: 14 
              }}
            >
              Start Quiz
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default QuizCard;