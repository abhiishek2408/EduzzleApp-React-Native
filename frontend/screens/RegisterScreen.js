import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigation = useNavigation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrorMsg("");
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const data = await register(form);
      if (data?.userId) {
        navigation.navigate("VerifyOtp", { userId: data.userId, email: form.email });
      } else {
        setErrorMsg(data?.message || "Unexpected error");
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Registration failed");
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
              <LinearGradient colors={['#4a044e','#701a75', '#4a044e']} style={styles.iconCircle}>
                <MaterialCommunityIcons name="account-plus" size={40} color="#fff" />
              </LinearGradient>
              <Text style={styles.heading}>Create Account</Text>
              <Text style={styles.subHeading}>Join us to start your learning journey</Text>
            </View>

            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#ef4444" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Input Section */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#a1a1aa"
                  value={form.name}
                  onChangeText={(text) => onChange("name", text)}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#a1a1aa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => onChange("email", text)}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#a1a1aa"
                  secureTextEntry={!isPasswordVisible}
                  value={form.password}
                  onChangeText={(text) => onChange("password", text)}
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
              style={[styles.button, loading && { opacity: 0.7 }]} 
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
                    <Text style={styles.buttonText}>Register Now</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 40,
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
    elevation: 10,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    transform: [{ rotate: '45deg' }], // Diamond shape effect
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4a044e",
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 5,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputIcon: {
    marginRight: 12,
    transform: [{ rotate: '-45deg' }], // Counter rotate if needed
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4c1d95",
    height: "100%",
  },
  button: {
    width: "100%",
    height: 55,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  footerText: {
    color: "#71717a",
    fontSize: 14,
  },
  linkText: {
    color: "#701a75",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});