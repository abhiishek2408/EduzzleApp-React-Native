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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import io from 'socket.io-client';
import { LinearGradient } from 'expo-linear-gradient';


export default function ProfileScreen() {
  const { logout, user, token, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [badges, setBadges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);



  // ✅ Use your Render API
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';


 

  // -------------------- Logout --------------------
  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // -------------------- Fetch stats --------------------
  const fetchStats = async () => {
    if (!user?._id) return;
    setLoading(true);
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

  // Fetch stats on mount and when screen comes into focus
  useEffect(() => {
    fetchStats();
  }, [user, token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [user, token])
  );

  // -------------------- Fetch Badges --------------------
  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?._id) return;
      setLoadingBadges(true);
      try {
        const res = await axios.get(`${API_URL}/api/badges/${user._id}`);
        setBadges(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching badges:', err);
      } finally {
        setLoadingBadges(false);
      }
    };
    fetchBadges();
  }, [user]);

  // -------------------- Fetch Rewards --------------------
  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?._id) return;
      setLoadingRewards(true);
      try {
        const res = await axios.get(`${API_URL}/api/rewards/${user._id}`);
        setRewards(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching rewards:', err);
      } finally {
        setLoadingRewards(false);
      }
    };
    fetchRewards();
  }, [user]);

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
        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#6a21a8" />
          ) : (
            <>
              <MaterialCommunityIcons name="puzzle" size={28} color="#6a21a8" />
              <Text style={styles.statNumber}>{stats?.attemptCount ?? 0}</Text>
              <Text style={styles.statLabel}>Quizzes Solved</Text>
            </>
          )}
        </View>
        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#6a21a8" />
          ) : (
            <>
              <MaterialCommunityIcons name="star" size={28} color="#fbbf24" />
              <Text style={styles.statNumber}>{stats?.totalPoints ?? 0}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </>
          )}
        </View>
        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#6a21a8" />
          ) : (
            <>
              <MaterialCommunityIcons name="crown" size={28} color="#f59e0b" />
              <Text style={styles.statNumber}>{stats?.highestLevel ?? 0}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </>
          )}
        </View>
      </View>

      {/* Coins Section */}
      <View style={styles.coinsContainer}>
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.coinsCard}
        >
          <MaterialCommunityIcons name="cash-multiple" size={40} color="#fff" />
          <View style={styles.coinsTextContainer}>
            <Text style={styles.coinsLabel}>Your Coins</Text>
            <Text style={styles.coinsValue}>{user?.coins ?? 0}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="medal" size={24} color="#a21caf" />
          <Text style={styles.sectionTitle}>Badges Earned</Text>
        </View>
        {loadingBadges ? (
          <ActivityIndicator size="small" color="#a21caf" style={{ marginVertical: 12 }} />
        ) : !badges || badges.length === 0 ? (
          <Text style={styles.emptyText}>No badges yet. Complete quests to earn badges!</Text>
        ) : (
          <FlatList
            data={badges}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.badgeCard}>
                <MaterialCommunityIcons name="medal" size={40} color="#fbbf24" />
                <Text style={styles.badgeName} numberOfLines={1}>
                  {item.name || item.title || "Badge"}
                </Text>
                <Text style={styles.badgeMeta}>
                  {item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString() : ""}
                </Text>
                {item.claimed && (
                  <View style={styles.claimedBadge}>
                    <Text style={styles.claimedText}>✓ Claimed</Text>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="gift" size={24} color="#10b981" />
          <Text style={styles.sectionTitle}>Rewards</Text>
        </View>
        {loadingRewards ? (
          <ActivityIndicator size="small" color="#10b981" style={{ marginVertical: 12 }} />
        ) : !rewards || rewards.length === 0 ? (
          <Text style={styles.emptyText}>No rewards yet. Keep playing to earn rewards!</Text>
        ) : (
          <FlatList
            data={rewards}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.rewardCard}>
                <MaterialCommunityIcons name="gift" size={40} color="#10b981" />
                <Text style={styles.rewardName} numberOfLines={1}>
                  {item.title || item.name || "Reward"}
                </Text>
                <Text style={styles.rewardMeta}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </Text>
                {item.claimed && (
                  <View style={styles.claimedBadge}>
                    <Text style={styles.claimedText}>✓ Claimed</Text>
                  </View>
                )}
              </View>
            )}
          />
        )}
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
  header: { 
    alignItems: 'center', 
    paddingTop: 40, 
    paddingBottom: 20, 
    backgroundColor: '#f3e8ff', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    elevation: 2 
  },
  profileImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 3, 
    borderColor: '#a21caf' 
  },
  name: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#4b0082', 
    marginTop: 10 
  },
  email: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 4 
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 30, 
    paddingHorizontal: 20 
  },
  statBox: { 
    backgroundColor: '#ede9fe', 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center', 
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#6a21a8',
    marginTop: 8,
  },
  statLabel: { 
    fontSize: 12, 
    color: '#444', 
    marginTop: 4, 
    textAlign: 'center' 
  },
  coinsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  coinsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    gap: 16,
  },
  coinsTextContainer: {
    flex: 1,
  },
  coinsLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  coinsValue: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '900',
    marginTop: 4,
  },
  section: { 
    marginTop: 30, 
    paddingHorizontal: 20 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3c0753',
  },
  emptyText: {
    color: '#999',
    fontSize: 13,
    marginBottom: 12,
  },
  badgeCard: {
    backgroundColor: '#fffbeb',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2d0c57',
    marginTop: 8,
    textAlign: 'center',
  },
  badgeMeta: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
  },
  rewardCard: {
    backgroundColor: '#ecfdf5',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2d0c57',
    marginTop: 8,
    textAlign: 'center',
  },
  rewardMeta: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
  },
  claimedBadge: {
    marginTop: 8,
    backgroundColor: '#d1fae5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  claimedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  option: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomColor: '#ddd', 
    borderBottomWidth: 1 
  },
  optionText: { 
    fontSize: 16, 
    marginLeft: 15, 
    color: '#3c0753', 
    fontWeight: '500' 
  },
});
