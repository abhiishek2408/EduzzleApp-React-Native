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


import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AppState,
} from "react-native";

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
  levelAttempts,
  isFinished,
  submitResults,
}) {

  const hasSubmittedRef = useRef(false); // 🛡️ guard

  const handleSubmitOnce = () => {
    if (!hasSubmittedRef.current && isFinished && !submitted) {
      hasSubmittedRef.current = true; // 🧷 prevent duplicate
      submitResults();
    }
  };

  // 🛑 Auto-submit on unmount
  useEffect(() => {
    return () => {
      handleSubmitOnce();
    };
  }, [isFinished, submitted]);

  // 🛑 Auto-submit on app background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        handleSubmitOnce();
      }
    });

    return () => sub.remove();
  }, [isFinished, submitted]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Test Finished</Text>
      <Text style={styles.text}>
        Total Score: {score} / {totalPossible}
      </Text>
      <Text style={styles.text}>
        Status: {passed ? "✅ Passed" : "❌ Failed"}
      </Text>

      {!submitted && (
        <>
          <TextInput
            placeholder="Enter your feedback"
            value={feedback}
            onChangeText={setFeedback}
            style={styles.input}
          />
          <TextInput
            placeholder="Rate (1 to 5)"
            keyboardType="numeric"
            value={String(rating)}
            onChangeText={(v) => setRating(Number(v))}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={onSubmit}
            disabled={submitted}
            style={[
              styles.button,
              submitted && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Submit Results</Text>
          </TouchableOpacity>
        </>
      )}

      {submitted && (
        <Text style={{ marginTop: 20, fontSize: 16, color: "green" }}>
          ✅ Feedback submitted successfully.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#e8f0f8",
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    marginTop: 10,
    padding: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#a21caf",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
