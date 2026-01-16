import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";

const API_URL = 'https://eduzzleapp-react-native.onrender.com';

export default function VerifyOtp() {
  const { verifyOtp } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, email } = route.params || {};
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

  const submit = async () => {
    try {
      const data = await verifyOtp(userId, otp);
      if (data?.token) {
        navigation.navigate("UserNavigator");
      } else {
        Alert.alert("Error", data?.message || "Verification failed");
      }
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.message || "Error verifying OTP");
    }
  };

  const resend = async () => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please register again.");
      return;
    }

    try {
      setResending(true);
      const response = await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
      Alert.alert("Success", response.data.message || "OTP has been resent to your email");
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  // ... UI same as before

    return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={resend} disabled={resending}>
        {resending ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <Text style={styles.linkText}>Resend OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fef9ff",
  },
  heading: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: "900",
    textAlign: "center",
    color: "#2d0c57",
  },
  input: {
    borderWidth: 2,
    borderColor: "#e9d5ff",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 8,
    fontWeight: "700",
    color: "#2d0c57",
    shadowColor: "#4a044e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#4a044e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4a044e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  linkText: {
    color: "#4a044e",
    fontSize: 15,
    fontWeight: "700",
  },
});
