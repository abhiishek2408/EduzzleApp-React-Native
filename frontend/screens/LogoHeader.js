import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const LogoHeader = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
    navigation.setParams({ searchQuery: text });
  };

  return (
    <LinearGradient
      colors={["#4a044e", "#701a75", "#86198f", "#701a75"]}
      locations={[0, 0.3, 0.7, 1]} 
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 20,
      }}
    >
      {/* 🔹 Logo Section */}
      <View className="flex-row items-center justify-between pt-5 pb-2 px-5">
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* 🧩 Puzzle Icon Unit */}
          <View 
            style={{ 
              position: 'relative', 
              width: 40, 
              height: 44, 
              justifyContent: 'center', 
              alignItems: 'center',
              marginRight: -4, 
              zIndex: 10,
            }}
          >
          
            <Ionicons 
              name="extension-puzzle" 
              size={34} 
              color="#fff" 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 6,
                textShadowColor: '#4a044e',
                textShadowRadius: 10,
              }} 
            />
            <View style={{ position: 'absolute', top: 10, left: 12, width: 8, height: 3, backgroundColor: '#fff', borderRadius: 10, opacity: 0.6, transform: [{ rotate: '-15deg' }] }} />
          </View>
            
          {/* 📝 Eduzzle Text Unit */}
          <View style={{ marginLeft: 6 }}> 
            <View style={{ height: 48, justifyContent: 'center' }}>
              {/* Single Eduzzle with 'Edu' colored #f3c999 */}
              <Text style={{ fontSize: 38, fontWeight: '900', letterSpacing: 0.1, color: '#fff', fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'cursive' }}>
                <Text style={{ color: '#f3c999' }}>Edu</Text>
                <Text style={{ color: '#fff' }}>zzle</Text>
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#f3c999', marginTop: 0, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Puzzle. Play. Progress.
            </Text>
          </View>
        </View>

        {/* 🔔 Notification Icon - UPDATED TO WHITE */}
        <TouchableOpacity 
          onPress={() => navigation.navigate("NotificationScreen")}
          style={{
            backgroundColor: "rgba(255,255,255,0.2)", // Glass effect white
            padding: 9,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.3)",
          }}
        > 
          <Ionicons name="notifications" size={20} color="#ffffff" /> 
        </TouchableOpacity>
      </View>

      {/* 🔹 Search Box */}
      <View 
        className="flex-row items-center bg-white rounded-2xl mx-5 mt-4 mb-4 px-4 h-[52px] shadow-2xl"
        style={{ width: screenWidth - 40, alignSelf: 'center' }}
      >
          <View style={{ backgroundColor: '#f3c999', padding: 8, borderRadius: 100, marginRight: 10 }}>
            <Ionicons name="search" size={18} color="#701a75" />
          </View>
          <TextInput
            className="flex-1 text-[16px] font-medium text-gray-800"
            placeholder="Find your favorite puzzle..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity>
             <Ionicons name="options-outline" size={20} color="#4a044e" />
          </TouchableOpacity>
      </View>

      {/* 🔹 Banner / Card */}
      <View 
        className="flex-row mx-5 rounded-3xl p-5 items-center justify-between mb-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <View className="w-[60%]">
          <Text className="text-white text-[17px] font-black leading-5 mb-1">
            KNOWLEDGE AT{"\n"}YOUR FINGERTIPS
          </Text>
          <Text style={{ color: '#f3c999', fontSize: 12, fontWeight: '600', marginBottom: 12 }}>
            Fast & Reliable Access to hundreds of Categories.
          </Text>
          <TouchableOpacity 
            style={{
                backgroundColor: '#f3c999',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                alignSelf: 'flex-start',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 4
            }}
          >
            <Text style={{ color: '#4a044e', fontWeight: '900', fontSize: 13 }}>Explore Now</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/puzzlequiz.png")}
          style={{ width: 85, height: 85, transform: [{ scale: 1.1 }] }}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

export default LogoHeader;