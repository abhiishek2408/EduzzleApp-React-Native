import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import CardSkeleton from "../components/CardSkeleton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

// --- Design Constants ---
const PRIMARY_COLOR_LIGHT = "#a21caf"; // Original purple
const PRIMARY_COLOR_DARK = "#7b1fa2"; // Darker purple for gradient
const SUCCESS_COLOR = "#4caf50";
const DISABLED_COLOR = "#ccc";
const BACKGROUND_GRADIENT_START = "#fef9ff";
const BACKGROUND_GRADIENT_END = "#f3e5f9";
const TEXT_COLOR_DARK = "#2c3e50"; // Dark blue/gray for better readability
const CARD_GRADIENT_LIGHT = "#d946ef";
const CARD_GRADIENT_DARK = "#a21caf";

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
        <CardSkeleton />
      </View>
    );
  }

  // Find current plan details if user has an active subscription
  let currentPlan = null;
  if (user?.subscription?.isActive && user?.subscription?.planId) {
    currentPlan = plans.find((p) => String(p._id) === String(user.subscription.planId));
  }

  return (
    <LinearGradient
      colors={[BACKGROUND_GRADIENT_START, BACKGROUND_GRADIENT_END]}
      style={styles.container}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="crown" size={40} color="#a21caf" />
          <Text style={styles.title}>Premium Plans</Text>
          <Text style={styles.subtitle}>Unlock exclusive features and boost your learning</Text>
        </View>

        {/* Current Plan Display */}
        {user?.subscription?.isActive && (
          (() => {
            const start = user.subscription.startDate ? new Date(user.subscription.startDate) : null;
            const end = user.subscription.endDate ? new Date(user.subscription.endDate) : null;
            const today = new Date();
            const daysLeft = end ? Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24))) : null;
            const planName = currentPlan?.name || "Active Plan";
            return (
              <View style={styles.currentPlanSimple}>
                <MaterialCommunityIcons name="star-circle" size={22} color="#a21caf" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.currentPlanLabel}>Current Plan</Text>
                  <Text style={styles.currentPlanValue}>{planName}</Text>
                  {(start || end) && (
                    <Text style={styles.currentPlanMeta}>
                      {start ? `Started ${start.toLocaleDateString()} • ` : ''}
                      {end ? `Ends ${end.toLocaleDateString()}` : ''}
                      {daysLeft !== null ? ` • ${daysLeft} days left` : ''}
                    </Text>
                  )}
                </View>
              </View>
            );
          })()
        )}

        <View style={styles.plansContainer}>
        {plans.map((item) => {
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
          const detailColor = isCurrentPlan ? "#f0e0f5" : TEXT_COLOR_DARK;
          const priceColor = isCurrentPlan ? "#fff" : PRIMARY_COLOR_DARK;

          // Render a LinearGradient for the active plan, or a simple View for others
          const CardWrapper = ({ children }) =>
            isCurrentPlan ? (
              <LinearGradient
                colors={[CARD_GRADIENT_LIGHT, CARD_GRADIENT_DARK]}
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
            <View key={item._id} style={cardStyles}>
              <CardWrapper>
                {/* Active Badge */}
                {isCurrentPlan && (
                  <View style={styles.activeBadge}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
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

                {/* Feature List */}
                <View style={styles.featuresContainer}>
                  <View style={styles.featureRow}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={18} 
                      color={isCurrentPlan ? "#90ee90" : "#4caf50"} 
                    />
                    <Text style={[styles.featureText, { color: detailColor }]}>
                      Unlimited Quiz Access
                    </Text>
                  </View>
                  <View style={styles.featureRow}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={18} 
                      color={isCurrentPlan ? "#90ee90" : "#4caf50"} 
                    />
                    <Text style={[styles.featureText, { color: detailColor }]}>
                      Exclusive Gaming Events
                    </Text>
                  </View>
                  <View style={styles.featureRow}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={18} 
                      color={isCurrentPlan ? "#90ee90" : "#4caf50"} 
                    />
                    <Text style={[styles.featureText, { color: detailColor }]}>
                      Ad-Free Experience
                    </Text>
                  </View>
                  <View style={styles.featureRow}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={18} 
                      color={isCurrentPlan ? "#90ee90" : "#4caf50"} 
                    />
                    <Text style={[styles.featureText, { color: detailColor }]}>
                      Priority Support
                    </Text>
                  </View>
                </View>
                
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
                      styles.disabledButton,
                      { marginTop: 15 },
                    ]}
                  >
                    <Text style={[styles.buttonText, styles.disabledButtonText]}>
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
                    <MaterialCommunityIcons name="rocket-launch" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Select Plan</Text>
                  </TouchableOpacity>
                )}
              </CardWrapper>
            </View>
          );
        })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  currentPlanBox: {
    marginBottom: 18,
    marginHorizontal: 2,
  },
  currentPlanSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e5f5',
    marginBottom: 16,
  },
  currentPlanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#7b1fa2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
  currentPlanTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.3,
  },
  currentPlanLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  currentPlanValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4A148C',
    marginTop: 2,
  },
  currentPlanMeta: {
    marginTop: 2,
    color: '#6b7280',
    fontSize: 12,
  },
  currentPlanMetaLight: {
    marginTop: 4,
    color: '#f3e8ff',
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  chipAlt: {
    backgroundColor: '#ffffff22',
    borderWidth: 1,
    borderColor: '#ffffff66',
  },
  chipText: {
    marginLeft: 6,
    color: '#4b5563',
    fontWeight: '700',
    fontSize: 12,
  },
  container: { flex: 1 },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: BACKGROUND_GRADIENT_START,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
    color: "#a21caf",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  plansContainer: {
    marginTop: 10,
  },
  planCard: {
    marginBottom: 25,
    borderRadius: 20,
    shadowColor: "#a21caf",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  defaultPlanCard: {
    padding: 24,
    backgroundColor: "#fff",
  },
  activePlanGradient: {
    padding: 24,
  },
  dimmedCard: {
    opacity: 0.6,
  },
  planName: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 12,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 40,
    marginRight: 8,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  featuresContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#00000010',
    marginVertical: 18,
  },
  button: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR_LIGHT,
    shadowColor: PRIMARY_COLOR_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    minHeight: 48,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "900", 
    fontSize: 17,
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: DISABLED_COLOR,
    shadowColor: 'transparent',
  },
  disabledButtonText: {
    color: TEXT_COLOR_DARK,
    fontWeight: '700',
  },
  activeBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: SUCCESS_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  activeBadgeText: { 
    color: "#fff", 
    fontWeight: "900", 
    fontSize: 11, 
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});