// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export default function VerifyOTP() {
//   const [otp, setOtp] = useState("");
//   const navigation = useNavigation();
//   const route = useRoute();

//   const { userId, email } = route.params || {};

//   useEffect(() => {
//     if (!userId || !email) {
//       console.warn("VerifyOTP: missing userId or email in params", route.params);
//       Alert.alert("Error", "Invalid access. Please register first.");
//       navigation.navigate("Register");
//     }
//   }, [userId, email]);

//   const submit = async () => {
//     if (!otp || otp.length !== 6) {
//       Alert.alert("Error", "Please enter a valid 6-digit OTP");
//       return;
//     }

//     try {
//       console.log("Submitting OTP:", { userId, otp });
//       const { data } = await axios.post("http://10.124.194.56:3000/api/auth/verify-otp", {
//         userId,
//         otp,
//       });

//       console.log("OTP verify response:", data);

//       if (data?.token) {
//         await AsyncStorage.setItem("token", data.token);
//         Alert.alert("Success", "Verified and logged in");
//         navigation.navigate("UserDashboard"); // or AdminDashboard based on your app logic
//       } else {
//         Alert.alert("Error", data?.message || "Unexpected response from server");
//       }
//     } catch (err) {
//       console.error("OTP verify error:", err.response?.data || err.message);
//       Alert.alert("Error", err.response?.data?.message || "Error verifying OTP");
//     }
//   };

//   const resend = async () => {
//     if (!email) {
//       Alert.alert("Error", "Email missing. Cannot resend OTP");
//       return;
//     }

//     try {
//       console.log("Resending OTP to:", email);
//       const { data } = await axios.post("http://10.124.194.56:3000/api/auth/resend-otp", { email });
//       console.log("Resend OTP response:", data);
//       Alert.alert("Success", "OTP resent if email matches");
//     } catch (err) {
//       console.error("Resend OTP error:", err.response?.data || err.message);
//       Alert.alert("Error", err.response?.data?.message || "Error resending OTP");
//     }
//   };


// }


import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";


export default function VerifyOtp() {
  const { verifyOtp } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, email } = route.params || {};
  const [otp, setOtp] = useState("");

  const submit = async () => {
    try {
      const data = await verifyOtp(userId, otp);
      if (data?.token) {
        navigation.navigate("UserDashboard");
      } else {
        alert(data?.message || "Verification failed");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Error verifying OTP");
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
