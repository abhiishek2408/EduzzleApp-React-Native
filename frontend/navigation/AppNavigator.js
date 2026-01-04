import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AdminDashboard from "../screens/AdminDashboard";
import PlanDetailScreen from "../screens/PlanDetailScreen";
import UserDashboard from "../screens/UserDashboard";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import StackQuizScreen from "../screens/Puzzles/StackQuiz";
import LinkedListPuzzleScreen from "../screens/Puzzles/LinkedListPuzzle";
import BubbleSortPuzzleScreen from "../screens/Puzzles/BubbleSortPuzzle";
import BinaryTreePuzzleScreen from "../screens/Puzzles/BinaryTreePuzzle";
import FriendsScreen from '../screens/FriendsScreen.jsx';
import { AuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { token, role } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        role === "admin" ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <>
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
            <Stack.Screen name="StackQuizScreen" component={StackQuizScreen} />
            <Stack.Screen name="LinkedListPuzzleScreen" component={LinkedListPuzzleScreen} />
            <Stack.Screen name="BubbleSortPuzzleScreen" component={BubbleSortPuzzleScreen} />
            <Stack.Screen name="BinaryTreePuzzleScreen" component={BinaryTreePuzzleScreen} />
            <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
            <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
          </>
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOTPScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}


