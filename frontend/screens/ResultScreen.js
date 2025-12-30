// import React from "react";
// import {
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet
// } from "react-native";
// import { AppState } from "react-native";



// export default function ResultComponent({
//   score,
//   totalPossible,
//   passed,
//   feedback,
//   setFeedback,
//   rating,
//   setRating,
//   submitted,
//   onSubmit,
//   levelAttempts,
//   isFinished,
//   submitResults
// }) {

//   // Auto submit on unmount (navigation away)
// useEffect(() => {
//   return () => {
//     if (isFinished && !submitted) {
//       submitResults();
//     }
//   };
// }, [isFinished, submitted]);

// // Auto submit on background/exit
// useEffect(() => {
//   const sub = AppState.addEventListener("change", (state) => {
//     if (state !== "active" && isFinished && !submitted) {
//       submitResults();
//     }
//   });

//   return () => sub.remove();
// }, [isFinished, submitted]);


//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>🎉 Test Finished</Text>
//       <Text style={styles.text}>
//         Total Score: {score} / {totalPossible}
//       </Text>
//       <Text style={styles.text}>
//         Status: {passed ? "✅ Passed" : "❌ Failed"}
//       </Text>




//  {!submitted && (
//         <>
//       <TextInput
//         placeholder="Enter your feedback"
//         value={feedback}
//         onChangeText={setFeedback}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Rate (1 to 5)"
//         keyboardType="numeric"
//         value={String(rating)}
//         onChangeText={(v) => setRating(Number(v))}
//         style={styles.input}
//       />

//       <TouchableOpacity
//         onPress={onSubmit}
//         disabled={submitted}
//         style={[
//           styles.button,
//           submitted && styles.buttonDisabled
//         ]}
//       >
//         <Text style={styles.buttonText}> Submit Results </Text>
//       </TouchableOpacity>

//   </>
// )}

//       {submitted && (
//         <Text style={{ marginTop: 20, fontSize: 16, color: "green" }}>
//           ✅ Feedback submitted successfully.
//         </Text>
//       )}

//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 25,
//     backgroundColor: "#e8f0f8",
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     marginTop: 10,
//     padding: 8,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "green",
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 20,
//     width: "100%",
//   },
//   buttonDisabled: {
//     backgroundColor: "gray",
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });


// import React, { useEffect, useRef } from "react";
// import {
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   AppState,
// } from "react-native";

// export default function ResultComponent({
//   score,
//   totalPossible,
//   passed,
//   feedback,
//   setFeedback,
//   rating,
//   setRating,
//   submitted,
//   onSubmit,
//   levelAttempts,
//   isFinished,
//   submitResults,
// }) {

//   const hasSubmittedRef = useRef(false); // 🛡️ guard

//   const handleSubmitOnce = () => {
//     if (!hasSubmittedRef.current && isFinished && !submitted) {
//       hasSubmittedRef.current = true; // 🧷 prevent duplicate
//       submitResults();
//     }
//   };

//   // 🛑 Auto-submit on unmount
//   useEffect(() => {
//     return () => {
//       handleSubmitOnce();
//     };
//   }, [isFinished, submitted]);

//   // 🛑 Auto-submit on app background
//   useEffect(() => {
//     const sub = AppState.addEventListener("change", (state) => {
//       if (state !== "active") {
//         handleSubmitOnce();
//       }
//     });

//     return () => sub.remove();
//   }, [isFinished, submitted]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>🎉 Test Finished</Text>
//       <Text style={styles.text}>
//         Total Score: {score} / {totalPossible}
//       </Text>
//       <Text style={styles.text}>
//         Status: {passed ? "✅ Passed" : "❌ Failed"}
//       </Text>

//       {!submitted && (
//         <>
//           <TextInput
//             placeholder="Enter your feedback"
//             value={feedback}
//             onChangeText={setFeedback}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Rate (1 to 5)"
//             keyboardType="numeric"
//             value={String(rating)}
//             onChangeText={(v) => setRating(Number(v))}
//             style={styles.input}
//           />

//           <TouchableOpacity
//             onPress={onSubmit}
//             disabled={submitted}
//             style={[
//               styles.button,
//               submitted && styles.buttonDisabled,
//             ]}
//           >
//             <Text style={styles.buttonText}>Submit Results</Text>
//           </TouchableOpacity>
//         </>
//       )}

//       {submitted && (
//         <Text style={{ marginTop: 20, fontSize: 16, color: "green" }}>
//           ✅ Feedback submitted successfully.
//         </Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 25,
//     backgroundColor: "#e8f0f8",
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     marginTop: 10,
//     padding: 8,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "#4a044e",
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 20,
//     width: "100%",
//   },
//   buttonDisabled: {
//     backgroundColor: "gray",
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AppState,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ResultComponent({
  score,
  totalPossible,
  passed,
  feedback,
  setFeedback,
  rating,
  setRating,
  submitted,
  onSubmit,
  isFinished,
}) {
  const hasSubmittedRef = useRef(false);
  const navigation = useNavigation();

  const handleSubmitOnce = () => {
    if (!hasSubmittedRef.current && isFinished && !submitted) {
      hasSubmittedRef.current = true;
      onSubmit();
    }
  };

  useEffect(() => {
    return () => handleSubmitOnce();
  }, [isFinished, submitted]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") handleSubmitOnce();
    });
    return () => sub.remove();
  }, [isFinished, submitted]);

  const renderStars = () => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={36}
            color={star <= rating ? styles.star.color : styles.starOutline.color}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const goToHome = () => {
    navigation.navigate("Home", { screen: "StackHome" });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {passed ? "Great Job!" : "Keep Trying!"}
        </Text>
        <Text style={styles.subtitle}>Test Finished</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Final Score</Text>
          <Text style={styles.scoreText}>
            {score} / {totalPossible}
          </Text>
        </View>

        <View style={passed ? styles.statusBoxPassed : styles.statusBoxFailed}>
          <Ionicons
            name={passed ? "checkmark-circle" : "close-circle"}
            size={28}
            color={passed ? "#1caf3cff" : "#e11d48"} // Theme color or red for fail
            style={{ marginRight: 8 }}
          />
          <Text style={styles.statusText}>{passed ? "Passed" : "Failed"}</Text>
        </View>

        {!submitted && (
          <>
            <TextInput
              placeholder="Share your feedback..."
              placeholderTextColor="#d8b4fe"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              style={styles.input}
            />

            <Text style={styles.ratingTitle}>Rate your experience</Text>
            {renderStars()}

            <TouchableOpacity
              onPress={handleSubmitOnce}
              disabled={submitted || !rating}
              style={[
                styles.button,
                (submitted || !rating) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>Submit & Finish</Text>
            </TouchableOpacity>
          </>
        )}

        {submitted && (
          <View style={styles.submittedContainer}>
            <Ionicons
              name="rocket-outline"
              size={50}
              color="#4a044e"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.successText}>
              Feedback submitted successfully! Thanks for sharing.
            </Text>

            <TouchableOpacity style={styles.button} onPress={goToHome}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: "#f5f3f7" }, // Light background
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#4a044e", marginBottom: 4 },
  subtitle: { fontSize: 18, color: "#a78bfa", marginBottom: 20 },
  scoreContainer: {
    backgroundColor: "#f3e8ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  scoreLabel: { fontSize: 16, color: "#4a044e", fontWeight: "600" },
  scoreText: { fontSize: 36, fontWeight: "bold", color: "#7e22ce" },
  statusBoxPassed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5d0fe",
    padding: 10,
    borderRadius: 8,
    marginBottom: 25,
  },
  statusBoxFailed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 25,
  },
  statusText: { fontSize: 18, fontWeight: "700", color: "#1caf39ff" },
  input: {
    width: "100%",
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#c084fc",
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#faf5ff",
    fontSize: 16,
    color: "#1f2937",
    textAlignVertical: "top",
  },
  ratingTitle: { fontSize: 18, marginTop: 25, marginBottom: 10, color: "#4a044e", fontWeight: "600" },
  starRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  starButton: { paddingHorizontal: 5 },
  star: { color: "#facc15" },
  starOutline: { color: "#d1d5db" },
  button: {
    backgroundColor: "#4a044e",
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#d8b4fe" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 18, marginLeft: 8 },
  submittedContainer: { alignItems: "center", marginTop: 20, width: "100%" },
  successText: { marginTop: 10, fontSize: 18, color: "#1caf28ff", textAlign: "center", fontWeight: "500", marginBottom: 20 },
});

