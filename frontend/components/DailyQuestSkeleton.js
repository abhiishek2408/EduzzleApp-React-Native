import React from "react";
import { View } from "react-native";


const DailyQuestSkeleton = () => (
  <View className="px-4 mb-3">
    {/* Header skeleton */}
    <View className="flex-row items-center gap-2 mt-2 mb-1 px-2">
      <View className="w-7 h-7 rounded-full bg-gray-200" />
      <View className="h-5 w-32 bg-gray-200 rounded" />
    </View>
    {/* Decorative dots and icon skeleton */}
    <View className="flex-row justify-center items-center mb-2">
      {[...Array(7)].map((_, i) => (
        <View
          key={i}
          className="w-2 h-2 rounded-full mx-1 bg-gray-200"
        />
      ))}
      <View className="w-5 h-5 rounded-full bg-gray-200 ml-2" />
    </View>
    {/* Card skeleton */}
    <View className="rounded-3xl p-[2px] bg-gray-200">
      <View style={{ borderRadius: 24, padding: 20, overflow: "hidden" }}>
        {/* Pattern overlay dots (all gray-200) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.07,
            backgroundColor: "transparent",
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: 2,
                backgroundColor: "#e5e7eb", // closest to bg-gray-200
                top: Math.random() * 300,
                left: Math.random() * 300,
              }}
            />
          ))}
        </View>
        <View>
          {/* Streak skeleton */}
          <View className="flex-row items-center mb-4 space-x-2">
            <View className="w-7 h-7 rounded-full bg-gray-200" />
            <View className="h-5 w-24 bg-gray-200 rounded" />
          </View>
          {/* Target text skeleton */}
          <View className="h-4 w-40 bg-gray-200 rounded mb-2" />
          {/* Progress numbers skeleton */}
          <View className="h-10 w-24 bg-gray-200 rounded mb-4" />
          {/* Progress bar skeleton */}
          <View className="h-3 bg-gray-200 rounded-full overflow-hidden my-3">
            <View style={{ width: '60%', height: '100%', backgroundColor: '#e5e7eb', borderRadius: 999 }} />
          </View>
          {/* Percentage skeleton */}
          <View className="h-4 w-24 bg-gray-200 rounded self-center" />
        </View>
      </View>
    </View>
  </View>
);

export default DailyQuestSkeleton;
