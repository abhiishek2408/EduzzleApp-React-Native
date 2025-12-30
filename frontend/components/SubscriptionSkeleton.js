import React from "react";
import { View, StyleSheet } from "react-native";

const SubscriptionSkeleton = () => {
  // Render 2-3 skeleton cards for loading effect
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((_, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.badgeSkeleton} />
          <View style={styles.titleSkeleton} />
          <View style={styles.priceRow}>
            <View style={styles.priceSkeleton} />
            <View style={styles.durationSkeleton} />
          </View>
          <View style={styles.featureSkeleton} />
          <View style={styles.featureSkeleton} />
          <View style={styles.featureSkeleton} />
          <View style={styles.buttonSkeleton} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 2,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  card: {
    borderRadius: 20,
    marginBottom: 25,
    padding: 64,
    shadowColor: "#3c3c3cff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: "100%",
    backgroundColor: "#fff",
  },
  badgeSkeleton: {
    width: 70,
    height: 18,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
    alignSelf: "flex-end",
  },
  titleSkeleton: {
    width: 160,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginBottom: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  priceSkeleton: {
    width: 80,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  durationSkeleton: {
    width: 60,
    height: 18,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  featureSkeleton: {
    width: "90%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  buttonSkeleton: {
    width: "70%",
    height: 36,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginTop: 18,
    alignSelf: "center",
  },
});

export default SubscriptionSkeleton;
