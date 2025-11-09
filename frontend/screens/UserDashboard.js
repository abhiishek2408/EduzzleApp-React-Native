// import React, { useContext } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import { Ionicons, FontAwesome } from "@expo/vector-icons";
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
// } from "@react-navigation/drawer";
// import { createStackNavigator } from "@react-navigation/stack";
// import { AuthContext } from "../context/AuthContext";

// import LogoHeader from "./LogoHeader";
// import HomeScreen from "./HomeScreen";
// import PlayScreen from "./PlayScreen";
// import ProfileScreen from "./ProfileScreen";
// import PuzzleScreen from "./PuzzleScreen";
// import ResultScreen from "./ResultScreen";
// import StackQuiz from "../screens/Puzzles/StackQuiz";
// import FriendsScreen from "./FriendsScreen";
// import SubscriptionScreen from "./SubscriptionScreen";
// import PlanDetailScreen from "./PlanDetailScreen";

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();

// // ------------------- Stack Navigator -------------------
// const StackScreens = ({ route, navigation }) => {
//   const initialScreen = route.params?.screen || "StackHome";

//   return (
//     <Stack.Navigator
//       initialRouteName={initialScreen}
//       screenOptions={{
//         headerTitle: () => <LogoHeader />,
//         headerStyle: { backgroundColor: "#a21caf" },
//         headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "500" },
//         headerLeft: () => (
//           <TouchableOpacity
//             style={{ marginLeft: 15 }}
//             onPress={() => navigation.openDrawer()}
//           >
//             <Ionicons name="filter-outline" size={24} color="black" />
//           </TouchableOpacity>
//         ),
//       }}
//     >
//       <Stack.Screen name="StackHome" component={HomeScreen} />
//       <Stack.Screen name="StackPlay" component={PlayScreen} />
//       <Stack.Screen name="StackProfile" component={ProfileScreen} />
//       <Stack.Screen name="StackFriends" component={FriendsScreen} />
//       <Stack.Screen name="PremiumDashboard" component={SubscriptionScreen} />
//       <Stack.Screen name="PuzzleScreen" component={PuzzleScreen} />
//       <Stack.Screen name="StackQuizScreen" component={StackQuiz} />
//       <Stack.Screen name="StackResult" component={ResultScreen} />
//       <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
//     </Stack.Navigator>
//   );
// };

// // ------------------- Custom Drawer -------------------
// function CustomDrawerContent(props) {
//   const { logout, user } = useContext(AuthContext);

//   const handleLogout = () => {
//     logout();
//     props.navigation.reset({
//       index: 0,
//       routes: [{ name: "Login" }],
//     });
//   };

//   const handleProfilePress = () => {
//     props.navigation.navigate("Profile", { screen: "StackProfile" });
//   };

//   const handleFriendsPress = () => {
//     props.navigation.navigate("Friends", { screen: "StackFriends" });
//   };

//   const handlePremiumPress = () => {
//     props.navigation.navigate("Home", { screen: "PremiumDashboard" });
//   };

//   return (
//     <DrawerContentScrollView
//       {...props}
//       contentContainerStyle={styles.drawerContainer}
//     >
//       {/* Profile Header */}
//       <TouchableOpacity
//         onPress={handleProfilePress}
//         style={styles.drawerHeader}
//       >
//         {user?.profilePic ? (
//           <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
//         ) : (
//           <FontAwesome name="user-circle" size={80} color="#a21caf" />
//         )}
//         <Text style={styles.drawerHeaderText}>{user?.name || "Welcome!"}</Text>
//       </TouchableOpacity>

//       {/* Quiz */}
//       <TouchableOpacity
//         style={styles.drawerItem}
//         onPress={() => props.navigation.navigate("Home", { screen: "StackHome" })}
//       >
//         <Ionicons name="book-outline" size={22} color="#a21caf" />
//         <Text style={styles.drawerItemText}>Quiz</Text>
//       </TouchableOpacity>

//       {/* Play */}
//       <TouchableOpacity
//         style={styles.drawerItem}
//         onPress={() => props.navigation.navigate("Play", { screen: "StackPlay" })}
//       >
//         <Ionicons name="game-controller-outline" size={22} color="#a21caf" />
//         <Text style={styles.drawerItemText}>Play</Text>
//       </TouchableOpacity>

//       {/* Friends */}
//       <TouchableOpacity style={styles.drawerItem} onPress={handleFriendsPress}>
//         <Ionicons name="people-outline" size={22} color="#a21caf" />
//         <Text style={styles.drawerItemText}>Friends</Text>
//       </TouchableOpacity>

//       {/* Premium Dashboard */}
//       <TouchableOpacity style={styles.drawerItem} onPress={handlePremiumPress}>
//         <Ionicons name="star-outline" size={22} color="#a21caf" />
//         <Text style={styles.drawerItemText}>Premium</Text>
//       </TouchableOpacity>

//       {/* Logout */}
//       <View style={styles.logoutContainer}>
//         <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={22} color="#ff4444" />
//           <Text style={[styles.drawerItemText, { color: "#ff4444" }]}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// // ------------------- Drawer Navigator -------------------
// export default function UserDashboard() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: { backgroundColor: "#fff8fc", width: 250 },
//       }}
//     >
//       <Drawer.Screen
//         name="Home"
//         component={StackScreens}
//         initialParams={{ screen: "StackHome" }}
//       />
//       <Drawer.Screen
//         name="Play"
//         component={StackScreens}
//         initialParams={{ screen: "StackPlay" }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={StackScreens}
//         initialParams={{ screen: "StackProfile" }}
//       />
//       <Drawer.Screen
//         name="Friends"
//         component={StackScreens}
//         initialParams={{ screen: "StackFriends" }}
//       />
//     </Drawer.Navigator>
//   );
// }

// // ------------------- Styles -------------------
// const styles = StyleSheet.create({
//   drawerContainer: { flex: 1, paddingVertical: 20, backgroundColor: "#fff8fc" },
//   drawerHeader: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2,
//     borderColor: "#a21caf",
//   },
//   drawerHeaderText: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#a21caf",
//   },
//   drawerItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 15,
//     marginHorizontal: 10,
//     marginVertical: 5,
//     backgroundColor: "#fde8ff",
//   },
//   drawerItemText: {
//     fontSize: 16,
//     marginLeft: 15,
//     color: "#4c1d95",
//     fontWeight: "600",
//   },
//   logoutContainer: {
//     flex: 1,
//     justifyContent: "flex-end",
//     marginTop: 50,
//     paddingHorizontal: 10,
//   },
// });



// import React from "react";
// import { TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createStackNavigator } from "@react-navigation/stack";

// import LogoHeader from "./LogoHeader";
// import HomeScreen from "./HomeScreen";
// import PlayScreen from "./PlayScreen";
// import ProfileScreen from "./ProfileScreen";
// import PuzzleScreen from "./PuzzleScreen";
// import ResultScreen from "./ResultScreen";
// import StackQuiz from "../screens/Puzzles/StackQuiz";
// import FriendsScreen from "./FriendsScreen";
// import SubscriptionScreen from "./SubscriptionScreen";
// import PlanDetailScreen from "./PlanDetailScreen";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();


// // ------------------- Stack Navigator -------------------
// const StackScreens = ({ route }) => {
//   const initialScreen = route.params?.screen || "StackHome";

//   return (
//     <Stack.Navigator
//       initialRouteName={initialScreen}
//       screenOptions={{
//         headerTitle: () => <LogoHeader />,
//         headerStyle: { backgroundColor: "#a21caf" },
//         headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "500" },
//       }}
//     >
//       <Stack.Screen name="StackHome" component={HomeScreen} />
//       <Stack.Screen name="StackPlay" component={PlayScreen} />
//       <Stack.Screen name="StackProfile" component={ProfileScreen} />
//       <Stack.Screen name="StackFriends" component={FriendsScreen} />
//       <Stack.Screen name="PremiumDashboard" component={SubscriptionScreen} />
//       <Stack.Screen name="PuzzleScreen" component={PuzzleScreen} />
//       <Stack.Screen name="StackQuizScreen" component={StackQuiz} />
//       <Stack.Screen name="StackResult" component={ResultScreen} />
//       <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
//     </Stack.Navigator>
//   );
// };


// // ------------------- Bottom Tab Navigator -------------------
// export default function UserDashboard() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: "#a21caf",
//         tabBarInactiveTintColor: "#666",
//         tabBarStyle: {
//           backgroundColor: "#fff8fc",
//           height: 60,
//           paddingBottom: 5,
//         },
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           switch (route.name) {
//             case "Home":
//               iconName = "home-outline";
//               break;
//             case "Play":
//               iconName = "game-controller-outline";
//               break;
//             case "Friends":
//               iconName = "people-outline";
//               break;
//             case "Profile":
//               iconName = "person-outline";
//               break;
//             default:
//               iconName = "ellipse-outline";
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={StackScreens}
//         initialParams={{ screen: "StackHome" }}
//       />
//       <Tab.Screen
//         name="Play"
//         component={StackScreens}
//         initialParams={{ screen: "StackPlay" }}
//       />
//       <Tab.Screen
//         name="Friends"
//         component={StackScreens}
//         initialParams={{ screen: "StackFriends" }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={StackScreens}
//         initialParams={{ screen: "StackProfile" }}
//       />
//     </Tab.Navigator>
//   );
// }


import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";

import LogoHeader from "./LogoHeader";
import HomeScreen from "./HomeScreen";
import PlayScreen from "./PlayScreen";
import ProfileScreen from "./ProfileScreen";
import PuzzleScreen from "./PuzzleScreen";
import ResultScreen from "./ResultScreen";
import StackQuiz from "../screens/Puzzles/StackQuiz";
import FriendsScreen from "./FriendsScreen";
import SubscriptionScreen from "./SubscriptionScreen";
import PlanDetailScreen from "./PlanDetailScreen";
import QuizScreen from "./QuizScreen";
import Notification from "./Notification";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ------------------- Stack Navigator -------------------
const StackScreens = ({ route }) => {
  const initialScreen = route.params?.screen || "StackHome";

  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{headerShown:false}}
    >
      <Stack.Screen name="StackHome" component={HomeScreen} />
      <Stack.Screen name="StackPlay" component={PlayScreen} />
      <Stack.Screen name="StackProfile" component={ProfileScreen} />
      <Stack.Screen name="StackFriends" component={FriendsScreen} />
      <Stack.Screen name="PremiumDashboard" component={SubscriptionScreen} />
      <Stack.Screen name="PuzzleScreen" component={PuzzleScreen} />
      <Stack.Screen name="StackQuizScreen" component={StackQuiz} />
      <Stack.Screen name="StackResult" component={ResultScreen} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <Stack.Screen name="QuizzesScreen" component={QuizScreen} />
      <Stack.Screen name="NotificationScreen" component={Notification} />
    </Stack.Navigator>
  );
};

// ------------------- Bottom Tab Navigator -------------------
export default function UserDashboard() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#a21caf",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff8fc",
          height: 60,
          paddingBottom: 5,
        },
        // ICON SETUP
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Play":
              iconName = "game-controller-outline";
              break;
            case "Friends":
              iconName = "people-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // LABEL DISPLAY ONLY WHEN ACTIVE
        tabBarLabel: ({ focused }) =>
          focused ? (
            <Text style={{ color: "#a21caf", fontSize: 12, fontWeight: "600" }}>
              {route.name}
            </Text>
          ) : null,
      })}
    >
      <Tab.Screen
        name="Home"
        component={StackScreens}
        initialParams={{ screen: "StackHome" }}
      />
      <Tab.Screen
        name="Play"
        component={StackScreens}
        initialParams={{ screen: "StackPlay" }}
      />
      <Tab.Screen
        name="Friends"
        component={StackScreens}
        initialParams={{ screen: "StackFriends" }}
      />
      <Tab.Screen
        name="Profile"
        component={StackScreens}
        initialParams={{ screen: "StackProfile" }}
      />
    </Tab.Navigator>
  );
}
