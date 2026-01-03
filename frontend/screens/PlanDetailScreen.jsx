// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import CardSkeleton from "../components/CardSkeleton";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// const PlanDetailScreen = ({ route, navigation }) => {
//   const { plan, userSubscription } = route.params;
//   const { token, refreshUser } = useContext(AuthContext); // 🔹 added refreshUser
//   const [discountCode, setDiscountCode] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubscribe = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "https://eduzzleapp-react-native.onrender.com/api/subscription/avail",
//         { planId: plan._id, discountCode },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // 🔹 Refresh user context immediately
//       await refreshUser();

//       setLoading(false);
//       Alert.alert(
//         "Subscribed!",
//         `You have successfully subscribed to ${response.data.plan}.\nPrice Paid: ₹${response.data.finalPrice}`,
//         [{ text: "OK", onPress: () => navigation.navigate("PremiumDashboard") }]
//       );
//     } catch (error) {
//       setLoading(false);
//       console.error(
//         "Error subscribing:",
//         error.response?.data || error.message
//       );
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Something went wrong"
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <CardSkeleton />
//       </View>
//     );
//   }

//   // Check if user already has a subscription
//   const hasActiveSubscription = userSubscription && userSubscription.isActive;
//   const isCurrentPlan =
//     hasActiveSubscription && userSubscription.planId === plan._id;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.planName}>{plan.name}</Text>
//       <Text>Duration: {plan.durationInDays} days</Text>
//       <Text>Price: ₹{plan.price}</Text>

//       {isCurrentPlan ? (
//         <View style={[styles.button, { backgroundColor: "#4caf50" }]}>
//           <Text style={styles.buttonText}>
//             Subscribed (Ends:{" "}
//             {new Date(userSubscription.endDate).toLocaleDateString()})
//           </Text>
//         </View>
//       ) : hasActiveSubscription ? (
//         <View style={[styles.button, { backgroundColor: "#ccc" }]}>
//           <Text style={styles.buttonText}>Cannot Subscribe</Text>
//         </View>
//       ) : (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter discount code (optional)"
//             value={discountCode}
//             onChangeText={setDiscountCode}
//           />
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: "#4a044e" }]}
//             onPress={handleSubscribe}
//           >
//             <Text style={styles.buttonText}>Confirm Subscription</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// export default PlanDetailScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   planName: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#4a044e" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//   },
//   button: {
//     marginTop: 10,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, },
// });






import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import CardSkeleton from "../components/CardSkeleton";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PlanDetailScreen = ({ route, navigation }) => {
  const { plan, userSubscription } = route.params;
  const { token, user, refreshUser } = useContext(AuthContext);

  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     CREATE ORDER → PAY → VERIFY
  ========================= */
  const createOrderAndPay = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Razorpay Order
      const orderRes = await axios.post(
        "https://eduzzleapp-react-native.onrender.com/api/payment/create-order",
        {
          planId: plan._id,
          amount: plan.price, // backend converts to paise
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId, amount, currency, key } = orderRes.data;

      openRazorpayCheckout({ orderId, amount, currency, key });
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Unable to initiate payment");
    }
  };

  /* =========================
     OPEN RAZORPAY
  ========================= */
  const openRazorpayCheckout = async ({
    orderId,
    amount,
    currency,
    key,
  }) => {
    const options = {
      description: `${plan.name} Subscription`,
      image: "https://your-logo-url.png",
      currency,
      key,
      amount,
      name: "Eduzzle",
      order_id: orderId,
      prefill: {
        email: user?.email,
        name: user?.name,
      },
      theme: { color: "#4a044e" },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        // 2️⃣ Verify Payment
        await axios.post(
          "https://eduzzleapp-react-native.onrender.com/api/payment/verify",
          {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            planId: plan._id,
            durationInDays: plan.durationInDays,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 3️⃣ Refresh user & navigate
        await refreshUser();

        setLoading(false);
        Alert.alert(
          "Payment Successful",
          "Subscription activated successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("PremiumDashboard"),
            },
          ]
        );
      })
      .catch(() => {
        setLoading(false);
        Alert.alert("Payment Cancelled");
      });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <CardSkeleton />
      </View>
    );
  }

  const hasActiveSubscription = userSubscription?.isActive;
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
            style={[styles.button, { backgroundColor: "#4a044e" }]}
            onPress={createOrderAndPay}
          >
            <Text style={styles.buttonText}>Proceed to Pay</Text>
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
  planName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4a044e",
  },
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
