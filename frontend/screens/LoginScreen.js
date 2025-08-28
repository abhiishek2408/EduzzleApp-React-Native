import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // <- icons

const { width } = Dimensions.get("window");

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [form, setForm] = useState({ email: "", password: "" });

  // Star animations
  const star1 = useRef(new Animated.Value(0)).current;
  const star2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatStar = (star, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star, { toValue: -20, duration: 2000, delay, useNativeDriver: true }),
          Animated.timing(star, { toValue: 20, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    };
    floatStar(star1, 0);
    floatStar(star2, 1000);
  }, []);

  const onChange = (key, value) => setForm({ ...form, [key]: value });

  const submit = async () => {
    try {
      const data = await login(form.email, form.password);
      if (data?.token) navigation.navigate("UserDashboard");
    } catch (err) {
      alert(err?.message || "Login failed");
    }
  };

  return (
     <View style={styles.container}>

     
      <View style={styles.card}>
        <Ionicons name="lock-closed-outline" size={48} color="#a21caf" style={styles.logo} />
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => onChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={form.password}
          onChangeText={(text) => onChange("password", text)}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fdf6ff",
  },
  card: {
    width: width > 500 ? 400 : "100%",
    backgroundColor: "#fff8fc",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 2,
    borderColor: "#ffd6fa",
  },
  logo: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#a21caf",
    marginBottom: 24,
    fontFamily: "cursive",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fde8ff",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    color: "#4c1d95",
    borderWidth: 1,
    borderColor: "#f0abfc",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotText: {
    color: "#a855f7",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#a21caf",
    paddingVertical: 14,
    borderRadius: 20,
    width: "100%",
    marginBottom: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#a855f7",
    fontSize: 14,
    fontWeight: "600",
  },
  star: {
    position: "absolute",
  },
});

