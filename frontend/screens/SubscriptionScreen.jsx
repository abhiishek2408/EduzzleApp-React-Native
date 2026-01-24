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
import SubscriptionSkeleton from "../components/SubscriptionSkeleton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

// --- Updated Theme Constants ---
const PRIMARY_COLOR_LIGHT = "#701a75"; 
const PRIMARY_COLOR_DARK = "#4a044e"; 
const SUCCESS_COLOR = "#4caf50";
const DISABLED_COLOR = "#e2e8f0"; // Light gray as per your request
const BACKGROUND_GRADIENT_START = "#fef9ff";
const BACKGROUND_GRADIENT_END = "#f3e5f9";
const TEXT_COLOR_DARK = "#2c3e50"; 
const CARD_GRADIENT_LIGHT = "#701a75"; // Match your theme
const CARD_GRADIENT_DARK = "#4a044e";  // Match your theme

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
        <SubscriptionSkeleton />
      </View>
    );
  }

  let currentPlan = null;
  let daysLeft = null;
  if (user?.subscription?.isActive && user?.subscription?.planId) {
    currentPlan = plans.find((p) => String(p._id) === String(user.subscription.planId));
    if (user.subscription.endDate) {
      const end = new Date(user.subscription.endDate);
      const today = new Date();
      daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
      // If plan expired, reset subscription so user can take a new plan
      if (daysLeft < 1) {
        user.subscription.isActive = false;
        user.subscription.planId = null;
        user.subscription.startDate = null;
        user.subscription.endDate = null;
          // Remove the stray null; statement
          // null; // This line is unnecessary and will be removed
      }
    }
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
        <View style={styles.header}>
          <MaterialCommunityIcons name="crown" size={40} color={PRIMARY_COLOR_LIGHT} />
          <Text style={styles.title}>Premium Plans</Text>
          <Text style={styles.subtitle}>Unlock exclusive features and boost your learning</Text>
        </View>

        {user?.subscription?.isActive && (
          (() => {
            const start = user.subscription.startDate ? new Date(user.subscription.startDate) : null;
            const end = user.subscription.endDate ? new Date(user.subscription.endDate) : null;
            const today = new Date();
            const daysLeft = end ? Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24))) : null;
            const planName = currentPlan?.name || "Active Plan";
            return (
              <LinearGradient
                colors={[PRIMARY_COLOR_LIGHT, PRIMARY_COLOR_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.currentPlanAttractive}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="star-circle" size={38} color="#fff" style={{ marginRight: 18 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.currentPlanLabelAttractive}>Current Plan</Text>
                    <Text style={styles.currentPlanValueAttractive}>{planName}</Text>
                    {(start || end) && (
                      <Text style={styles.currentPlanMetaAttractive}>
                        {start ? `Started ${start.toLocaleDateString()} • ` : ''}
                        {end ? `Ends ${end.toLocaleDateString()}` : ''}
                        {daysLeft !== null ? ` • ${daysLeft} days left` : ''}
                      </Text>
                    )}
                  </View>
                </View>
              </LinearGradient>
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

          const nameColor = isCurrentPlan ? "#fff" : PRIMARY_COLOR_LIGHT;
          const detailColor = isCurrentPlan ? "#f0e0f5" : TEXT_COLOR_DARK;
          const priceColor = isCurrentPlan ? "#fff" : PRIMARY_COLOR_DARK;

          const CardWrapper = ({ children }) =>
            isCurrentPlan ? (
              <LinearGradient
                colors={[CARD_GRADIENT_DARK, CARD_GRADIENT_LIGHT]} // Inverted for depth
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
                {isCurrentPlan && (
                  <View style={styles.activeBadge}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                )}

                <Text style={[styles.planName, { color: nameColor }]}>
                  {item.name}
                </Text>

                <View style={styles.priceContainer}>
                  <Text style={[styles.priceText, { color: priceColor }]}>
                    ₹{item.price}
                  </Text>
                  <Text style={[styles.durationText, { color: detailColor }]}>
                    / {item.durationInDays} days
                  </Text>
                </View>

                <View style={styles.featuresContainer}>
                  {[
                    "Unlimited Quiz Access",
                    "Exclusive Gaming Events",
                    "Ad-Free Experience",
                    "Priority Support"
                  ].map((feature, fIdx) => (
                    <View key={fIdx} style={styles.featureRow}>
                      <MaterialCommunityIcons 
                        name="check-circle" 
                        size={18} 
                        color={isCurrentPlan ? "#90ee90" : "#4caf50"} 
                      />
                      <Text style={[styles.featureText, { color: detailColor }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.separator} />

                {isCurrentPlan ? (
                  <View style={[styles.button, { backgroundColor: SUCCESS_COLOR, marginTop: 15 }]}>
                    <Text style={styles.buttonText}>
                      Active (Ends: {formattedEndDate})
                    </Text>
                  </View>
                ) : hasActiveSubscription ? (
                  <View style={[styles.button, styles.disabledButton, { marginTop: 15 }]}>
                    <Text style={[styles.buttonText, styles.disabledButtonText]}>
                      Cannot Subscribe
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("PlanDetail", { plan: item, userSubscription: user.subscription || {} })}
                  >
                    <LinearGradient
                      colors={[CARD_GRADIENT_DARK, CARD_GRADIENT_LIGHT]}
                      style={styles.button}
                    >
                      <MaterialCommunityIcons name="rocket-launch" size={20} color="#fff" style={{ marginRight: 8 }} />
                      <Text style={styles.buttonText}>Select Plan</Text>
                    </LinearGradient>
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
  currentPlanAttractive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: PRIMARY_COLOR_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  currentPlanLabelAttractive: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  currentPlanValueAttractive: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  currentPlanMetaAttractive: {
    marginTop: 2,
    color: '#f3c999',
    fontSize: 13,
    fontWeight: '600',
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
    color: PRIMARY_COLOR_DARK,
    marginTop: 2,
  },
  currentPlanMeta: {
    marginTop: 2,
    color: '#6b7280',
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
    color: PRIMARY_COLOR_LIGHT,
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
    shadowColor: PRIMARY_COLOR_DARK,
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
    backgroundColor: "#cbd5e1",
  },
  disabledButtonText: {
    color: "#64748b",
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