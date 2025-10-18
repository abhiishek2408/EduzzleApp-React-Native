import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ProfileScreen() {
  const { logout, user, token, setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const API_URL = "https://eduzzleapp-react-native.onrender.com"; // your backend URL

  // Logout
  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?._id) return;
        const res = await axios.get(`${API_URL}/api/attempts/stats/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, token]);

  // Pick image using Expo DocumentPicker and upload
  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('User cancelled image selection');
        return;
      }

      const file = result.assets[0];

      const formData = new FormData();
      formData.append('profilePic', {
        uri: file.uri,
        name: file.name || 'profile.jpg',
        type: file.mimeType || 'image/jpeg',
      });

      setUploading(true);
      const response = await axios.put(`${API_URL}/api/user/profile-pic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick}>
          {uploading ? (
            <ActivityIndicator size="large" color="#a21caf" />
          ) : (
            <Image
              source={{
                uri: user?.profilePic ||
                  "https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png",
              }}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{user?.name || "Guest"}</Text>
        <Text style={styles.email}>{user?.email || "guest@example.com"}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          {loading ? <ActivityIndicator size="small" color="#6a21a8" /> : (
            <Text style={styles.statNumber}>{stats?.attemptCount ?? 0}</Text>
          )}
          <Text style={styles.statLabel}>Puzzles Solved</Text>
        </View>

        <View style={styles.statBox}>
          {loading ? <ActivityIndicator size="small" color="#6a21a8" /> : (
            <Text style={styles.statNumber}>{stats?.totalPoints ?? 0}</Text>
          )}
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={styles.statBox}>
          {loading ? <ActivityIndicator size="small" color="#6a21a8" /> : (
            <Text style={styles.statNumber}>{stats?.highestLevel ?? "N/A"}</Text>
          )}
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>

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
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#f3e8ff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#a21caf',
  },
  name: { fontSize: 22, fontWeight: '700', color: '#4b0082', marginTop: 10 },
  email: { fontSize: 14, color: '#555', marginTop: 4 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statBox: {
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: { fontSize: 20, fontWeight: '600', color: '#6a21a8' },
  statLabel: { fontSize: 12, color: '#444', marginTop: 4, textAlign: 'center' },
  section: { marginTop: 40, paddingHorizontal: 30 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#3c0753',
    fontWeight: '500',
  },
});
