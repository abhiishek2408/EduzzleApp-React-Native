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
  Platform,
  ToastAndroid,
  Alert,
  Linking,
} from "react-native";
import axios from "axios";
import ConfettiCannon from "react-native-confetti-cannon";
import { WebView } from 'react-native-webview';
import { AuthContext } from "../context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const PlanDetailScreen = ({ route, navigation }) => {
  const { plan, userSubscription } = route.params;
  const { token, user, refreshUser } = useContext(AuthContext);

  // States
  const [discountCode, setDiscountCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentError, setPaymentError] = useState({ show: false, msg: "" });
  const [showPaymentWebview, setShowPaymentWebview] = useState(false);
  const [paymentWebviewHtml, setPaymentWebviewHtml] = useState("");
  const [paymentNonce, setPaymentNonce] = useState(null);
  const [finalPrice, setFinalPrice] = useState(plan.price || 0);
  const [discountPercent, setDiscountPercent] = useState(null);

  const showApplyButton = discountCode.trim().length > 0 && !isApplied;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Promo Code Logic
  const handleApplyPromo = async () => {
    if (!discountCode.trim()) {
      alert("Please enter a promo code.");
      return;
    }
    setPromoLoading(true);
    try {
      const res = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/subscription/discount",
        {
          planId: plan._id,
          discountCode: discountCode.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPromoLoading(false);
      setIsApplied(true);
      setShowConfetti(true);

      if (Platform.OS === "android") {
        ToastAndroid.show("Promo code applied", ToastAndroid.SHORT);
      } else {
        Alert.alert("Promo Applied", "Promo code applied successfully.");
      }

      Keyboard.dismiss();
      setTimeout(() => setShowConfetti(false), 3000);

      if (res.data && typeof res.data.finalPrice === "number") {
        setFinalPrice(res.data.finalPrice);
      }
      if (res.data && typeof res.data.discountPercent === "number") {
        setDiscountPercent(res.data.discountPercent);
      } else if (res.data && res.data.discount) {
        setDiscountPercent(res.data.discount);
      }
    } catch (err) {
      setPromoLoading(false);
      alert(err?.response?.data?.message || "Invalid or expired promo code.");
    }
  };

  const handleResetPromo = () => {
    setIsApplied(false);
    setDiscountCode("");
    setFinalPrice(plan.price || 0);
    setDiscountPercent(null);
    setPaymentError({ show: false, msg: "" });
  };

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

  const createOrderAndPay = async () => {
    try {
      setLoading(true);
      const orderRes = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/payment/create-order",
        { planId: plan._id, discountCode: isApplied ? discountCode.trim() : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);

      const paymentUrl = orderRes?.data?.paymentUrl || orderRes?.data?.checkoutUrl;
      // store server nonce if provided (used to validate verify requests)
      if (orderRes?.data?.nonce) setPaymentNonce(orderRes.data.nonce);
      if (paymentUrl) {
        Alert.alert(
          "Proceed to Payment",
          "You'll be redirected to a secure payment page.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open", onPress: () => Linking.openURL(paymentUrl) },
          ]
        );
        return;
      }

      const { orderId, key, amount, currency } = orderRes?.data || {};
      if (orderId && key) {
        if (orderRes?.data?.nonce) setPaymentNonce(orderRes.data.nonce);
        // Escape values before injecting into HTML to avoid injection
        const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const safeKey = esc(key);
        const safeOrderId = esc(orderId);
        const safeAmount = Number(amount || 0);
        const safeCurrency = esc(currency || 'INR');

        const checkoutHtml = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1" /><script src="https://checkout.razorpay.com/v1/checkout.js"></script></head><body><script>const options = {key: "${safeKey}",amount: ${safeAmount},currency: "${safeCurrency}",order_id: "${safeOrderId}",name: "Eduzzle",description: "Subscription Purchase",handler: function (response) {try{window.ReactNativeWebView.postMessage(JSON.stringify({razorpay_payment_id: response.razorpay_payment_id,razorpay_order_id: response.razorpay_order_id,razorpay_signature: response.razorpay_signature}));}catch(e){}},modal: { escape: false },theme: { color: '#701a75' }};const rzp = new Razorpay(options);rzp.open();<\/script></body></html>`;
        setPaymentWebviewHtml(checkoutHtml);
        setShowPaymentWebview(true);
        return;
      }
    } catch (error) {
      setLoading(false);
      setPaymentError({ show: true, msg: error?.response?.data?.message || String(error) });
    }
  };

  const handleWebviewMessage = async (event) => {
    try {
      const raw = event?.nativeEvent?.data;
      if (!raw) return;
      if (typeof raw !== 'string') {
        setPaymentError({ show: true, msg: 'Unexpected payment payload.' });
        setShowPaymentWebview(false);
        return;
      }
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (err) {
        setPaymentError({ show: true, msg: 'Malformed payment response.' });
        setShowPaymentWebview(false);
        return;
      }

      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = payload || {};
      const idRegex = /^[A-Za-z0-9_\-]{10,60}$/;
      const sigRegex = /^[A-Fa-f0-9]{16,256}$/;

      if (!idRegex.test(String(razorpay_payment_id || '')) || !idRegex.test(String(razorpay_order_id || '')) || !sigRegex.test(String(razorpay_signature || ''))) {
        // avoid logging full payload which may contain sensitive info
        console.warn('Invalid payment payload format from WebView');
        setPaymentError({ show: true, msg: 'Invalid payment response format.' });
        setShowPaymentWebview(false);
        return;
      }

      setShowPaymentWebview(false);
      setLoading(true);
      const verifyPayload = { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId: plan._id };
      if (paymentNonce) verifyPayload.nonce = paymentNonce;

      const res = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/payment/verify",
        verifyPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      if (res?.data?.success) {
        triggerSuccess();
        setPaymentNonce(null);
      } else {
        setPaymentError({ show: true, msg: res?.data?.message || "Verification failed" });
        setPaymentNonce(null);
      }
    } catch (err) {
      setLoading(false);
      setPaymentNonce(null);
      setPaymentError({ show: true, msg: String(err) });
    }
  };

  const hasActiveSubscription = userSubscription?.isActive;
  const isCurrentPlan = hasActiveSubscription && userSubscription.planId === plan._id;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut />}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.floatingBack} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#4a044e" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscription Plan</Text>
            <View style={{width: 45}} />
        </View>

        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <LinearGradient colors={["#f5d0fe", "#fdf4ff"]} style={styles.iconGradient}>
                <MaterialCommunityIcons name="diamond-stone" size={40} color="#a21caf" />
            </LinearGradient>
          </View>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planTagline}>Premium access to all educational content</Text>
        </View>

        <LinearGradient
          colors={["#4a044e", "#701a75", "#a21caf"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.priceCard}
        >
          <View style={styles.priceHeader}>
            <Text style={styles.priceLabel}>TOTAL INVESTMENT</Text>
            <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{plan.durationInDays} DAYS</Text>
            </View>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceAmount}>{finalPrice}</Text>
          </View>

          {isApplied && (
            <View style={styles.discountBadge}>
               <Text style={styles.discountText}>SAVED {discountPercent}% WITH PROMO</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.perksContainer}>
          <Text style={styles.sectionTitle}>What's included</Text>
          {[
            { icon: "infinity", text: "Unlimited Puzzles & Quizzes", sub: "No restrictions on learning" }, // FIXED: "infinite" -> "infinity"
            { icon: "flash", text: "Instant Feedback", sub: "Learn from your mistakes faster" },
            { icon: "shield-check", text: "Ad-Free Experience", sub: "Zero interruptions while studying" },
          ].map((item, i) => (
            <View key={i} style={styles.perkItem}>
              <View style={styles.perkIconBg}>
                <MaterialCommunityIcons name={item.icon} size={22} color="#701a75" />
              </View>
              <View>
                <Text style={styles.perkText}>{item.text}</Text>
                <Text style={styles.perkSubText}>{item.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {!isCurrentPlan && !hasActiveSubscription && (
          <View style={[styles.promoBox, isApplied && styles.promoBoxSuccess]}>
            <TextInput
              style={styles.promoInput}
              placeholder="ENTER PROMO CODE"
              placeholderTextColor="#94a3b8"
              value={discountCode}
              onChangeText={setDiscountCode}
              editable={!isApplied}
              autoCapitalize="characters"
            />
            {isApplied ? (
              <TouchableOpacity style={styles.resetBtn} onPress={handleResetPromo}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            ) : (
              showApplyButton && (
                <TouchableOpacity style={styles.applyBtn} onPress={handleApplyPromo} disabled={promoLoading}>
                  {promoLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.applyBtnText}>APPLY</Text>}
                </TouchableOpacity>
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBarContainer}>
          {isCurrentPlan ? (
            <View style={styles.activeBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.activeText}>
                 Current Plan active until {new Date(userSubscription.endDate).toLocaleDateString()}
              </Text>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.payButton, (loading || hasActiveSubscription) && styles.disabledBtn]}
                onPress={() => {
                  if (loading) return;
                  if (hasActiveSubscription) {
                    Alert.alert('Already Active', 'You already have an active subscription.');
                    return;
                  }
                  createOrderAndPay();
                }}
                disabled={loading}
              >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.payButtonText}>
                        {hasActiveSubscription ? "ALREADY ACTIVE" : `SUBSCRIBE NOW - ₹${finalPrice}`}
                    </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
      </View>

      {/* MODAL REDUCED HEIGHT & WHITE BACKGROUND */}
      <Modal 
        visible={showPaymentWebview} 
        transparent={true} 
        animationType="slide"
        onRequestClose={() => setShowPaymentWebview(false)}
      >
        <View style={styles.webviewOverlay}>
            <View style={styles.webviewContainer}>
                <View style={styles.webviewHeader}>
                    <Text style={styles.webviewTitle}>Secure Checkout</Text>
                    <TouchableOpacity onPress={() => setShowPaymentWebview(false)}>
                        <Ionicons name="close" size={28} color="#4a044e" />
                    </TouchableOpacity>
                </View>
                <WebView
                    originWhitelist={['https://checkout.razorpay.com', 'about:blank']}
                    source={{ html: paymentWebviewHtml }}
                    onMessage={handleWebviewMessage}
                    javaScriptEnabled={true}
                    mixedContentMode="never"
                    domStorageEnabled={true}
                    allowingReadAccessToURL={'https://checkout.razorpay.com'}
                    startInLoadingState={true}
                    onShouldStartLoadWithRequest={(req) => {
                      try {
                        const url = new URL(req.url);
                        // allow data: and about: schemes (checkout uses about:blank)
                        if (url.protocol === 'about:' || url.protocol === 'data:') return true;
                        // only allow https requests to checkout.razorpay.com
                        if (url.protocol === 'https:' && url.hostname === 'checkout.razorpay.com') return true;
                      } catch (e) {
                        // fallback for non-URL strings (allow about: or data:)
                        if (req.url && (req.url.startsWith('about:') || req.url.startsWith('data:'))) return true;
                      }
                      console.warn('Blocked WebView navigation to unknown URL');
                      return false;
                    }}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <LinearGradient colors={["#4a044e", "#701a75"]} style={styles.successCard}>
            <ConfettiCannon count={150} origin={{ x: width / 2, y: 0 }} />
            <Animated.View style={[styles.checkmarkCircle, { transform: [{ scale: checkmarkScale }] }]}>
              <Ionicons name="checkmark" size={60} color="#10b981" />
            </Animated.View>
            <Text style={styles.successTitle}>Welcome to Premium!</Text>
            <Text style={styles.successSub}>Your payment was successful and your features are unlocked.</Text>
            <View style={styles.loaderLine}>
              <ActivityIndicator color="#f5d0fe" size="small" />
              <Text style={styles.redirectText}> PREPARING DASHBOARD...</Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* ERROR MODAL */}
      <Modal visible={paymentError.show} transparent animationType="fade">
        <View style={styles.errorOverlay}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
                <MaterialCommunityIcons name="close-circle-outline" size={60} color="#ef4444" />
            </View>
            <Text style={styles.errorTitle}>Transaction Failed</Text>
            <Text style={styles.errorMsg}>{paymentError.msg}</Text>
            <TouchableOpacity style={styles.errorBtn} onPress={() => setPaymentError({ show: false, msg: "" })}>
              <Text style={styles.errorBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 150, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 35, marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  floatingBack: { width: 45, height: 45, borderRadius: 12, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: '#f1f5f9' },
  heroSection: { alignItems: "center", marginVertical: 20 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, overflow: 'hidden', elevation: 5, backgroundColor: '#fff' },
  iconGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  planName: { fontSize: 28, fontWeight: "900", color: "#4a044e", marginTop: 15 },
  planTagline: { fontSize: 14, color: "#64748b", marginTop: 5, textAlign: 'center' },
  priceCard: { borderRadius: 25, padding: 25, elevation: 8, shadowColor: "#701a75", shadowOpacity: 0.3, shadowRadius: 10 },
  priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  priceLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "800", letterSpacing: 1,textAlign: 'center' },
  durationBadge: { backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  durationText: { color: "#fff", fontWeight: "800", fontSize: 11 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  currencySymbol: { fontSize: 24, color: "#fff", fontWeight: "bold", marginTop: 12, marginRight: 4 },
  priceAmount: { fontSize: 56, color: "#fff", fontWeight: "900" },
  discountBadge: { backgroundColor: "#10b981", alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 },
  discountText: { color: "#fff", fontWeight: "900", fontSize: 10 },
  perksContainer: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 15 },
  perkItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  perkIconBg: { width: 45, height: 45, borderRadius: 12, backgroundColor: "#fdf4ff", justifyContent: "center", alignItems: "center", marginRight: 15 },
  perkText: { fontSize: 16, color: "#1e293b", fontWeight: "700" },
  perkSubText: { fontSize: 13, color: "#64748b" },
  promoBox: { flexDirection: "row", backgroundColor: "#f8fafc", borderRadius: 15, padding: 8, marginTop: 10, borderWidth: 1.5, borderColor: "#e2e8f0", alignItems: 'center' },
  promoBoxSuccess: { borderColor: "#10b981", backgroundColor: "#f0fdf4" },
  promoInput: { flex: 1, paddingHorizontal: 15, fontSize: 14, fontWeight: "800", color: "#4a044e", letterSpacing: 1 },
  applyBtn: { backgroundColor: "#4a044e", paddingHorizontal: 20, height: 45, borderRadius: 10, justifyContent: 'center' },
  applyBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  resetBtn: { padding: 5 },
  bottomBarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  payButton: { backgroundColor: "#701a75", height: 60, borderRadius: 18, justifyContent: "center", alignItems: "center", elevation: 4 },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 1 },
  disabledBtn: { backgroundColor: "#cbd5e1" },
  activeBanner: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10 },
  activeText: { color: "#10b981", fontWeight: "700", fontSize: 14, marginLeft: 8 },

  // NEW MODAL STYLES
  webviewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    marginBottom: 50, // To cover the bottom bar area
  },
  webviewContainer: {
    height: height * 0.75, // 75% height for better usability
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden'
  },
  webviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  webviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a044e'
  },

  successOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  successCard: { width: width * 0.85, padding: 30, borderRadius: 30, alignItems: "center" },
  checkmarkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: "900", color: "#fff", textAlign: "center" },
  successSub: { fontSize: 15, color: "#f5d0fe", textAlign: "center", marginTop: 10, opacity: 0.9 },
  loaderLine: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
  redirectText: { color: "#f5d0fe", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  errorOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  errorCard: { backgroundColor: "#fff", padding: 30, borderRadius: 25, alignItems: "center", width: width * 0.85 },
  errorIconContainer: { marginBottom: 15 },
  errorTitle: { fontSize: 22, fontWeight: "900", color: "#ef4444" },
  errorMsg: { fontSize: 14, color: "#64748b", textAlign: "center", marginVertical: 10 },
  errorBtn: { marginTop: 10, backgroundColor: "#1e293b", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  errorBtnText: { color: "#fff", fontWeight: "800" },
});

export default PlanDetailScreen;