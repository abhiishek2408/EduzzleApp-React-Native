import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar } from "react-native";
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

const SplashScreen = ({ onFinish }) => {
  const [fontsLoaded] = useFonts({
    'Josefin-Regular': JosefinSans_400Regular,
    'Josefin-Bold': JosefinSans_700Bold,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fontsLoaded) {
      // Fade In
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Fade Out and Finish
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          if (onFinish) onFinish();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={[styles.container, { backgroundColor: '#4a044e' }]} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      

        <View style={styles.titleWrapper}>
          <Text style={styles.brandTitle}>
            <Text style={[styles.brandTitle, styles.colorAccent]}>Edu</Text>
            <Text style={[styles.brandTitle, styles.whiteText]}>zzle</Text>
          </Text>
          <View style={styles.brandDot} />
        </View>
        <Text style={styles.brandSubtitle}>Learn • Play • Win</Text>
  
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.progressTrack}>
          <View style={styles.progressBar} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a044e', // Deep purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandTitle: {
    fontFamily: 'Josefin-Bold',
    fontSize: 52,
    textAlign: 'center',
      letterSpacing: -1,
    lineHeight: 52, // Reduce gap between lines (set equal to fontSize)
    letterSpacing: 0, // Reduce character spacing
  },
  colorAccent: {
    color: '#f3c999',
  },
  whiteText: {
    color: '#FFFFFF',
  },
  brandDot: {
    width: 8,
    height: 8,
    backgroundColor: '#f3c999',
    borderRadius: 6,
    marginLeft: -6,
    top: -24,
  },
  brandSubtitle: {
    fontFamily: 'Josefin-Regular',
    fontSize: 14,
    color: '#f3c999',
    fontWeight: '600',
    letterSpacing: 2, // Increased spacing for a high-end look
    marginTop: -5,
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  progressTrack: {
    width: 140,
    height: 2, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
  },
  progressBar: {
    width: '35%', 
    height: '100%',
    backgroundColor: '#f3c999',
    borderRadius: 1,
  }
});

export default SplashScreen;