import React from 'react';
import { View } from 'react-native';

const CardSkeleton = () => (
  <View className="animate-pulse flex flex-col gap-4">
    {[1, 2, 3].map((i) => (
      <View key={i} className="flex-row items-center rounded-2xl p-3 border border-gray-200 bg-gray-100 mb-2">
        {/* Medal skeleton */}
        <View className="w-11 h-11 rounded-full bg-gray-200 mr-3" />
        {/* Profile pic skeleton */}
        <View className="w-14 h-14 rounded-full bg-gray-200 mr-3" />
        {/* Name and stats skeleton */}
        <View className="flex-1">
          <View className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <View className="h-3 bg-gray-200 rounded w-16" />
        </View>
        {/* Points skeleton */}
        <View className="w-12 h-6 bg-gray-200 rounded-xl ml-3" />
      </View>
    ))}
  </View>
);

export default CardSkeleton;
