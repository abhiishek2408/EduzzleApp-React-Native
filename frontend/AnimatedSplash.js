import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

const AnimatedSplash = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance: Fade and Scale up
    const entrance = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 12,
        friction: 4,
        useNativeDriver: true,
      }),
    ]);

    // Looping: Gentle float up and down
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    // Execute animations
    entrance.start(() => {
      floatLoop.start();
    });

    // Exit timer
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 3800);

    return () => {
      clearTimeout(timer);
      floatLoop.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Your Specific 4-Color Gradient */}
    

   
     
        <View style={styles.imageWrapper}>
          <Animated.Image 
            source={require("./assets/appicon1.png")} 
            style={styles.logo} 
          />
        </View>
{/* 
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Eduzzle</Text>
          <View style={styles.accentLine} />
          <Text style={styles.tagline}>Gamify Your Learning!</Text>
        </View> */}
    

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.loadingDots}>
            <Text style={styles.version}>PREPARING YOUR WORLD</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a044e',
  },
  glowCircle: {
    position: 'absolute',
    borderRadius: 150,

  
  },
  imageWrapper: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    marginBottom: 25,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ffffffff',
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 25,
  },
  textWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 54,
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: '#f5d0fe',
    borderRadius: 2,
    marginVertical: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#f5d0fe',
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  version: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  }
});

export default AnimatedSplash;