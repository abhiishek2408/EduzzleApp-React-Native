// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export default function ResetPassword() {
//   const [password, setPassword] = useState("");
//   const navigation = useNavigation();
//   const route = useRoute();

//   // token and userId passed from email link / previous screen
//   const { token, userId } = route.params || {};

//   const submit = async () => {
//     if (!token || !userId) {
//       Alert.alert("Error", "Missing token or user ID.");
//       return;
//     }

//     try {
//       await axios.post("http://10.124.194.56:3000/api/auth/reset-password", {
//         userId,
//         token,
//         newPassword: password,
//       });

//       Alert.alert("Success", "Password reset successful");
//       navigation.navigate("Login");
//     } catch (err) {
//       Alert.alert("Error", err?.response?.data?.message || "Something went wrong");
//     }
//   };

//   useEffect(() => {
//     if (!token || !userId) {
//       // Allow manual entry if needed
//       Alert.alert("Notice", "Token or userId not provided. Please enter manually.");
//     }
//   }, [token, userId]);


// }


import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";


export default function ResetPasswordScreen() {
  const { resetPassword } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submit = async () => {
    try {
      // some APIs use email, some use userId — depends on your backend
      const data = await resetPassword(email, otp, newPassword);
      if (data?.message) {
        alert(data.message);
        navigation.navigate("Login"); // go back to login
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Password reset failed");
    }
  };

  // ... UI for OTP + new password input + submit button

    return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
  },
  button: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
