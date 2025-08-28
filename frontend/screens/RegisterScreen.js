import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigation = useNavigation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrorMsg("");
  };

  const submit = async () => {
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
     <View style={styles.container}>
      

      <View style={styles.card}>
        <Text style={styles.logo}>📝</Text>
        <Text style={styles.title}>Register</Text>
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => onChange("name", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => onChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => onChange("password", text)}
        />

        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Added login link */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkButton}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#a21caf",
    marginBottom: 20,
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
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  star: {
    position: "absolute",
  },
  starIcon: {
    fontSize: 32,
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#a855f7",
    fontSize: 14,
    fontWeight: "600",
  },
});
