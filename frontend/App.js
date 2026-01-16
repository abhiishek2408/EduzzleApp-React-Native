import React, { useState } from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import AppNavigator from "./navigation/AppNavigator";
import AnimatedSplash from "./AnimatedSplash";

import { LogBox, StatusBar, Platform } from 'react-native';
LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);



export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <GameProvider>
        {/* Set status bar color globally */}
        <StatusBar
          backgroundColor="#4a044e"
          barStyle="light-content"
          translucent={false}
        />
        {showSplash ? (
          <AnimatedSplash onFinish={() => setShowSplash(false)} />
        ) : (
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        )}
      </GameProvider>
    </AuthProvider>
  );
}

