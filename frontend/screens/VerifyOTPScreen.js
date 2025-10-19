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
