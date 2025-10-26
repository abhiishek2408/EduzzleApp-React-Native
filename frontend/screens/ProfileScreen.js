// src/screens/ProfileScreen.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import io from 'socket.io-client';


export default function ProfileScreen() {
  const { logout, user, token, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);



  // ✅ Use your Render API
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';


 

  // -------------------- Logout --------------------
  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // -------------------- Fetch stats --------------------
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${API_URL}/api/attempts/stats/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, token]);

  // -------------------- Profile Pic Upload (Fetch Version) --------------------
const handleImagePick = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const file = result.assets[0];
    const formData = new FormData();

    formData.append("profilePic", {
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
      name: file.name || `profile_${Date.now()}.jpg`,
    });

    setUploading(true);

    // ✅ Use XMLHttpRequest instead of fetch
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://eduzzleapp-react-native.onrender.com/api/user/profile-pic");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response?.user) {
          setUser(response.user);
          Alert.alert("✅ Success", "Profile picture updated successfully!");
        }
      } else {
        Alert.alert("❌ Error", `Upload failed with status ${xhr.status}`);
      }
    };

    xhr.onerror = (error) => {
      setUploading(false);
      console.error("XHR Upload Error:", error);
      Alert.alert("❌ Error", "Network error occurred during upload.");
    };

    xhr.send(formData);
  } catch (err) {
    setUploading(false);
    console.error("Upload error:", err);
    Alert.alert("❌ Error", err.message || "Failed to upload profile picture.");
  }
};


  // -------------------- UI Rendering --------------------
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick}>
          {uploading ? (
            <ActivityIndicator size="large" color="#a21caf" />
          ) : (
            <Image
              source={{
                uri:
                  user?.profilePic ||
                  'https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png',
              }}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {['attemptCount', 'totalPoints', 'highestLevel'].map((key, idx) => (
          <View key={idx} style={styles.statBox}>
            {loading ? (
              <ActivityIndicator size="small" color="#6a21a8" />
            ) : (
              <Text style={styles.statNumber}>{stats?.[key] ?? 0}</Text>
            )}
            <Text style={styles.statLabel}>
              {key === 'attemptCount'
                ? 'Puzzles Solved'
                : key === 'totalPoints'
                ? 'Total Points'
                : 'Rank'}
            </Text>
          </View>
        ))}
      </View>

      {/* Options Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="settings-outline" size={24} color="#6b21a8" />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Ionicons name="lock-closed-outline" size={24} color="#6b21a8" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#6b21a8" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ff' },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20, backgroundColor: '#f3e8ff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#a21caf' },
  name: { fontSize: 22, fontWeight: '700', color: '#4b0082', marginTop: 10 },
  email: { fontSize: 14, color: '#555', marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, paddingHorizontal: 20 },
  statBox: { backgroundColor: '#ede9fe', borderRadius: 16, padding: 16, alignItems: 'center', width: '30%' },
  statNumber: { fontSize: 20, fontWeight: '600', color: '#6a21a8' },
  statLabel: { fontSize: 12, color: '#444', marginTop: 4, textAlign: 'center' },
  section: { marginTop: 40, paddingHorizontal: 20 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 },
  optionText: { fontSize: 16, marginLeft: 15, color: '#3c0753', fontWeight: '500' },

});
