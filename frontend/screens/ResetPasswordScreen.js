
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function ResetPasswordScreen() {
  const { resetPassword } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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
    if (!otp || !newPassword) {
      alert("Please fill in both OTP and New Password");
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword(email, otp, newPassword);
      if (data?.message) {
        alert(data.message);
        navigation.navigate("Login");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Password reset failed");
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
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="shield-key-outline" size={45} color="#701a75" />
              </View>
              <Text style={styles.heading}>Set New Password</Text>
              <Text style={styles.subHeading}>
                Check your email <Text style={styles.emailText}>{email}</Text> for the reset code.
              </Text>
            </View>

            {/* OTP Input Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Enter 6-Digit Code</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="keypad-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Verification Code"
                  placeholderTextColor="#a1a1aa"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <Text style={styles.fieldLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#a1a1aa"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                  <Ionicons 
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                    size={20} color="#701a75" 
                  />
                </TouchableOpacity>
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
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Update Password</Text>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width > 500 ? 400 : "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 30,
    borderRadius: 35,
    shadowColor: "#701a75",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#fdf4ff',
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fae8ff',
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: "#4a044e",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    color: "#71717a",
    textAlign: 'center',
    lineHeight: 20,
  },
  emailText: {
    color: "#701a75",
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#701a75",
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
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
    height: 55,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 15,
  },
  gradientButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  cancelButton: {
    alignItems: "center",
    padding: 10,
  },
  cancelText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  }
});