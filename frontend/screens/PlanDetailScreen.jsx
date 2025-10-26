import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PlanDetailScreen = ({ route, navigation }) => {
  const { plan, userSubscription } = route.params;
  const { token, refreshUser } = useContext(AuthContext); // 🔹 added refreshUser
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/avail",
        { planId: plan._id, discountCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔹 Refresh user context immediately
      await refreshUser();

      setLoading(false);
      Alert.alert(
        "Subscribed!",
        `You have successfully subscribed to ${response.data.plan}.\nPrice Paid: ₹${response.data.finalPrice}`,
        [{ text: "OK", onPress: () => navigation.navigate("PremiumDashboard") }]
      );
    } catch (error) {
      setLoading(false);
      console.error(
        "Error subscribing:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#a21caf" />
      </View>
    );
  }

  // Check if user already has a subscription
  const hasActiveSubscription = userSubscription && userSubscription.isActive;
  const isCurrentPlan =
    hasActiveSubscription && userSubscription.planId === plan._id;

  return (
    <View style={styles.container}>
      <Text style={styles.planName}>{plan.name}</Text>
      <Text>Duration: {plan.durationInDays} days</Text>
      <Text>Price: ₹{plan.price}</Text>

      {isCurrentPlan ? (
        <View style={[styles.button, { backgroundColor: "#4caf50" }]}>
          <Text style={styles.buttonText}>
            Subscribed (Ends:{" "}
            {new Date(userSubscription.endDate).toLocaleDateString()})
          </Text>
        </View>
      ) : hasActiveSubscription ? (
        <View style={[styles.button, { backgroundColor: "#ccc" }]}>
          <Text style={styles.buttonText}>Cannot Subscribe</Text>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter discount code (optional)"
            value={discountCode}
            onChangeText={setDiscountCode}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#a21caf" }]}
            onPress={handleSubscribe}
          >
            <Text style={styles.buttonText}>Confirm Subscription</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PlanDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  planName: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#a21caf" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
