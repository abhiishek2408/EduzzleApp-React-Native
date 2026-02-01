import React, { useState, useContext, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated,
  Keyboard,
  StatusBar,
} from "react-native";
import axios from "axios";
import ConfettiCannon from 'react-native-confetti-cannon';
import { AuthContext } from "../context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import RazorpayCheckout from "react-native-razorpay";

const { width } = Dimensions.get("window");

const PlanDetailScreen = ({ route, navigation }) => {
  const { plan, userSubscription } = route.params;
  const { token, user, refreshUser } = useContext(AuthContext);

  // States
  const [discountCode, setDiscountCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentError, setPaymentError] = useState({ show: false, msg: "" });
  const [finalPrice, setFinalPrice] = useState(plan.price);
  const [discountPercent, setDiscountPercent] = useState(null);

  const showApplyButton = isApplied || discountCode.trim().length > 0;

  // Animation Refs
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // 1. Promo Code Logic
  const handleApplyPromo = async () => {
    if (!discountCode.trim()) {
      alert("Please enter a promo code.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/discount",
        {
          planId: plan._id,
          discountCode: discountCode.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      setIsApplied(true);
      setShowConfetti(true);
      Keyboard.dismiss();
      setTimeout(() => setShowConfetti(false), 3000);
      
      if (res.data && typeof res.data.finalPrice === 'number') {
        setFinalPrice(res.data.finalPrice);
      }
      if (res.data && typeof res.data.discountPercent === 'number') {
        setDiscountPercent(res.data.discountPercent);
      } else if (res.data && res.data.discount) {
        setDiscountPercent(res.data.discount);
      }
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Invalid or expired promo code.");
    }
  };

  // 2. Success Animation Trigger
  const triggerSuccess = () => {
    setShowSuccessModal(true);
    Animated.spring(checkmarkScale, {
      toValue: 1,
      tension: 20,
      friction: 3,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate("PremiumDashboard");
    }, 4000);
  };

  // 3. Payment Logic
  const createOrderAndPay = async () => {
    try {
      setLoading(true);
      const amountToPay = isApplied ? finalPrice : plan.price;
      const orderRes = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/payment/create-order",
        { planId: plan._id, discountCode: isApplied ? discountCode.trim() : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        description: `${plan.name} Plan`,
        currency: orderRes.data.currency,
        key: orderRes.data.key,
        amount: orderRes.data.amount,
        name: "Eduzzle",
        order_id: orderRes.data.orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#701a75" },
      };

      const paymentRes = await RazorpayCheckout.open(options);

      await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/payment/verify",
        {
          razorpay_order_id: paymentRes.razorpay_order_id,
          razorpay_payment_id: paymentRes.razorpay_payment_id,
          razorpay_signature: paymentRes.razorpay_signature,
          planId: plan._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshUser?.();
      setLoading(false);
      triggerSuccess();
    } catch (error) {
      setLoading(false);
      const msg = error?.description || error?.message || "Failed to initiate payment";
      setPaymentError({ show: true, msg });
    }
  };

  const hasActiveSubscription = userSubscription?.isActive;
  const isCurrentPlan = hasActiveSubscription && userSubscription.planId === plan._id;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {showConfetti && <ConfettiCannon count={200} origin={{x: -10, y: 0}} fadeOut={true} />}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.floatingBack} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#701a75" />
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
             <MaterialCommunityIcons name="lightning-bolt" size={50} color="#a21caf" />
          </View>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planTagline}>Unlock your full learning potential</Text>
        </View>

        {/* PRICE CARD */}
        <LinearGradient 
          colors={["#4a044e", "#701a75", "#86198f"]} 
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          style={styles.priceCard}
        >
          <Text style={styles.priceLabel}>Investment Amount</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceAmount}>{isApplied ? finalPrice : plan.price}</Text>
          </View>
          {isApplied && discountPercent && (
            <Text style={styles.discountText}>✨ {discountPercent}% DISCOUNT APPLIED ✨</Text>
          )}
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{plan.durationInDays} Days Unlimited Access</Text>
          </View>
        </LinearGradient>

        {/* PERKS */}
        <View style={styles.perksContainer}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          {[
            { icon: "infinite", text: "Unlimited Puzzles & Quizzes" },
            { icon: "stopwatch-outline", text: "No Daily Time Limits" },
            { icon: "rocket-outline", text: "Ad-Free Learning Experience" }
          ].map((item, i) => (
            <View key={i} style={styles.perkItem}>
              <View style={styles.perkIconBg}><Ionicons name={item.icon} size={20} color="#701a75" /></View>
              <Text style={styles.perkText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* PROMO BOX */}
        {!isCurrentPlan && !hasActiveSubscription && (
           <View style={[styles.promoBox, isApplied && styles.promoBoxSuccess]}>
              <TextInput
                style={styles.promoInput}
                placeholder={isApplied ? "Code Applied Successfully!" : "Have a Promo Code?"}
                placeholderTextColor={isApplied ? "#10b981" : "#94a3b8"}
                value={discountCode}
                onChangeText={setDiscountCode}
                editable={!isApplied}
                autoCapitalize="characters"
              />
              {showApplyButton && (
                <TouchableOpacity 
                  style={[styles.applyBtn, isApplied && styles.applyBtnSuccess]} 
                  onPress={handleApplyPromo}
                  disabled={isApplied || loading}
                >
                  {loading ? <ActivityIndicator size="small" color="#fff" /> : 
                  <Text style={styles.applyBtnText}>{isApplied ? "Saved" : "Apply"}</Text>}
                </TouchableOpacity>
              )}
           </View>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <View style={styles.bottomBar}>
          {isCurrentPlan ? (
            <View style={styles.activeBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.activeText}>Subscribed until {new Date(userSubscription.endDate).toLocaleDateString()}</Text>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.payButton, (loading || hasActiveSubscription) && styles.disabledBtn]}
                onPress={createOrderAndPay}
                disabled={loading || hasActiveSubscription}
              >
                {loading ? <ActivityIndicator color="#fff" /> :
                  <Text style={styles.payButtonText}>{hasActiveSubscription ? "Active" : "Pay Now"}</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.successCard}>
            <ConfettiCannon count={150} origin={{x: width/2, y: 0}} />
            <Animated.View style={[styles.checkmarkCircle, { transform: [{ scale: checkmarkScale }] }]}>
              <Ionicons name="checkmark" size={60} color="#10b981" />
            </Animated.View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSub}>Your premium features are now unlocked.</Text>
            <View style={styles.loaderLine}>
                <ActivityIndicator color="#f5d0fe" size="small" />
                <Text style={styles.redirectText}>REDIRECTING TO DASHBOARD...</Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* PAYMENT ERROR MODAL */}
      <Modal visible={paymentError.show} transparent animationType="fade">
        <View style={styles.errorOverlay}>
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorTitle}>Payment Failed</Text>
            <Text style={styles.errorMsg}>{paymentError.msg}</Text>
            <TouchableOpacity
              style={styles.errorBtn}
              onPress={() => setPaymentError({ show: false, msg: "" })}
            >
              <Text style={styles.errorBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 130, paddingHorizontal: 25 },
  floatingBack: { marginTop: 50, width: 45, height: 45, borderRadius: 15, backgroundColor: "#fdf4ff", justifyContent: "center", alignItems: "center" },
  heroSection: { alignItems: "center", marginTop: 20, marginBottom: 25 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#fdf4ff", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  planName: { fontSize: 30, fontWeight: "900", color: "#4a044e" },
  planTagline: { fontSize: 14, color: "#64748b", marginTop: 5 },
  priceCard: { borderRadius: 30, padding: 30, alignItems: "center", elevation: 12, shadowColor: "#701a75", shadowOpacity: 0.3, shadowRadius: 15 },
  priceLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "700", textTransform: "uppercase" },
  priceRow: { flexDirection: "row", alignItems: "flex-start", marginVertical: 8 },
  currencySymbol: { fontSize: 24, color: "#fff", fontWeight: "bold", marginTop: 10 },
  priceAmount: { fontSize: 60, color: "#fff", fontWeight: "900" },
  discountText: { color: "#f5d0fe", fontWeight: "bold", marginBottom: 12, fontSize: 12 },
  durationBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 },
  durationText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  perksContainer: { marginTop: 35 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 20 },
  perkItem: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  perkIconBg: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#fdf4ff", justifyContent: "center", alignItems: "center", marginRight: 15 },
  perkText: { fontSize: 15, color: "#475569", fontWeight: "500" },
  promoBox: { flexDirection: "row", backgroundColor: "#f8fafc", borderRadius: 18, padding: 6, marginTop: 10, borderWidth: 1, borderColor: "#e2e8f0" },
  promoBoxSuccess: { borderColor: "#10b981", backgroundColor: "#f0fdf4" },
  promoInput: { flex: 1, paddingHorizontal: 15, fontSize: 14, fontWeight: "600", color: "#1e293b" },
  applyBtn: { backgroundColor: "#4a044e", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, minWidth: 85, alignItems: 'center' },
  applyBtnSuccess: { backgroundColor: "#10b981" },
  applyBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  
  // Equal Width Action Buttons
  bottomBar: { marginTop: 35, paddingBottom: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  cancelButton: { 
    flex: 1, 
    backgroundColor: '#f1f5f9', 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  cancelButtonText: { color: '#64748b', fontWeight: 'bold', fontSize: 16 },
  payButton: { 
    flex: 1, 
    backgroundColor: "#701a75", 
    height: 60, 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    elevation: 4 
  },
  payButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  
  disabledBtn: { backgroundColor: "#94a3b8" },
  activeBanner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  activeText: { color: "#10b981", fontWeight: "800", fontSize: 15 },
  successOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center", alignItems: "center" },
  successCard: { width: width * 0.85, padding: 35, borderRadius: 40, alignItems: "center" },
  checkmarkCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: "900", color: "#fff", textAlign: "center" },
  successSub: { fontSize: 15, color: "#f5d0fe", textAlign: "center", marginTop: 8, opacity: 0.8 },
  loaderLine: { flexDirection: 'row', alignItems: 'center', marginTop: 30, gap: 10 },
  redirectText: { color: "#f5d0fe", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  errorOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  errorCard: { backgroundColor: "#fff", padding: 24, borderRadius: 18, alignItems: "center", width: width * 0.8 },
  errorTitle: { fontSize: 18, fontWeight: "900", color: "#4a044e", marginTop: 10 },
  errorMsg: { fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 6 },
  errorBtn: { marginTop: 14, backgroundColor: "#4a044e", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  errorBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});

export default PlanDetailScreen;