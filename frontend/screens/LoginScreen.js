import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  // Pulsating effect for the loader
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [loading]);

  const onChange = (key, value) => setForm({ ...form, [key]: value });

  const submit = async () => {
    if (!form.email || !form.password) {
        setError("Please fill all fields");
        setShowError(true);
        return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data?.token) navigation.reset({
        index: 0,
        routes: [{ name: "UserNavigator", params: { screen: "Home" } }],
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#fdf4ff', '#fae8ff', '#f5d0fe']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Error Modal */}
      <Modal
        visible={showError}
        transparent
        animationType="fade"
        onRequestClose={() => setShowError(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>
            <Ionicons name="alert-circle" size={48} color="#e11d48" style={{ marginBottom: 10 }} />
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowError(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modern Loader Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loaderContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <LinearGradient colors={['#701a75', '#a21caf']} style={styles.loaderCircle}>
                <Ionicons name="finger-print" size={40} color="#fff" />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.loaderText}>Authenticating...</Text>
            <ActivityIndicator size="small" color="#701a75" />
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Logo Section - Reduced marginBottom */}
            <View style={styles.logoContainer}>
              <LinearGradient colors={['#4a044e','#701a75', '#a21caf']} style={styles.logoCircle}>
                <Ionicons name="lock-open" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subHeading}>Sign in to continue</Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#a1a1aa"
                  value={form.email}
                  onChangeText={(text) => onChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={20} color="#701a75" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#a1a1aa"
                  value={form.password}
                  onChangeText={(text) => onChange("password", text)}
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

            {/* Reduced Margin */}
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={submit}>
              <LinearGradient 
                  colors={['#4a044e','#701a75', '#a21caf']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                  style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Login Now</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>New here? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>Create Account</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 25,
    paddingVertical: 20, // Reduced from 30
    borderRadius: 30,
    shadowColor: "#701a75",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15, // Reduced from 30
  },
  logoCircle: {
    width: 60, // Reduced from 80
    height: 60, // Reduced from 80
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 24, // Reduced from 28
    fontWeight: "800",
    color: "#4a044e",
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 13,
    color: "#71717a",
    marginTop: 2,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50, // Reduced from 55
    marginBottom: 12, // Reduced from 16
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#4c1d95",
    height: "100%",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 15, // Reduced from 25
  },
  forgotText: {
    color: "#a21caf",
    fontSize: 13,
    fontWeight: "700",
  },
  button: {
    width: "100%",
    height: 50, // Reduced from 55
    borderRadius: 15,
    overflow: "hidden",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  footerText: {
    color: "#71717a",
    fontSize: 13,
  },
  linkText: {
    color: "#701a75",
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(74, 4, 78, 0.15)', // Tinted overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#701a75',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 15,
    width: 200,
  },
  loaderCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a044e',
    marginBottom: 10,
  },
  errorModal: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#e11d48',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    minWidth: 260,
    maxWidth: 320,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e11d48',
    marginBottom: 6,
  },
  errorMsg: {
    color: '#334155',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#e11d48',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 28,
    marginTop: 2,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});