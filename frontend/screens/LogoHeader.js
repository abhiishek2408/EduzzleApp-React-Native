import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
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
    <View style={styles.logoHeader}>
      {/* 🔹 Logo Section */}
      <View style={styles.container}>
        <Image source={require("../assets/Eduzzle3.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
          <Ionicons name="notifications-outline" size={16} color="#fff" style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Search Box */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={22}
          color="#a21caf"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search puzzles..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* 🔹 Banner / Card */}
      <View style={styles.card}>
        <View style={styles.textSection}>
          <Text style={styles.title}>ALL THE KNOWLEDGE, ONE TAP AWAY.</Text>
          <Text style={styles.subtitle}>
            Seamless, Fast, & Reliable Access {"\n"}To Hundreds of Categories.
          </Text>
          <TouchableOpacity style={styles.exploreBtn}>
            <Text style={styles.exploreText}>Explore</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/puzzlequiz.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoHeader: {
    backgroundColor: "#a21caf",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? 10 : 35,
    paddingBottom: 6,
    paddingHorizontal: 1,
    backgroundColor: "#a21caf",
    marginTop: 30,
    gap: 185,
  },
  logo: {
    width: 150,
    height: 40,
  },

  bellIcon: {
    marginRight: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Fixed rgba syntax
    padding: 6,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#fff",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    width: screenWidth - 24,
    alignSelf: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#a21caf",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textSection: {
    width: "55%",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#c8e6c9",
    fontSize: 13,
    marginBottom: 10,
  },
  exploreBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  exploreText: {
    color: "#004d40",
    fontWeight: "bold",
    fontSize: 14,
  },
  image: {
    width: screenWidth * 0.35,
    height: 110,
  },
});

export default LogoHeader;
