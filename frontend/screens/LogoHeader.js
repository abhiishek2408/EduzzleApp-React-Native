import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const screenWidth = Dimensions.get("window").width;


const LogoHeader = ({
  searchQuery,
  setSearchQuery,
  onExplorePress
}) => {
    const navigation = useNavigation();
  // If setSearchQuery is not provided, use local state for searchQuery
  const [localQuery, setLocalQuery] = useState("");
  const isControlled = typeof setSearchQuery === "function" && typeof searchQuery === "string";
  const value = isControlled ? searchQuery : localQuery;

  const handleChange = (text) => {
    setLocalQuery(text);
    if (isControlled && setSearchQuery) {
      setSearchQuery(text);
    }
  };

  const triggerSearch = () => {
    if (isControlled && setSearchQuery) {
      setSearchQuery(localQuery);
    }
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
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 50,
        zIndex: 9999,
      }}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between pt-12 pb-1 px-5">
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 38, color: "#f3c999", fontFamily: "Josefin-Bold" }}>Edu</Text>
          <Text style={{ fontSize: 38, color: "#ffffff", fontFamily: "Josefin-Bold" }}>zzle</Text>
          <View style={{ position: "absolute", top: 21, left: 135, width: 7, height: 7, backgroundColor: "#f3c999", borderRadius: 7 }} />
        </View>

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

      {/* SEARCH BOX */}
      <View
        style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 16,
          marginHorizontal: 20,
          marginTop: 16,
          marginBottom: 16,
          paddingHorizontal: 16,
          height: 52,
          elevation: 8 
        }}
      >
        <Ionicons name="search" size={18} color="#701a75" style={{ marginRight: 10 }} />
        <TextInput
          style={{ flex: 1, fontSize: 16, color: "#1f2937", fontFamily: "Josefin-Regular" }}
          placeholder="Search puzzles..."
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={handleChange}
          returnKeyType="search"
          onSubmitEditing={triggerSearch}
        />
        <TouchableOpacity
          onPress={triggerSearch}
          style={{ marginLeft: 8, padding: 6, borderRadius: 8, backgroundColor: '#f3e8ff' }}
        >
          <Ionicons name="search" size={20} color="#701a75" />
        </TouchableOpacity>
      </View>


      {/* BANNER WITH PERMANENT BADGE */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          borderRadius: 24,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'between',
          marginBottom: 24,
          backgroundColor: "rgba(0,0,0,0.15)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <View style={{ width: "65%" }}>
          <Text style={{ fontSize: 18, color: "#ffffff", fontFamily: "Josefin-Bold" }}>
            LEVEL UP YOUR{"\n"}IQ EVERY DAY
          </Text>
          
          <Text style={{ fontSize: 13, color: "#f3c999", marginTop: 4, marginBottom: 12, fontFamily: "Josefin-Regular" }}>
            Hand-picked puzzles to sharp{"\n"}your mind daily.
          </Text>

          {/* PERMANENT NON-BUTTON ELEMENT */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <View style={{ 
               paddingHorizontal: 12, 
               paddingVertical: 4, 
               borderRadius: 6, 
               backgroundColor: 'rgba(243, 201, 153, 0.15)',
               borderWidth: 1,
               borderColor: 'rgba(243, 201, 153, 0.3)'
             }}>
               <Text style={{ 
                 color: '#f3c999', 
                 fontSize: 10, 
                 fontFamily: 'Josefin-Bold', 
                 letterSpacing: 1.5
               }}>
                 Student Choice
               </Text>
             </View>
          </View>
        </View>

        <Image
          source={require("../assets/puzzlequiz.png")}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

export default LogoHeader;