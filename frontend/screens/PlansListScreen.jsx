import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PlansListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://eduzzleapp-react-native.onrender.com/api/subscription/plans", {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  const handleSubscribe = async planId => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/avail",
        { planId, discountCode: selectedDiscount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      Alert.alert(
        "Subscribed!",
        `You have successfully subscribed to ${response.data.plan}.\nPrice Paid: ₹${response.data.finalPrice}`,
        [{ text: "OK", onPress: () => navigation.navigate("PremiumDashboard") }]
      );
      setSelectedDiscount("");
    } catch (error) {
      setLoading(false);
      console.error("Error subscribing:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
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

      <TextInput
        style={styles.input}
        placeholder="Enter discount code (optional)"
        value={selectedDiscount}
        onChangeText={setSelectedDiscount}
      />

      <FlatList
        data={plans}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            <Text style={styles.planName}>{item.name}</Text>
            <Text>Duration: {item.durationInDays} days</Text>
            <Text>Price: ₹{item.price}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleSubscribe(item._id)}>
              <Text style={styles.buttonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default PlansListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#a21caf", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 20 },
  planCard: { padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 15 },
  planName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  button: { marginTop: 10, backgroundColor: "#a21caf", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
