import React from "react";
import { View, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_HORIZONTAL_MARGIN = 12;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN * 2;

const GamingEventSkeletonCard = () => (
  <View className={`bg-white rounded-2xl p-3 border border-gray-200 shadow-md`} style={{ width: CARD_WIDTH }}>
    {/* Header */}
    <View className="flex-row items-center mb-1.5">
      <View className="w-9 h-9 rounded-full bg-gray-200 mr-2" />
      <View className="flex-1 h-4 rounded bg-gray-200" />
    </View>
    {/* Subtitle */}
    <View className="h-3.5 rounded bg-gray-200 mt-0.5" />
    {/* Countdown */}
    <View className="mt-2.5 mb-2">
      <View className="rounded-lg p-2 items-center border border-gray-200 bg-gray-200">
        <View className="w-15 h-2.5 rounded bg-gray-200 mb-1" />
        <View className="w-20 h-5 rounded bg-gray-200" />
      </View>
    </View>
    {/* Meta badges */}
    <View className="flex-row gap-2 mt-1 flex-wrap">
      {[1,2,3].map((i) => (
        <View key={i} className="rounded-xl border border-gray-200 bg-gray-200 w-15 h-4.5 mr-2" />
      ))}
    </View>
    {/* Join Now Button */}
    <View className="rounded-lg py-2 px-4 items-center justify-center bg-gray-200 mt-0.5">
      <View className="w-18 h-3.5 rounded bg-gray-200" />
    </View>
  </View>
);

const GamingEventsSectionSkeleton = () => (
  <View className="mt-1 mb-2.5">
    <View className="flex-row justify-between items-center px-1.5 mb-1.5">
      <View className="flex-row items-center gap-2">
        <View className="w-5.5 h-5.5 rounded-full bg-gray-200" />
        <View className="w-30 h-4.5 rounded bg-gray-200 ml-2" />
      </View>
      <View className="w-18 h-4.5 rounded-xl bg-gray-200" />
    </View>
    <View className="flex-row px-3">
      {[1,2].map((i) => (
        <View key={i} className="mr-3">
          <GamingEventSkeletonCard />
        </View>
      ))}
    </View>
  </View>
);

export default GamingEventsSectionSkeleton;
