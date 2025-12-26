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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ReviewUs = () => {
  const { user } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    if (!user?._id) {
      Alert.alert('Error', 'Please log in to submit a review.');
      setModalVisible(false);
      resetForm();
      return;
    }

    // If rating is 4 or 5, redirect to Play Store
    if (rating >= 4) {
      // First save the review to backend
      try {
        setSubmitting(true);
        await axios.post(`${API_URL}/api/reviews/submit`, {
          userId: user._id,
          rating,
          feedback: feedback || 'Positive review - redirected to Play Store',
        });
        setSubmitting(false);

        Alert.alert(
          'Thank You! 🎉',
          'We appreciate your positive feedback! Would you like to rate us on the Play Store?',
          [
            {
              text: 'Later',
              style: 'cancel',
              onPress: () => {
                setModalVisible(false);
                resetForm();
              },
            },
            {
              text: 'Rate on Play Store',
              onPress: () => {
                // Replace with your actual Play Store URL
                const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.eduzzleapp';
                Linking.openURL(playStoreUrl).catch(() => {
                  Alert.alert('Error', 'Unable to open Play Store');
                });
                setModalVisible(false);
                resetForm();
              },
            },
          ]
        );
      } catch (error) {
        setSubmitting(false);
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    } else {
      // For ratings below 4, collect feedback
      if (!feedback.trim()) {
        Alert.alert('Feedback Required', 'Please share your feedback to help us improve.');
        return;
      }

      // Send feedback to backend
      try {
        setSubmitting(true);
        await axios.post(`${API_URL}/api/reviews/submit`, {
          userId: user._id,
          rating,
          feedback,
        });
        setSubmitting(false);

        Alert.alert(
          'Thank You! 💙',
          'Your feedback has been submitted. We will work hard to improve your experience!',
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                resetForm();
              },
            },
          ]
        );
      } catch (error) {
        setSubmitting(false);
        console.error('Error submitting review:', error);
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setRating(0);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.reviewButtonContent}>
          <View style={styles.reviewButtonLeft}>
            <MaterialCommunityIcons name="star-outline" size={24} color="#a21caf" />
            <View style={styles.reviewButtonTextContainer}>
              <Text style={styles.reviewButtonTitle}>Rate Our App</Text>
              <Text style={styles.reviewButtonSubtitle}>Share your experience with us</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Your Experience</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>How would you rate our app?</Text>

            {/* Star Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={48}
                    color={star <= rating ? '#FFD700' : '#d1d5db'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Text (only shown for ratings below 4) */}
            {rating > 0 && rating < 4 && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>Please tell us how we can improve:</Text>
                <TextInput
                  style={styles.feedbackInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Share your thoughts..."
                  placeholderTextColor="#9ca3af"
                  value={feedback}
                  onChangeText={setFeedback}
                  textAlignVertical="top"
                />
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (rating === 0 || submitting) && styles.submitButtonDisabled]}
              onPress={handleSubmitReview}
              activeOpacity={0.85}
              disabled={submitting || rating === 0}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  reviewButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  reviewButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reviewButtonTextContainer: {
    flex: 1,
  },
  reviewButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  reviewButtonSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  feedbackContainer: {
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    minHeight: 100,
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#a21caf',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default ReviewUs;
