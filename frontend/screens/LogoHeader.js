import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";

const screenWidth = Dimensions.get("window").width;

const LogoHeader = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
    navigation.setParams({ searchQuery: text });
  };

  /* 🔤 Load Fonts */
  const [fontsLoaded] = useFonts({
    "Josefin-Regular": JosefinSans_400Regular,
    "Josefin-Bold": JosefinSans_700Bold,
  });

  /* ❗ WAIT till fonts are loaded */
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#4a044e", "#701a75", "#86198f", "#701a75"]}
      locations={[0, 0.3, 0.7, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 20,
      }}
    >
      {/* 🔹 Header */}
      <View className="flex-row items-center justify-between pt-12 pb-1 px-5">
        {/* 🔹 Logo */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Josefin-Bold",
              fontSize: 38,
              lineHeight: 38,
              color: "#f3c999",
            }}
          >
            Edu
          </Text>

          <Text
            style={{
              fontFamily: "Josefin-Bold",
              fontSize: 38,
              lineHeight: 38,
              color: "#ffffff",
            }}
          >
            zzle
          </Text>

          <View
            style={{
              position: "absolute",
              top: 2,
              left: 135,
              width: 7,
              height: 7,
              backgroundColor: "#f3c999",
              borderRadius: 7,
            }}
          />
        </View>

        {/* 🔔 Notification */}
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationScreen")}
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: 9,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <Ionicons name="notifications" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 🔍 Search Box */}
      <View
        className="flex-row items-center bg-white rounded-2xl mx-5 mt-4 mb-4 px-4 h-[52px]"
        style={{
          width: screenWidth - 40,
          alignSelf: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View
          style={{
            backgroundColor: "#f3c999",
            padding: 8,
            borderRadius: 100,
            marginRight: 10,
          }}
        >
          <Ionicons name="search" size={18} color="#701a75" />
        </View>

        <TextInput
          style={{
            flex: 1,
            fontFamily: "Josefin-Regular",
            fontSize: 16,
            color: "#1f2937",
          }}
          placeholder="Find your favorite puzzle..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <Ionicons name="options-outline" size={20} color="#4a044e" />
      </View>

      {/* 🎴 Banner */}
      <View
        className="flex-row mx-5 rounded-3xl p-5 items-center justify-between mb-6"
        style={{
          backgroundColor: "rgba(0,0,0,0.15)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <View style={{ width: "60%" }}>
          <Text
            style={{
              fontFamily: "Josefin-Bold",
              fontSize: 17,
              lineHeight: 20,
              color: "#ffffff",
              marginBottom: 4,
            }}
          >
            KNOWLEDGE AT{"\n"}YOUR FINGERTIPS
          </Text>

          <Text
            style={{
              fontFamily: "Josefin-Regular",
              fontSize: 12,
              color: "#f3c999",
              marginBottom: 12,
            }}
          >
            Fast & Reliable Access to hundreds of Categories.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#f3c999",
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 16,
              alignSelf: "flex-start",
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Josefin-Bold",
                fontSize: 13,
                color: "#4a044e",
              }}
            >
              Explore Now
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/puzzlequiz.png")}
          style={{ width: 85, height: 85 }}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

export default LogoHeader;
