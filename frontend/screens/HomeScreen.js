// import React, { useEffect, useState, useContext } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   StatusBar,
//   Platform,
//   Dimensions,
// } from "react-native";
// import axios from "axios";
// import Svg, { Rect, Defs, LinearGradient, Stop, Circle, Path } from "react-native-svg";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// import { AuthContext } from "../context/AuthContext";

// const THEME_COLOR = "#a21caf";
// const PRIMARY_TEXT_COLOR = "#2d0c57";
// const SECONDARY_TEXT_COLOR = "#4a4a6a";

// const PADDING_HORIZONTAL = 20;
// const CARD_MARGIN = 10;
// const { width: screenWidth } = Dimensions.get("window");
// const CARD_WIDTH = (screenWidth - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / 2;
// const CARD_HEIGHT = 140;

// // ------------------- REUSABLE PUZZLE CARD -------------------
// const PuzzleCard = ({
//   title,
//   subtitle,
//   iconName,
//   iconColor = THEME_COLOR,
//   onPress,
//   isActionable = true,
//   showIndicator = true,
//   indicatorText = "Start",
//   backgroundColor = "rgba(162, 28, 175, 0.1)",
//   borderColor = THEME_COLOR,
//   category,
//   isGrid = false,
//   index = 0,
//   attempted = false,
//   gradientKey,
//   isFree = false,
// }) => {
//   const cardBackground = isGrid
//     ? attempted
//       ? "rgba(162, 28, 175, 0.2)"
//       : "#fff"
//     : backgroundColor;

//   const cardBorder = isGrid && attempted ? "#ff9900" : borderColor;

//   return (
//     <TouchableOpacity
//       style={[
//         isGrid ? verticalListStyles.cardWrapper : continueStyles.card,
//         { backgroundColor: cardBackground, borderLeftColor: cardBorder },
//         isGrid && index % 2 === 0 ? { marginRight: CARD_MARGIN } : null,
//       ]}
//       onPress={onPress}
//       activeOpacity={isActionable ? 0.7 : 1}
//     >
//       {isGrid && (
//         <View style={[StyleSheet.absoluteFill, { borderRadius: 12, overflow: 'hidden' }]}>
//           <Svg height="100%" width="100%">
//             <Defs>
//               <LinearGradient id={`cardGradient-${gradientKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
//                 <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
//                 <Stop offset="100%" stopColor="#f7f7f7" stopOpacity="1" />
//               </LinearGradient>
//             </Defs>
//             <Rect
//               x="0"
//               y="0"
//               width="100%"
//               height="100%"
//               fill={`url(#cardGradient-${gradientKey})`}
//               rx="12"
//               ry="12"
//             />
//           </Svg>
//         </View>
//       )}

//       <View style={isGrid ? verticalListStyles.cardContent : continueStyles.textContainer}>
//         {!isGrid && (
//           <>
//             {iconName && (
//               <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
//                 <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
//                 <Text style={[continueStyles.statusText, { marginLeft: 6 }]}>{title}</Text>
//               </View>
//             )}
//             {!iconName && title && <Text style={continueStyles.statusText}>{title}</Text>}
//             <Text style={continueStyles.subtitleText} numberOfLines={2}>
//               {subtitle}
//             </Text>
//           </>
//         )}

//         {isGrid && (
//           <>
//             {/* {iconName && (
//               <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
//                 <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
//                 <Text style={[continueStyles.statusText, { marginLeft: 6, color: PRIMARY_TEXT_COLOR }]}>
//                   {title}
//                 </Text>
//               </View>
//             )} */}

            
//              <Text style={verticalListStyles.puzzleName}>{title}</Text>

//             <Text style={[verticalListStyles.puzzleName, { marginBottom: 4 }]} numberOfLines={2}>
//               {subtitle}
//             </Text>

//             {category && <Text style={verticalListStyles.categoryText}>{category}</Text>}

//             {/* Free/Premium Badge */}
//             <View style={[verticalListStyles.freeBadge, { backgroundColor: isFree ? "#4CAF50" : "#FF5722" }]}>
//               <Text style={verticalListStyles.freeBadgeText}>{isFree ? "Free" : "Premium"}</Text>
//             </View>

//             {attempted && (
//               <View style={verticalListStyles.attemptedBadge}>
//                 <Text style={verticalListStyles.attemptedBadgeText}>Attempted</Text>
//               </View>
//             )}

//             <View style={verticalListStyles.startQuizButton}>
//               <Text style={verticalListStyles.startQuizButtonText}>Start Quiz</Text>
//             </View>
//           </>
//         )}
//       </View>

//       {showIndicator && !isGrid && (
//         <View style={continueStyles.progressIndicator}>
//           <Text style={continueStyles.progressText}>{indicatorText}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// // ------------------- MAIN SCREEN -------------------
// export default function HomeScreen({ navigation }) {
//   const { user } = useContext(AuthContext);
//   const [puzzles, setPuzzles] = useState([]);
//   const [attemptedPuzzleIds, setAttemptedPuzzleIds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPuzzles = async () => {
//     try {
//       const res = await axios.get(
//         `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all?userId=${user._id}`
//       );
//       setPuzzles(res.data);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Could not load puzzles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAttemptedPuzzles = async () => {
//     try {
//       const res = await axios.get(
//         `https://eduzzleapp-react-native.onrender.com/api/attempts/attempted-puzzles/${user._id}`
//       );
//       if (res.data.success) setAttemptedPuzzleIds(res.data.attemptedPuzzleIds);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (user?._id) {
//       fetchPuzzles();
//       fetchAttemptedPuzzles();
//     }
//   }, [user]);

//   if (loading)
//     return <ActivityIndicator size="large" color={THEME_COLOR} style={styles.loadingIndicator} />;

//   return (
//     <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
//       <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

//       {/* Background SVG */}
//       <View style={StyleSheet.absoluteFillObject}>
//         <Svg height="100%" width="100%">
//           <Defs>
//             <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
//               <Stop offset="100%" stopColor="#f8f4fb" stopOpacity="1" />
//             </LinearGradient>
//           </Defs>
//           <Rect x="0" y="0" width="100%" height="100%" fill="url(#backgroundGradient)" />
//           <Circle cx="10%" cy="5%" r="50" fill={THEME_COLOR} fillOpacity="0.15" />
//           <Circle cx="95%" cy="30%" r="60" fill={THEME_COLOR} fillOpacity="0.1" />
//           <Rect x="5%" y="60%" width="100" height="60" fill={THEME_COLOR} fillOpacity="0.08" rx="15" ry="15" />
//           <Path d="M 0 400 Q 150 350 300 400 L 300 500 L 0 500 Z" fill={THEME_COLOR} fillOpacity="0.1" />
//         </Svg>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Daily Puzzle */}
//         <Text style={styles.sectionTitle}>Today's Puzzle</Text>
//         <PuzzleCard
//           title="Today's Puzzle"
//           subtitle="Stack Quiz"
//           iconName="bullseye-arrow"
//           onPress={() => navigation.navigate("StackQuizScreen", { puzzleId: "daily" })}
//         />

//         {/* Grid Puzzles */}
//         {puzzles.length > 0 && (
//           <View style={{ marginBottom: 25 }}>
//             <Text style={styles.sectionTitle}>Quizzes</Text>
//             <View style={verticalListStyles.grid}>
//               {puzzles.map((puzzle, index) => (
//                 <PuzzleCard
//                   key={puzzle._id}
//                   subtitle={puzzle.name}
//                   category={puzzle.category}
//                   isGrid={true}
//                   index={index}
//                   attempted={attemptedPuzzleIds.includes(puzzle._id)}
//                   onPress={() => navigation.navigate("PuzzleScreen", { puzzleId: puzzle._id })}
//                   gradientKey={puzzle._id}
//                   iconName="lightbulb-on-outline"
//                   iconColor={PRIMARY_TEXT_COLOR}
//                   isFree={puzzle.isFree}
//                 />
//               ))}
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// // ------------------- STYLES -------------------
// const styles = StyleSheet.create({
//   loadingIndicator: { flex: 1, justifyContent: "center" },
//   scrollContent: {
//     paddingHorizontal: PADDING_HORIZONTAL,
//     paddingTop: 20,
//     paddingBottom: 40,
//     flexGrow: 1,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: PRIMARY_TEXT_COLOR,
//     marginTop: 20,
//     marginBottom: 15,
//     zIndex: 1,
//     paddingHorizontal: 5,
//   },
// });

// const verticalListStyles = StyleSheet.create({
//   grid: { flexDirection: "row", flexWrap: "wrap", width: "100%", alignItems: "flex-start" },
//   cardWrapper: {
//     width: CARD_WIDTH,
//     height: CARD_HEIGHT,
//     borderRadius: 12,
//     marginBottom: CARD_MARGIN,
//   },
//   cardContent: { flex: 1, padding: 12, borderRadius: 12, justifyContent: "space-between", zIndex: 10 },
//   puzzleName: { fontSize: 15, fontWeight: "800", color: PRIMARY_TEXT_COLOR },
//   categoryText: { fontSize: 12, fontWeight: "600", color: SECONDARY_TEXT_COLOR, marginTop: 4 },
//   attemptedBadge: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#ff9900",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//     zIndex: 20,
//   },
//   attemptedBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
//   freeBadge: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//     zIndex: 20,
//   },
//   freeBadgeText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "700",
//   },
//   startQuizButton: {
//     backgroundColor: THEME_COLOR,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   startQuizButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   }
// });

// const continueStyles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "rgba(162, 28, 175, 0.1)",
//     borderRadius: 12,
//     padding: 15,
//     borderLeftWidth: 5,
//     borderLeftColor: THEME_COLOR,
//     marginBottom: 15,
//   },
//   textContainer: { flex: 1, marginRight: 10 },
//   statusText: { fontSize: 14, fontWeight: "700", color: THEME_COLOR, marginBottom: 4 },
//   subtitleText: { fontSize: 16, fontWeight: "800", color: PRIMARY_TEXT_COLOR, marginTop: 2 },
//   progressIndicator: {
//     backgroundColor: THEME_COLOR,
//     paddingHorizontal: 10,
//     marginTop: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   progressText: { fontSize: 12, fontWeight: "700", color: "#fff" },
// });




import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import axios from "axios";
import Svg, { Rect, Defs, LinearGradient, Stop, Circle, Path } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import LogoHeader from "./LogoHeader";

const THEME_COLOR = "#a21caf";
const PRIMARY_TEXT_COLOR = "#2d0c57";
const SECONDARY_TEXT_COLOR = "#4a4a6a";

const SHADOW_COLOR = '#000000'; // Black shadow color
const CARD_BACKGROUND_COLOR = '#FFFFFF'; // White background for the card
const SECONDARY_BADGE_COLOR = '#4CAF50';

const PADDING_HORIZONTAL = 20;
const CARD_MARGIN = 10;
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / 2;
const CARD_HEIGHT = 190;

const { width } = Dimensions.get("window");

const categories = [
  { name: "Quick Quizzes", icon: "flash-outline", color: "#FFF9E6", iconColor: "#FACC15" },
  { name: "Visual Puzzles", icon: "grid-outline", color: "#E6FFFA", iconColor: "#14B8A6" },
  { name: "Logic Challenges", icon: "location-outline", color: "#FFEAF2", iconColor: "#EC4899" },
  { name: "General Trivia", icon: "book-outline", color: "#EEF2FF", iconColor: "#6366F1" },
];

// ------------------- REUSABLE PUZZLE CARD -------------------
const PuzzleCard = ({
  title,
  subtitle,
  iconName,
  iconColor = THEME_COLOR,
  onPress,
  isActionable = true,
  showIndicator = true,
  indicatorText = "Start",
  backgroundColor = "rgba(162, 28, 175, 0.1)",
  borderColor = THEME_COLOR,
  category,
  isGrid = false,
  index = 0,
  attempted = false,
  gradientKey,
  isFree = false,
}) => {
  const cardBackground = isGrid
    ? attempted
      ? "rgba(162, 28, 175, 0.2)"
      : "#fff"
    : backgroundColor;

  const cardBorder = isGrid && attempted ? "#ff9900" : borderColor;

  return (
    <TouchableOpacity
      style={[
        isGrid ? verticalListStyles.cardWrapper : continueStyles.card,
        { backgroundColor: cardBackground, borderLeftColor: cardBorder },
        isGrid && index % 2 === 0 ? { marginRight: CARD_MARGIN } : null,
      ]}
      onPress={onPress}
      activeOpacity={isActionable ? 0.7 : 1}
    >
      {isGrid && (
        <View style={[StyleSheet.absoluteFill, { borderRadius: 12, overflow: "hidden" }]}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id={`cardGradient-${gradientKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <Stop offset="100%" stopColor="#f7f7f7" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#cardGradient-${gradientKey})`}
              rx="12"
              ry="12"
            />
          </Svg>
        </View>
      )}

      <View style={isGrid ? verticalListStyles.cardContent : continueStyles.textContainer}>
        {!isGrid && (
          <>
            {iconName && (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
                <Text style={[continueStyles.statusText, { marginLeft: 6 }]}>{title}</Text>
              </View>
            )}
            {!iconName && title && <Text style={continueStyles.statusText}>{title}</Text>}
            <Text style={continueStyles.subtitleText} numberOfLines={2}>
              {subtitle}
            </Text>
          </>
        )}

        {isGrid && (
          <>
            <Text style={verticalListStyles.puzzleName}>{title}</Text>

            <Text style={[verticalListStyles.puzzleName, { marginBottom: 4 }]} numberOfLines={2}>
              {subtitle}
            </Text>

            {category && <Text style={verticalListStyles.categoryText}>{category}</Text>}

            {/* Free/Premium Badge */}
            <View
              style={[
                verticalListStyles.freeBadge,
                { backgroundColor: isFree ? "#4CAF50" : "#FF5722" },
              ]}
            >
              <Text style={verticalListStyles.freeBadgeText}>
                {isFree ? "Free" : "Premium"}
              </Text>
            </View>

            {attempted && (
              <View style={verticalListStyles.attemptedBadge}>
                <Text style={verticalListStyles.attemptedBadgeText}>Attempted</Text>
              </View>
            )}

            <View style={verticalListStyles.startQuizButton}>
              <Text style={verticalListStyles.startQuizButtonText}>Start Quiz</Text>
            </View>
          </>
        )}
      </View>

      {showIndicator && !isGrid && (
        <View style={continueStyles.progressIndicator}>
          <Text style={continueStyles.progressText}>{indicatorText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ------------------- MAIN SCREEN -------------------
export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const [puzzles, setPuzzles] = useState([]);
  const [attemptedPuzzleIds, setAttemptedPuzzleIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const scrollRef = useRef(null);
  const currentOffset = useRef(0);

  const fetchPuzzles = async () => {
    try {
      const res = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all?userId=${user._id}`
      );
      setPuzzles(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not load puzzles");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptedPuzzles = async () => {
    try {
      const res = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/attempts/attempted-puzzles/${user._id}`
      );
      if (res.data.success) setAttemptedPuzzleIds(res.data.attemptedPuzzleIds);
    } catch (err) {
      console.error(err);
    }
  };

  const filterPuzzles = async (query) => {
    if (!query || query.trim() === "") {
      fetchPuzzles();
      return;
    }
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/search?q=${query}`
      );
      setPuzzles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.searchQuery !== undefined) {
      filterPuzzles(route.params.searchQuery);
    }
  }, [route.params?.searchQuery]);

  useEffect(() => {
    if (user?._id) {
      fetchPuzzles();
      fetchAttemptedPuzzles();
    }
  }, [user]);

  if (loading)
    return <ActivityIndicator size="large" color={THEME_COLOR} style={styles.loadingIndicator} />;

  // Scroll button handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      const newOffset = Math.max(currentOffset.current - (CARD_WIDTH + 20), 0);
      scrollRef.current.scrollTo({ x: newOffset, animated: true });
      currentOffset.current = newOffset;
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      const newOffset = currentOffset.current + (CARD_WIDTH + 20);
      scrollRef.current.scrollTo({ x: newOffset, animated: true });
      currentOffset.current = newOffset;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* Background SVG */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#f8f4fb" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#backgroundGradient)" />
          <Circle cx="10%" cy="5%" r="50" fill={THEME_COLOR} fillOpacity="0.15" />
          <Circle cx="95%" cy="30%" r="60" fill={THEME_COLOR} fillOpacity="0.1" />
          <Rect x="5%" y="60%" width="100" height="60" fill={THEME_COLOR} fillOpacity="0.08" rx="15" ry="15" />
          <Path d="M 0 400 Q 150 350 300 400 L 300 500 L 0 500 Z" fill={THEME_COLOR} fillOpacity="0.1" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LogoHeader />

        {searchLoading && <ActivityIndicator size="small" color={THEME_COLOR} style={{ marginBottom: 10 }} />}


        <View style={styles.header}>
        <Text style={styles.title}>Game Categories</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all →</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <View style={styles.grid}>
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.card, { backgroundColor: item.color }]}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={24} color={item.iconColor} />
            </View>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
        {puzzles.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.sectionTitle}>Popular Challenges</Text>
              <Text style={styles.sectionSubtitle} onPress={() => navigation.navigate("QuizzesScreen")}>View All →</Text>
            </View>

            <View>
              <ScrollView
                ref={scrollRef}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 12}
                snapToAlignment="start"
                onScroll={(e) => {
                  currentOffset.current = e.nativeEvent.contentOffset.x;
                }}
                scrollEventThrottle={16}
                contentContainerStyle={{
                  paddingHorizontal: PADDING_HORIZONTAL - 10,
                  paddingVertical: 8,
                  alignItems: "flex-start",
                }}
              >
                {puzzles.map((puzzle, index) => (
                  <View
                    key={puzzle._id}
                    style={{
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      marginRight: 12,
                      alignSelf: "flex-start",
                    }}
                  >
                    <PuzzleCard
                      subtitle={puzzle.name}
                      category={puzzle.category}
                      isGrid={true}
                      index={index}
                      attempted={attemptedPuzzleIds.includes(puzzle._id)}
                      onPress={() => navigation.navigate("PuzzleScreen", { puzzleId: puzzle._id })}
                      gradientKey={puzzle._id}
                      iconName="lightbulb-on-outline"
                      iconColor={PRIMARY_TEXT_COLOR}
                      isFree={puzzle.isFree}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Left Button */}
              <TouchableOpacity
                onPress={scrollLeft}
                activeOpacity={0.6}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "35%",
                  height: 60,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                }}
              >
                <Ionicons name="chevron-back" size={24} color={THEME_COLOR} />
              </TouchableOpacity>

              {/* Right Button */}
              <TouchableOpacity
                onPress={scrollRight}
                activeOpacity={0.6}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "35%",
                  height: 60,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                }}
              >
                <Ionicons name="chevron-forward" size={24} color={THEME_COLOR} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {puzzles.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 40, color: "#999" }}>
            No puzzles found.
          </Text>
        )}

         <Text style={styles.sectionTitle}>Today's Puzzle</Text>
        <PuzzleCard
          title="Today's Puzzle"
          subtitle="Stack Quiz"
          iconName="bullseye-arrow"
          onPress={() => navigation.navigate("StackQuizScreen", { puzzleId: "daily" })}
        />

      </ScrollView>
    </View>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  loadingIndicator: { flex: 1, justifyContent: "center" },
  scrollContent: { paddingBottom: 40, flexGrow: 1 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginTop: 20,
    marginBottom: 15,
    zIndex: 1,
    paddingHorizontal: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
    marginTop: 25,
    marginBottom: 15,
    zIndex: 1,
    paddingHorizontal: 5,
  },


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 18,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  viewAll: {
    fontSize: 14,
    color: "#a21caf",
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

    paddingHorizontal: 9,
  },
  card: {
    width: width / 2 - 20,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 8,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

});

const verticalListStyles = StyleSheet.create({
 
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: 'space-around', 
    alignItems: "flex-start"
  },

  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginBottom: CARD_MARGIN * 1.5,
    shadowColor: SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: CARD_BACKGROUND_COLOR, 
  },

  cardContent: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    justifyContent: "space-between",
    overflow: 'hidden',
    zIndex: 10,
  },
  
  puzzleName: { 
    fontSize: 18,
    fontWeight: "900",
    color: PRIMARY_TEXT_COLOR,
    lineHeight: 22,
  },
  categoryText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: SECONDARY_TEXT_COLOR, 
    marginTop: 6,
    opacity: 0.8,
  },

  attemptedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff9900",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    zIndex: 20,
    shadowColor: "#ff9900",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  attemptedBadgeText: { 
    color: "#fff", 
    fontSize: 10, 
    fontWeight: "800", 
    textTransform: 'uppercase' 
  },

  freeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: SECONDARY_BADGE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    zIndex: 20,
    shadowColor: SECONDARY_BADGE_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  freeBadgeText: { 
    color: "#fff", 
    fontSize: 10, 
    fontWeight: "800", 
    textTransform: 'uppercase' 
  },

  startQuizButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  startQuizButtonText: { 
    color: "#fff", 
    fontSize: 14,
    fontWeight: "800", 
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

});

const continueStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(162, 28, 175, 0.1)",
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR,
    marginBottom: 15,
  },
  textContainer: { flex: 1, marginRight: 10 },
  statusText: { fontSize: 14, fontWeight: "700", color: THEME_COLOR, marginBottom: 4 },
  subtitleText: { fontSize: 16, fontWeight: "800", color: PRIMARY_TEXT_COLOR, marginTop: 2 },
  progressIndicator: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  progressText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
