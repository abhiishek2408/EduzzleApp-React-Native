import React, { useContext, useRef } from "react";
import { findNodeHandle, UIManager } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";


// Component Imports
import LogoHeader from "./LogoHeader";
import DailyQuest from "./DailyQuest";
import GamingEventsSection from "./GamingEventsSection";
import FriendsLeaderboard from "../components/FriendsLeaderboard";
import GlobalLeaderboard from "../components/GlobalLeaderboard";
import { QuizScreen } from "../components/HomeScreenQuizSection";
import PuzzlesScreen from "./RecommendationScreen";
import HelpDesk from "../components/HelpDesk";
import ReviewUs from "../components/ReviewUs";

const { width } = Dimensions.get("window");

const categories = [
  {
    name: "Quick Quizzes",
    icon: "flash",
    color: "#FFF9E6",
    iconColor: "#FACC15",
    link: "QuizzesScreen",
  },
  {
    name: "Visual Puzzles",
    icon: "grid",
    color: "#E6FFFA",
    iconColor: "#14B8A6",
    link: "VisualPuzzlesScreen",
  },
  {
    name: "MCQ Bank",
    icon: "help-circle",
    color: "#E0F2FE",
    iconColor: "#0EA5E9",
    link: "MCQCategoriesScreen",
  },
  {
    name: "Gaming Events",
    icon: "trophy",
    color: "#EEF2FF",
    iconColor: "#6366F1",
    link: "GamingEventsList",
  },
];

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const scrollRef = useRef(null);
  const categoriesRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const scrollToContent = () => {
    setTimeout(() => {
      const catNode = findNodeHandle(categoriesRef.current);
      const scrollNode = findNodeHandle(scrollRef.current);
      if (catNode && scrollNode) {
        UIManager.measure(catNode, (x, y, width, height, pageX, pageY) => {
          UIManager.measure(scrollNode, (sx, sy, swidth, sheight, spageX, spageY) => {
            const scrollY = pageY - spageY;
            scrollRef.current.scrollTo({ y: scrollY, animated: true });
          });
        });
      }
    }, 100);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      <ScrollView
        ref={scrollRef}
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerTopArea}>
          <LogoHeader navigation={navigation} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onExplorePress={scrollToContent} />
        </View>

        {/* GAME CATEGORIES */}
        <View ref={categoriesRef} collapsable={false} style={styles.sectionHeaderRow}>
          <View style={styles.sectionIconBg}>
            <Ionicons name="rocket" size={22} color="#701a75" />
          </View>
          <View>
            <Text style={styles.mainSectionTitle}>Game Categories</Text>
            <Text style={styles.sectionSubText}>
              Choose your next challenge
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.catCard, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.link)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon}
                  size={28}
                  color={item.iconColor}
                />
              </View>
              <Text style={styles.catLabel}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MODULES */}
        <View style={[styles.moduleSpacer]}>
          <QuizScreen navigation={navigation} user={user} route={route} searchQuery={searchQuery} />
        </View>
       

        <DailyQuest navigation={navigation} />
        <GamingEventsSection navigation={navigation} />

        <View style={styles.moduleSpacer}>
          <FriendsLeaderboard navigation={navigation} />
        </View>

        <View style={styles.moduleSpacer}>
          <GlobalLeaderboard navigation={navigation} />
        </View>

        <View style={styles.moduleSpacer}>
          <PuzzlesScreen navigation={navigation} searchQuery={searchQuery} />
        </View>

        <View style={styles.footerSpacing}>
          <HelpDesk />
          <View style={{ height: 16 }} />
          <ReviewUs />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerTopArea: {
    backgroundColor: "#f3e8ff",
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: "#701a75",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 999,
    minHeight: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
    paddingTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  sectionIconBg: {
    backgroundColor: "#fdf4ff",
    padding: 10,
    borderRadius: 14,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#fae8ff",
  },
  mainSectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1e1b4b",
  },
  sectionSubText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    marginTop: -2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  catCard: {
    width: (width - 55) / 2,
    paddingVertical: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  catLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
  },
  moduleSpacer: {
    marginHorizontal: 16,
    marginTop: 25,
  },
  footerSpacing: {
    marginHorizontal: 16,
    marginTop: 40,
  },
});
