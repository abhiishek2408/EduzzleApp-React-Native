import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AchievementModal({ visible, achievement, coins, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <MaterialCommunityIcons name="trophy-award" size={48} color="#fbbf24" style={{ marginBottom: 10 }} />
          <Text style={styles.title}>{achievement}</Text>
          <Text style={styles.coins}>+{coins} coins</Text>
          <Text style={styles.closeText} onPress={onClose}>OK</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 20, padding: 30, alignItems: 'center', elevation: 8 },
  title: { fontSize: 20, fontWeight: '900', color: '#4a044e', marginBottom: 8, textAlign: 'center' },
  coins: { fontSize: 18, fontWeight: '700', color: '#fbbf24', marginBottom: 16 },
  closeText: { fontSize: 16, color: '#4a044e', fontWeight: '700', marginTop: 10, padding: 8 },
});
