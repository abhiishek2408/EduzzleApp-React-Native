import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const ReviewUs = () => {
  const { user } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => setRating(selectedRating);

  const resetForm = () => {
    setRating(0);
    setFeedback('');
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE}/api/reviews/submit`, {
        userId: user?._id,
        rating,
        feedback: feedback || (rating >= 4 ? 'Positive review' : ''),
      });
      setSubmitting(false);

      if (rating >= 4) {
        Alert.alert('Thank You! 🎉', 'Would you like to rate us on the Play Store too?', [
          { text: 'Later', style: 'cancel', onPress: () => setModalVisible(false) },
          { text: 'Rate Now', onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.eduzzleapp') }
        ]);
      } else {
        Alert.alert('Thank You! 💙', 'Your feedback helps us improve!');
        setModalVisible(false);
      }
      resetForm();
    } catch (error) {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to submit review.');
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Main Trigger Button (Matches your requested style) --- */}
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="star-face" size={24} color="#701a75" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Rate Our App</Text>
          <Text style={styles.buttonSubtitle}>Help us grow the Eduzzle world</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#cbd5e1" />
      </TouchableOpacity>

      {/* --- Review Modal --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#4a044e', '#701a75']} style={styles.modalHeader}>
              <MaterialCommunityIcons name="heart-flash" size={32} color="#f5d0fe" />
              <Text style={styles.modalTitle}>Enjoying Eduzzle?</Text>
              <Text style={styles.modalSubtitle}>Your feedback makes us better!</Text>
            </LinearGradient>

            <View style={styles.body}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                    <MaterialCommunityIcons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={42}
                      color={star <= rating ? '#fbbf24' : '#e2e8f0'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {rating > 0 && rating < 4 && (
                <TextInput
                  style={styles.input}
                  placeholder="How can we improve? (Optional)"
                  multiline
                  value={feedback}
                  onChangeText={setFeedback}
                />
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => { setModalVisible(false); resetForm(); }}
                >
                  <Text style={styles.cancelBtnText}>Maybe Later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={rating === 0 || submitting}
                  style={[styles.submitBtn, rating === 0 && { opacity: 0.5 }]}
                  onPress={handleSubmitReview}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 12, marginVertical: 10 },
  reviewButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#4a044e',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: { 
    backgroundColor: '#fdf4ff', // 🔥 Your requested color
    padding: 10, 
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fae8ff'
  },
  textContainer: { flex: 1, marginLeft: 15 },
  buttonTitle: { fontSize: 16, fontWeight: '900', color: '#1e293b' },
  buttonSubtitle: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },

  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    width: '100%', 
    overflow: 'hidden' 
  },
  modalHeader: { padding: 30, alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 10 },
  modalSubtitle: { color: '#f5d0fe', fontSize: 13, fontWeight: '600', marginTop: 5 },
  
  body: { padding: 25, alignItems: 'center' },
  starsRow: { flexDirection: 'row', gap: 5, marginBottom: 20 },
  input: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    color: '#1e293b'
  },
  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  cancelBtnText: { color: '#94a3b8', fontWeight: '800' },
  submitBtn: { 
    flex: 2, 
    backgroundColor: '#701a75', 
    borderRadius: 15, 
    paddingVertical: 15, 
    alignItems: 'center',
    elevation: 4
  },
  submitBtnText: { color: '#fff', fontWeight: '900' }
});

export default ReviewUs;