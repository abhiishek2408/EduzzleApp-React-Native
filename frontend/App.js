import React, { useContext, useEffect } from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import AppNavigator from "./navigation/AppNavigator";
import { LogBox, StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";

// 🔒 Keep splash visible until we hide it manually
SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated",
]);

function AppContent() {
  const { loading } = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    "Josefin-Regular": JosefinSans_400Regular,
    "Josefin-Bold": JosefinSans_700Bold,
  });

  useEffect(() => {
    if (!loading && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loading, fontsLoaded]);

  // ⛔ Render nothing while splash is visible
  if (loading || !fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#1e0221" }} />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast />
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
