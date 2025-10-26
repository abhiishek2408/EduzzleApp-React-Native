import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PlansListScreen = ({ navigation }) => {
  const { token, user, refreshUser } = useContext(AuthContext); // 🔹 added refreshUser
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/plans",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlans(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching plans:", error);
      Alert.alert("Error", "Unable to fetch subscription plans.");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Navigate to PlanDetailScreen when user clicks a plan
  const handlePlanPress = (plan) => {
    navigation.navigate("PlanDetailScreen", {
      plan,
      userSubscription: user?.subscription || null,
    });
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
      <Text style={styles.title}>Available Plans</Text>

      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const hasActiveSubscription = user?.subscription?.isActive;
          const isCurrentPlan = hasActiveSubscription && user.subscription.planId === item._id;

          return (
            <View style={styles.planCard}>
              <Text style={styles.planName}>{item.name}</Text>
              <Text>Duration: {item.durationInDays} days</Text>
              <Text>Price: ₹{item.price}</Text>

              {isCurrentPlan ? (
                <View style={[styles.button, { backgroundColor: "#4caf50" }]}>
                  <Text style={styles.buttonText}>
                    Subscribed (Ends: {new Date(user.subscription.endDate).toLocaleDateString()})
                  </Text>
                </View>
              ) : hasActiveSubscription ? (
                <View style={[styles.button, { backgroundColor: "#ccc" }]}>
                  <Text style={styles.buttonText}>Cannot Subscribe</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handlePlanPress(item)}
                >
                  <Text style={styles.buttonText}>View / Subscribe</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default PlansListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#a21caf", textAlign: "center" },
  planCard: { padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 15 },
  planName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  button: { marginTop: 10, backgroundColor: "#a21caf", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
