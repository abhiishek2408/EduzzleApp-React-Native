import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import LogoHeader from "./LogoHeader";
import DailyQuest from "./DailyQuest";
import FriendsLeaderboard from "../components/FriendsLeaderboard";
import GlobalLeaderboard from "../components/GlobalLeaderboard";
import CardSkeleton from "../components/CardSkeleton";
import PuzzlesScreen from "./RecommendationScreen";
import HelpDesk from "../components/HelpDesk";
import ReviewUs from "../components/ReviewUs";
import CustomPremiumAlert from "../components/CustomPremiumAlert";
import { QuizScreen } from "../components/HomeScreenQuizSection";

const { width } = Dimensions.get("window");

const categories = [
  { name: "Quick Quizzes", icon: "flash", color: ["#FFEDD5", "#FED7AA"], iconColor: "#F59E0B", link: "QuizzesScreen", premium: false },
  { name: "Visual Puzzles", icon: "grid", color: ["#E0F2FE", "#BAE6FD"], iconColor: "#0EA5E9", link: "VisualPuzzlesScreen", premium: false },
  { name: "MCQ Bank", icon: "school", color: ["#F0FDF4", "#DCFCE7"], iconColor: "#22C55E", link: "MCQCategoriesScreen", premium: false },
  { name: "Gaming Events", icon: "trophy", color: ["#FAF5FF", "#F3E8FF"], iconColor: "#A855F7", link: "GamingEventsList", premium: true },
];

const UserDashboard = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <CardSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#4a044e" />

      <CustomPremiumAlert
        visible={showPremiumAlert}
        onClose={() => setShowPremiumAlert(false)}
      />

      <ScrollView className="flex-grow pb-10">
        <LogoHeader />

        {/* Header */}
          {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.welcomeText}>Hi, {user.name.split(' ')[0]} 👋</Text>
            <Text style={styles.subHeaderText}>Ready for today's challenge?</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.gridContainer}>
          {Array.from({ length: Math.ceil(categories.length / 2) }).map((_, rowIdx) => (
            <View key={rowIdx} style={styles.categoriesWrapper}>
              {categories.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, index) => (
                <TouchableOpacity
                  key={item.name}
                  style={styles.categoryCard}
                  activeOpacity={0.9}
                  onPress={() => item.premium ? setShowPremiumAlert(true) : navigation.navigate(item.link)}
                >
                  <LinearGradient colors={item.color} style={styles.iconWrapper}>
                    <Ionicons name={item.icon} size={26} color={item.iconColor} />
                  </LinearGradient>
                  <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
                  {item.premium && (
                    <View style={styles.premiumBadge}>
                      <Ionicons name="star" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>


        <QuizScreen navigation={navigation} user={user} route={route} />
        <DailyQuest navigation={navigation} />
        <View className="mx-4">
          <FriendsLeaderboard navigation={navigation} />
          <GlobalLeaderboard navigation={navigation} />
          <PuzzlesScreen navigation={navigation} />
          <HelpDesk />
          <ReviewUs />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 40 },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 15,
    marginBottom: 20,
  },
  welcomeText: { fontSize: 24, fontWeight: '900', color: '#1e1b4b', letterSpacing: -0.5 },
  subHeaderText: { fontSize: 13, color: '#64748b', fontWeight: '500', marginTop: 2 },
  profileBadge: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },

  gridContainer: { paddingHorizontal: 22, marginBottom: 25 },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  gridTitle: { fontSize: 18, fontWeight: '800', color: '#1e1b4b' },
  viewAllText: { fontSize: 13, color: '#701a75', fontWeight: '700' },
  
  categoriesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    backgroundColor: '#fff',
    flex: 1,
    minWidth: 0,
    maxWidth: '48%',
    padding: 14,
    borderRadius: 22,
    marginHorizontal: 0,
    marginBottom: 0,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#64748b',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  iconWrapper: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  categoryName: { fontSize: 14, fontWeight: '700', color: '#475569' },
  premiumBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#701a75', padding: 4, borderRadius: 8 },

  contentWrapper: { paddingHorizontal: 20 },
  spacing: { height: 25 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }
});

export default UserDashboard;
