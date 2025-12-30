import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Entrance Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const submit = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      console.log("[ForgotPasswordScreen] forgotPassword response:", data);
      if (data?.message) {
        alert(data.message);
        if (!data.userId) {
          alert("No userId returned from backend. Please check backend /forgot-password response.");
          return;
        }
        // Pass userId to ResetPassword screen
        navigation.navigate("ResetPassword", { email, userId: data.userId });
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send reset OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#fdf4ff', '#fae8ff', '#f5d0fe']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Illustration Icon */}
          <View style={styles.headerSection}>
            <View style={styles.iconBackground}>
              <MaterialCommunityIcons name="lock-reset" size={50} color="#701a75" />
            </View>
            <Text style={styles.heading}>Reset Password</Text>
            <Text style={styles.subHeading}>
              Enter your email and we'll send you an OTP to reset your password.
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-unread-outline" size={20} color="#701a75" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="#a1a1aa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.button} 
            onPress={submit}
            disabled={loading}
          >
            <LinearGradient 
                colors={['#4a044e','#701a75', '#4a044e']} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {loading ? "Sending..." : "Send Reset OTP"}
              </Text>
              {!loading && <Ionicons name="paper-plane-outline" size={18} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Login")}
          >
            <View style={styles.backRow}>
                <Ionicons name="arrow-back" size={16} color="#701a75" />
                <Text style={styles.linkText}>Back to Login</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width > 500 ? 400 : "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 35,
    borderRadius: 40,
    shadowColor: "#701a75",
    shadowOpacity: 0.12,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 15 },
    elevation: 12,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 35,
  },
  iconBackground: {
    width: 100,
    height: 100,
    backgroundColor: '#fdf4ff',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fae8ff',
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: "#4a044e",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 14,
    color: "#71717a",
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#f1f5f9",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4c1d95",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  linkText: {
    color: "#701a75",
    fontSize: 15,
    fontWeight: "700",
  },
});