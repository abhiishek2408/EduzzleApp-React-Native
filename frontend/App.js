import React from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import AppNavigator from "./navigation/AppNavigator";
import { LogBox, StatusBar } from "react-native";

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <StatusBar
          backgroundColor="#4a044e"
          barStyle="light-content"
          translucent={false}
        />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
}
