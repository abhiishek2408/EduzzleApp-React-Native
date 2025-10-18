import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import AppNavigator from "./navigation/AppNavigator";

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);


export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <NavigationContainer>
         <AppNavigator />
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
}

