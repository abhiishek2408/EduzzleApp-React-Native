import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  const { userId, email } = route.params || {};

  const submit = async () => {
    if (!userId) {
      Alert.alert("Error", "No user ID. Please go back to Register.");
      return;
    }

    try {
      const res = await axios.post("https://eduzzleapp-react-native.onrender.com/api/auth/verify-otp", {
        userId,
        otp,
      });

      const token = res.data.token;
      await AsyncStorage.setItem("token", token);

      Alert.alert("Success", "Verified and logged in");
      navigation.navigate("Dashboard");
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.message || "Error verifying OTP");
    }
  };

  const resend = async () => {
    try {
      await axios.post("https://eduzzleapp-react-native.onrender.com/api/auth/resend-otp", { email });
      Alert.alert("Success", "OTP resent if email matches");
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.message || "Error resending OTP");
    }
  };

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

      <TouchableOpacity style={styles.linkButton} onPress={resend}>
        <Text style={styles.linkText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#007BFF",
    fontSize: 14,
  },
});
