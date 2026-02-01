import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PremiumFeatureAlert({ visible, onClose, onUpgrade }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconBadge}>
            <Ionicons name="star" size={42} color="#fbbf24" />
          </View>
          <Text style={styles.title}>Unlock Premium Access</Text>
          <Text style={styles.message}>
            Play live tournaments, climb leaderboards, and win exclusive rewards.
          </Text>

          <View style={styles.perks}>
            <View style={styles.perkRow}>
              <Ionicons name="trophy-outline" size={16} color="#701a75" />
              <Text style={styles.perkText}>Live gaming events</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="podium-outline" size={16} color="#701a75" />
              <Text style={styles.perkText}>Premium leaderboards</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="gift-outline" size={16} color="#701a75" />
              <Text style={styles.perkText}>Bonus rewards & perks</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={onUpgrade || onClose}>
            <Text style={styles.buttonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Not now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    minWidth: 280,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#701a75',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#4a044e',
    textAlign: 'center',
    marginBottom: 14,
  },
  perks: {
    width: '100%',
    backgroundColor: '#fdf4ff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  perkText: {
    fontSize: 13,
    color: '#4a044e',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#701a75',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    marginTop: 10,
  },
  secondaryText: {
    color: '#6b7280',
    fontWeight: '700',
    fontSize: 13,
  },
});
