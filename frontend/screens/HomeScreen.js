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
// // Reduced CARD_WIDTH to make cards slightly smaller overall
// const CARD_WIDTH = (screenWidth - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / 2;
// // CARD HEIGHT remains 140
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
// }) => {
//   // Only apply attempted styling/different background logic for grid cards.
//   const cardBackground = isGrid
//     ? attempted // Check attempted status only if it's a grid card
//       ? "rgba(162, 28, 175, 0.2)"
//       : "#fff" // Grid cards always have a white/gradient background if not attempted
//     : backgroundColor; // Use default background for non-grid cards

//   // Only change border for attempted grid cards.
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
//       {/* Grid card background */}
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
//         {/* Icon & Title (Only shown for non-grid if it's the main status, for grid it's icon only) */}
//         {!isGrid && ( // Show Title/Icon/Subtitle for non-grid cards
//             <>
//                 {iconName && (
//                 <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
//                     <MaterialCommunityIcons name={iconName} size={20} color={iconColor} /> 
//                     <Text style={[continueStyles.statusText, { marginLeft: 6 }]}>{title}</Text>
//                 </View>
//                 )}
//                 {!iconName && title && <Text style={continueStyles.statusText}>{title}</Text>}
//                 <Text style={continueStyles.subtitleText} numberOfLines={2}>
//                     {subtitle}
//                 </Text>
//             </>
//         )}
        
//         {/* Grid Card Content (Icon/Title/Category/Start Button) */}
//         {isGrid && (
//             <>
//                 {/* Icon & Title */}
//                 {iconName && (
//                 <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
//                     <MaterialCommunityIcons name={iconName} size={20} color={iconColor} /> 
//                     <Text style={[continueStyles.statusText, { marginLeft: 6, color: PRIMARY_TEXT_COLOR }]}>{title}</Text>
//                 </View>
//                 )}
//                 {!iconName && title && <Text style={verticalListStyles.puzzleName}>{title}</Text>}

//                 {/* Subtitle */}
//                 <Text style={[verticalListStyles.puzzleName, { marginBottom: 4 }]} numberOfLines={2}>
//                     {subtitle}
//                 </Text>

//                 {/* Category for Grid cards */}
//                 {category && <Text style={verticalListStyles.categoryText}>{category}</Text>}

//                 {/* Attempted badge (Only visible for Grid cards) */}
//                 {attempted && (
//                 <View style={verticalListStyles.attemptedBadge}>
//                     <Text style={verticalListStyles.attemptedBadgeText}>Attempted</Text>
//                 </View>
//                 )}
                
//                 {/* "Start Quiz" button for Grid cards */}
//                 <View style={verticalListStyles.startQuizButton}>
//                     <Text style={verticalListStyles.startQuizButtonText}>
//                         Start Quiz
//                     </Text>
//                 </View>
//             </>
//         )}

//       </View>
      
//       {/* Indicator for non-grid cards (Moved outside text container for right alignment) */}
//       {showIndicator && !isGrid && (
//         <View style={continueStyles.progressIndicator}>
//           <Text style={continueStyles.progressText}>{indicatorText}</Text>
//           {/* Removed progressDot */}
//         </View>
//       )}

//     </TouchableOpacity>
//   );
// };

// // ------------------- MAIN SCREEN -------------------
// export default function HomeScreen({ navigation }) {
//   const { user } = useContext(AuthContext);
//   const [puzzles, setPuzzles] = useState([]);
//   const [lastUnsubmittedPuzzle, setLastUnsubmittedPuzzle] = useState(null);
//   const [attemptedPuzzleIds, setAttemptedPuzzleIds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all puzzles
//   const fetchPuzzles = async () => {
//     try {
//       const res = await axios.get(
//         `https://eduzzleapp-react-native.onrender.com/api/fetch-puzzles/all?userId=${user._id}`
//       );
//       const allPuzzles = res.data;
//       setPuzzles(allPuzzles);

//       const unsubmitted = allPuzzles.filter((p) => !p.isSubmitted);
//       setLastUnsubmittedPuzzle(unsubmitted.length ? unsubmitted[0] : null);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Could not load puzzles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch attempted puzzle IDs
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

//         {/* Continue Playing */}
//         <Text style={styles.sectionTitle}>Continue Playing</Text>
//         <PuzzleCard
//           title={lastUnsubmittedPuzzle ? "Your Current Challenge" : "All Puzzles Complete"}
//           subtitle={lastUnsubmittedPuzzle ? lastUnsubmittedPuzzle.name : "Start a New Challenge Below!"}
//           onPress={() =>
//             lastUnsubmittedPuzzle
//               ? navigation.navigate("PuzzleScreen", { puzzleId: lastUnsubmittedPuzzle._id })
//               : Alert.alert("Success!", "You have completed all available puzzles.")
//           }
//           isActionable={!!lastUnsubmittedPuzzle}
//           indicatorText={lastUnsubmittedPuzzle ? "Resume" : "Browse"}
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
//                   // Retained: attempted check for grid cards
//                   attempted={attemptedPuzzleIds.includes(puzzle._id)}
//                   onPress={() => navigation.navigate("PuzzleScreen", { puzzleId: puzzle._id })}
//                   gradientKey={puzzle._id} // Unique for each gradient
//                   iconName="lightbulb-on-outline"
//                   iconColor={PRIMARY_TEXT_COLOR}
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
//   cardContent: { 
//     flex: 1, 
//     padding: 12, 
//     borderRadius: 12, 
//     justifyContent: "space-between", 
//     zIndex: 10 
//   },
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
//     justifyContent: "space-between", // Ensures indicator stays on the right
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
//   subtitleText: { fontSize: 16, fontWeight: "800", color: PRIMARY_TEXT_COLOR, marginTop: 2 }, // Added subtitle style for consistency
  
//   // MODIFIED: Indicator is now a solid background button/badge
//   progressIndicator: { 
//       // Removed flexDirection: "row"
//       backgroundColor: THEME_COLOR, // Apply background color
//       paddingHorizontal: 10,
//       marginTop: 10,
//       paddingVertical: 4,
//       borderRadius: 12,
//       alignSelf: 'flex-start', // Important for vertical alignment
//   },
//   progressText: { 
//       fontSize: 12, // Reduced size for a compact look
//       fontWeight: "700", 
//       color: "#fff", // White text on theme background
//       // Removed marginRight: 8
//   },
//   // Removed progressDot as it's no longer needed
// });


import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import axios from "axios";
import Svg, { Rect, Defs, LinearGradient, Stop, Circle, Path } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { AuthContext } from "../context/AuthContext";

const THEME_COLOR = "#a21caf";
const PRIMARY_TEXT_COLOR = "#2d0c57";
const SECONDARY_TEXT_COLOR = "#4a4a6a";

const PADDING_HORIZONTAL = 20;
const CARD_MARGIN = 10;
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - 2 * PADDING_HORIZONTAL - CARD_MARGIN) / 2;
const CARD_HEIGHT = 140;

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
        <View style={[StyleSheet.absoluteFill, { borderRadius: 12, overflow: 'hidden' }]}>
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
            {/* {iconName && (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
                <Text style={[continueStyles.statusText, { marginLeft: 6, color: PRIMARY_TEXT_COLOR }]}>
                  {title}
                </Text>
              </View>
            )} */}

            
             <Text style={verticalListStyles.puzzleName}>{title}</Text>

            <Text style={[verticalListStyles.puzzleName, { marginBottom: 4 }]} numberOfLines={2}>
              {subtitle}
            </Text>

            {category && <Text style={verticalListStyles.categoryText}>{category}</Text>}

            {/* Free/Premium Badge */}
            <View style={[verticalListStyles.freeBadge, { backgroundColor: isFree ? "#4CAF50" : "#FF5722" }]}>
              <Text style={verticalListStyles.freeBadgeText}>{isFree ? "Free" : "Premium"}</Text>
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
  const [puzzles, setPuzzles] = useState([]);
  const [attemptedPuzzleIds, setAttemptedPuzzleIds] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user?._id) {
      fetchPuzzles();
      fetchAttemptedPuzzles();
    }
  }, [user]);

  if (loading)
    return <ActivityIndicator size="large" color={THEME_COLOR} style={styles.loadingIndicator} />;

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
        {/* Daily Puzzle */}
        <Text style={styles.sectionTitle}>Today's Puzzle</Text>
        <PuzzleCard
          title="Today's Puzzle"
          subtitle="Stack Quiz"
          iconName="bullseye-arrow"
          onPress={() => navigation.navigate("StackQuizScreen", { puzzleId: "daily" })}
        />

        {/* Grid Puzzles */}
        {puzzles.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Quizzes</Text>
            <View style={verticalListStyles.grid}>
              {puzzles.map((puzzle, index) => (
                <PuzzleCard
                  key={puzzle._id}
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
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  loadingIndicator: { flex: 1, justifyContent: "center" },
  scrollContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY_TEXT_COLOR,
    marginTop: 20,
    marginBottom: 15,
    zIndex: 1,
    paddingHorizontal: 5,
  },
});

const verticalListStyles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", width: "100%", alignItems: "flex-start" },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    marginBottom: CARD_MARGIN,
  },
  cardContent: { flex: 1, padding: 12, borderRadius: 12, justifyContent: "space-between", zIndex: 10 },
  puzzleName: { fontSize: 15, fontWeight: "800", color: PRIMARY_TEXT_COLOR },
  categoryText: { fontSize: 12, fontWeight: "600", color: SECONDARY_TEXT_COLOR, marginTop: 4 },
  attemptedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff9900",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 20,
  },
  attemptedBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  freeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 20,
  },
  freeBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  startQuizButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  startQuizButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
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
    alignSelf: 'flex-start',
  },
  progressText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
