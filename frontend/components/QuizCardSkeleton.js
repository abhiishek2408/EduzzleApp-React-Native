import React from "react";
import { View } from "react-native";

const QuizCardSkeleton = () => (
  <View className="mb-6">
    {/* HEADER SKELETON */}
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center ml-4 gap-1">
        <View className="w-7 h-7 rounded-full bg-gray-200" />
        <View className="h-5 w-32 bg-gray-200 rounded ml-1" />
      </View>
      <View className="mr-4 py-2 px-6 rounded-2xl border bg-gray-200 border-gray-200" />
    </View>
    {/* LIST SKELETON */}
    <View className="flex-row mt-2 px-2">
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="w-44 h-48 rounded-2xl border border-gray-200 shadow-md bg-gray-200 mr-3"
        >
          <View className="flex-1 px-3 pt-3 pb-4 justify-between">
            {/* BADGES */}
            <View className="flex-row items-center gap-2">
              <View className="w-12 h-5 rounded-lg bg-gray-200" />
              <View className="w-16 h-5 rounded-lg bg-gray-200" />
            </View>
            {/* TITLE */}
            <View className="flex-row items-center mt-3">
              <View className="w-5 h-5 rounded-full bg-gray-200" />
              <View className="ml-1 h-4 w-20 bg-gray-200 rounded" />
            </View>
            {/* CATEGORY */}
            <View className="h-4 w-24 bg-gray-200 rounded mt-1" />
            {/* BUTTON */}
            <View className="mt-4 py-2 rounded-xl bg-gray-200 border border-gray-200" />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default QuizCardSkeleton;
