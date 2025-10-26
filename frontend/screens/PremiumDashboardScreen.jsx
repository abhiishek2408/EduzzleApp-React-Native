import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PremiumDashboardScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  // Fetch user subscription on mount
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/my-subscription",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscription(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching subscription:", error.response?.data || error.message);
      Alert.alert("Error", "Unable to fetch subscription details.");
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleRenew = async () => {
    if (!subscription?.planId) return;

    try {
      setRenewLoading(true);
      const response = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/renew",
        { planId: subscription.planId, discountCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRenewLoading(false);
      setSubscription(prev => ({
        ...prev,
        endDate: response.data.newEndDate,
        finalPrice: response.data.finalPrice,
        discountApplied: response.data.discountApplied
      }));

      Alert.alert(
        "Subscription Renewed",
        `Your ${response.data.plan} subscription is renewed!\nNew End Date: ${new Date(response.data.newEndDate).toLocaleDateString()}\nPrice Paid: ₹${response.data.finalPrice} ${response.data.discountApplied ? `(Discount: ${response.data.discountApplied})` : ""}`
      );
      setDiscountCode("");
    } catch (error) {
      setRenewLoading(false);
      console.error("Error renewing subscription:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  const calculateDaysRemaining = endDate => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#a21caf" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {subscription ? (
        <>
          <Text style={styles.title}>Your Premium Subscription</Text>
          <Text style={styles.info}>Plan: {subscription.planName}</Text>
          <Text style={styles.info}>Start Date: {new Date(subscription.startDate).toLocaleDateString()}</Text>
          <Text style={styles.info}>End Date: {new Date(subscription.endDate).toLocaleDateString()}</Text>
          <Text style={styles.info}>Days Remaining: {calculateDaysRemaining(subscription.endDate)}</Text>
          <Text style={styles.info}>Price Paid: ₹{subscription.finalPrice}</Text>
          {subscription.discountApplied && <Text style={styles.info}>Discount Applied: {subscription.discountApplied}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Enter discount code (optional)"
            value={discountCode}
            onChangeText={setDiscountCode}
          />

          <TouchableOpacity style={styles.button} onPress={handleRenew} disabled={renewLoading}>
            {renewLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Renew Now</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noSubscription}>You currently have no active subscription.</Text>
      )}
    </View>
  );
};

export default PremiumDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a21caf",
    marginBottom: 20,
    textAlign: "center"
  },
  info: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 20
  },
  button: {
    backgroundColor: "#a21caf",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  noSubscription: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "#555"
  }
});
