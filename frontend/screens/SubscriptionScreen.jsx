import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// Import LinearGradient for a premium look
import LinearGradient from "react-native-linear-gradient"; 

// --- Design Constants ---
const PRIMARY_COLOR_LIGHT = "#a21caf"; // Original purple
const PRIMARY_COLOR_DARK = "#7b1fa2"; // Darker purple for gradient
const SUCCESS_COLOR = "#4caf50";
const DISABLED_COLOR = "#ccc";
const BACKGROUND_GRADIENT_START = "#f0f4f8";
const BACKGROUND_GRADIENT_END = "#e0e7ee";
const TEXT_COLOR_DARK = "#2c3e50"; // Dark blue/gray for better readability

const SubscriptionScreen = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/plans",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR_LIGHT} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[BACKGROUND_GRADIENT_START, BACKGROUND_GRADIENT_END]}
      style={styles.container}
    >
      <Text style={styles.title}>Unlock Premium Learning</Text>

      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const userSub = user.subscription;
          const hasActiveSubscription = userSub && userSub.isActive;
          const isCurrentPlan =
            hasActiveSubscription && userSub.planId === item._id;

          const formattedEndDate = isCurrentPlan
            ? new Date(userSub.endDate).toLocaleDateString()
            : null;

          const cardStyles = [
            styles.planCard,
            !isCurrentPlan && hasActiveSubscription && styles.dimmedCard,
          ];

          // Determine content colors based on whether the card is active
          const nameColor = isCurrentPlan ? "#fff" : PRIMARY_COLOR_LIGHT;
          const detailColor = isCurrentPlan ? "#e0e0e0" : TEXT_COLOR_DARK;
          const priceColor = isCurrentPlan ? "#fff" : PRIMARY_COLOR_DARK;

          // Render a LinearGradient for the active plan, or a simple View for others
          const CardWrapper = ({ children }) =>
            isCurrentPlan ? (
              <LinearGradient
                colors={[PRIMARY_COLOR_LIGHT, PRIMARY_COLOR_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activePlanGradient}
              >
                {children}
              </LinearGradient>
            ) : (
              <View style={styles.defaultPlanCard}>{children}</View>
            );

          return (
            <View style={cardStyles}>
              <CardWrapper>
                {/* Active Badge */}
                {isCurrentPlan && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>YOUR PLAN</Text>
                  </View>
                )}

                {/* Plan Name */}
                <Text style={[styles.planName, { color: nameColor }]}>
                  {item.name}
                </Text>

                {/* Price and Duration */}
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceText, { color: priceColor }]}>
                    ₹{item.price}
                  </Text>
                  <Text style={[styles.durationText, { color: detailColor }]}>
                    / {item.durationInDays} days
                  </Text>
                </View>

                {/* Other Details */}
                <Text style={[styles.detailText, { color: detailColor }]}>
                  All Features Unlocked
                </Text>
                
                <View style={styles.separator} />

                {/* Action Button/Status */}
                {isCurrentPlan ? (
                  <View
                    style={[
                      styles.button,
                      { backgroundColor: SUCCESS_COLOR, marginTop: 15 },
                    ]}
                  >
                    <Text style={styles.buttonText}>
                      Active (Ends: {formattedEndDate})
                    </Text>
                  </View>
                ) : hasActiveSubscription ? (
                  <View
                    style={[
                      styles.button,
                      { backgroundColor: DISABLED_COLOR, marginTop: 15 },
                    ]}
                  >
                    <Text style={[styles.buttonText, { color: TEXT_COLOR_DARK }]}>
                      Cannot Subscribe
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("PlanDetail", {
                        plan: item,
                        userSubscription: user.subscription,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Select Plan</Text>
                  </TouchableOpacity>
                )}
              </CardWrapper>
            </View>
          );
        }}
      />
    </LinearGradient>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: BACKGROUND_GRADIENT_START, // Simple color for loader screen
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 40,
    marginBottom: 25,
    color: TEXT_COLOR_DARK,
    textAlign: "center",
  },
  planCard: {
    marginBottom: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden', // Ensures gradient respects border radius
  },
  defaultPlanCard: {
    padding: 20,
    backgroundColor: "#fff",
  },
  activePlanGradient: {
    padding: 20,
  },
  dimmedCard: {
    opacity: 0.7,
  },
  planName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 10,
    marginBottom: 15,
  },
  priceText: {
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 34,
    marginRight: 5,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#ffffff30',
    marginVertical: 15,
  },
  button: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR_LIGHT,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 17 
  },
  activeBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: SUCCESS_COLOR,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderBottomLeftRadius: 15,
    zIndex: 1,
  },
  activeBadgeText: { 
    color: "#fff", 
    fontWeight: "900", 
    fontSize: 11, 
    textTransform: 'uppercase'
  },
});