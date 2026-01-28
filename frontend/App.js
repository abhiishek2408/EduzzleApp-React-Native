import React, { useContext, useEffect } from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import AppNavigator from "./navigation/AppNavigator";
import { LogBox, StatusBar } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated',
]);

function AppContent() {
  const { loading } = useContext(AuthContext);
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);
  // Don't render anything while splash is visible
  if (loading) return null;
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <SafeAreaProvider>
          <StatusBar
            backgroundColor="#1e0221"
            barStyle="light-content"
            translucent={false}
          />
          <AppContent />
        </SafeAreaProvider>
      </GameProvider>
    </AuthProvider>
  );
}