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

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const onChange = (key, value) => setForm({ ...form, [key]: value });

  const submit = async () => {
    if (!form.email || !form.password) {
        setError("Please fill all fields");
        setShowError(true);
        return;
    }
    try {
      const data = await login(form.email, form.password);
      if (data?.token) navigation.navigate("UserDashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
      setShowError(true);
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#4a044e','#701a75', '#4a044e']} style={styles.logoCircle}>
              <Ionicons name="lock-open" size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subHeading}>Sign in to continue your journey</Text>
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

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={submit}>
            <LinearGradient 
                colors={['#4a044e','#701a75', '#4a044e']} 
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 30,
    borderRadius: 35,
    shadowColor: "#701a75",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
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
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#4c1d95",
    height: "100%",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotText: {
    color: "#4a044e",
    fontSize: 14,
    fontWeight: "700",
  },
  button: {
    width: "100%",
    height: 55,
    borderRadius: 18,
    overflow: "hidden",
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
    marginTop: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
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