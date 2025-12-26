import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HelpDesk = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "How do I start a quiz?",
      answer: "Browse the available quizzes on the home screen and tap on any quiz card. Then click 'Start Quiz' to begin. You can choose from different difficulty levels: Easy, Medium, or Hard.",
      icon: "play-circle-outline"
    },
    {
      question: "What are coins and how do I earn them?",
      answer: "Coins are rewards you earn by completing quizzes and daily quests. Use coins to unlock premium features, special badges, and exclusive content. Complete more quizzes to earn more coins!",
      icon: "circle-multiple"
    },
    {
      question: "How does the leaderboard work?",
      answer: "The leaderboard ranks players based on total points earned from quiz attempts. There are two types: Friends Leaderboard (only your friends) and Global Leaderboard (all users). Complete more quizzes and score higher to climb the ranks!",
      icon: "trophy-outline"
    },
    {
      question: "What are daily quests?",
      answer: "Daily quests are challenges that reset every day. Complete 5 quizzes in a day to earn bonus rewards and maintain your streak. Longer streaks unlock special badges and achievements!",
      icon: "calendar-check"
    },
    {
      question: "How do I add friends?",
      answer: "Go to the Friends screen from the navigation menu. Search for users by name or email, send friend requests, and once accepted, compete with them on the Friends Leaderboard!",
      icon: "account-multiple-plus"
    },
    {
      question: "What are puzzle challenges?",
      answer: "Puzzle challenges are interactive learning experiences including Stack Quiz, Bubble Sort, Linked List, and Binary Tree puzzles. They help you understand data structures and algorithms through hands-on practice.",
      icon: "puzzle-outline"
    },
    {
      question: "Can I retry a quiz?",
      answer: "Yes! You can attempt any quiz multiple times to improve your score. Your best score will be recorded. Each attempt helps you learn and master the content.",
      icon: "refresh"
    },
    {
      question: "What are gaming events?",
      answer: "Gaming events are special time-limited quiz competitions with exclusive rewards. Join live events to compete with other players and earn unique badges and bonus points!",
      icon: "tournament"
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="my-1">
      <View className="flex-row items-center gap-3 mb-4 px-1 py-3 rounded-2xl">
        <MaterialCommunityIcons name="help-circle" size={28} color="#a21caf" style={{ marginLeft: 8 }} />
        <Text className="text-[18px] font-extrabold bg-gradient-to-r from-violet-700 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md tracking-wide">Help Desk: FAQs</Text>
      </View>

      <View className="space-y-4">
        {faqs.map((faq, index) => (
          <View key={index} className="bg-white rounded-2xl shadow-md border border-gray-200/60 mx-2 mb-1 border-[0.5px]">
            <TouchableOpacity
              className="flex-row justify-between items-center px-5 py-4"
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-violet-50 border border-violet-200 justify-center items-center">
                  <MaterialCommunityIcons 
                    name={faq.icon} 
                    size={22} 
                    color="#a21caf" 
                  />
                </View>
                <Text className="text-[16px] font-bold text-gray-800 flex-1">{faq.question}</Text>
              </View>
              <MaterialCommunityIcons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={26}
                color="#a21caf"
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <View className="px-5 pb-4 pt-1 pl-16">
                <Text className="text-[15px] text-gray-500 leading-6">{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

        <View className="flex-row items-center bg-white px-6 py-5 rounded-2xl mt-4 border border-gray-200/60 border-[0.5px] shadow-sm relative overflow-hidden">
        <View className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-300 via-fuchsia-200 to-pink-200 rounded-l-2xl opacity-70" />
        <MaterialCommunityIcons name="email-outline" size={24} color="#a21caf" style={{ marginLeft: 6, marginRight: 2 }} />
        <Text className="text-[15px] text-gray-700 flex-1 font-medium">
          Still have questions? Contact us at{' '}
          <Text className="text-violet-700 font-bold">support@eduzzle.com</Text>
        </Text>
      </View>

    </View>
    
  );
};



export default HelpDesk;
