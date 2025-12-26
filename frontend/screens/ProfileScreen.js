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
  const { logout, user, token, setUser, refreshUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);



  // ✅ Use your Render API
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';


 

  // -------------------- Logout --------------------
  const handleLogout = () => {
    // Clear auth state; AppNavigator will switch to auth stack automatically
    logout();
    // No manual reset needed; removing it avoids RESET warning on nested navigator
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
      // Refresh user to get latest coins, then fetch stats
      (async () => {
        try {
          await refreshUser?.();
        } catch {}
        await fetchStats();
      })();
    }, [token])
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

  // -------------------- Image Picker  // -------------------- Profile Pic Upload (Fetch Version) --------------------
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Drawer Menu */}
      {drawerOpen && (
        <TouchableOpacity 
          style={styles.drawerOverlay} 
          activeOpacity={1} 
          onPress={() => setDrawerOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={28} color="#2d0c57" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('StackFriends'); }}>
              <Ionicons name="people-outline" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Friends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('PremiumDashboard'); }}>
              <Ionicons name="diamond-outline" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Premium Plans</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('NotificationScreen'); }}>
              <Ionicons name="notifications-outline" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Notifications</Text>
            </TouchableOpacity>
            
            <View style={styles.drawerDivider} />
            
            <TouchableOpacity style={styles.drawerItem}>
              <Ionicons name="settings-outline" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('ChangePassword'); }}>
              <Ionicons name="lock-closed-outline" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Change Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.drawerItem, styles.logoutItem]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#dc2626" />
              <Text style={[styles.drawerItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setDrawerOpen(true)}
        >
          <Ionicons name="menu" size={28} color="#a21caf" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleImagePick} style={styles.profileImageContainer}>
          {uploading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Image
                source={{
                  uri:
                    user?.profilePic ||
                    'https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png',
                }}
                style={styles.profileImage}
              />
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
        
        {/* Rank Badge */}
        <View style={styles.rankBadge}>
          <MaterialCommunityIcons name="crown" size={18} color="#fbbf24" />
          <Text style={styles.rankBadgeText}>Rank #{stats?.highestLevel ?? '-'}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#fef3ff', '#fdf4ff']}
          style={styles.statBox}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#a21caf" />
          ) : (
            <>
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons name="puzzle" size={32} color="#a21caf" />
              </View>
              <Text style={styles.statNumber}>{stats?.attemptCount ?? 0}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </>
          )}
        </LinearGradient>
        
        <LinearGradient
          colors={['#fefce8', '#fef9c3']}
          style={styles.statBox}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#f59e0b" />
          ) : (
            <>
              <View style={[styles.statIconContainer, { backgroundColor: '#fff7ed' }]}>
                <MaterialCommunityIcons name="star" size={32} color="#f59e0b" />
              </View>
              <Text style={styles.statNumber}>{stats?.totalPoints ?? 0}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </>
          )}
        </LinearGradient>
        
        <LinearGradient
          colors={['#fef3ff', '#fae8ff']}
          style={styles.statBox}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#c026d3" />
          ) : (
            <>
              <View style={[styles.statIconContainer, { backgroundColor: '#f5f3ff' }]}>
                <MaterialCommunityIcons name="trophy" size={32} color="#c026d3" />
              </View>
              <Text style={styles.statNumber}>{badges.length ?? 0}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </>
          )}
        </LinearGradient>
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
              <LinearGradient
                colors={['#fffbeb', '#fef3c7']}
                style={styles.badgeCard}
              >
                <View style={styles.badgeIconContainer}>
                  <MaterialCommunityIcons name="medal" size={48} color="#fbbf24" />
                </View>
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
              </LinearGradient>
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
          />
        )}
      </View>

      {/* Options Section */}
    

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scrollContent: { paddingBottom: 180 },
  header: { 
    alignItems: 'center', 
    paddingTop: 40, 
    paddingBottom: 30,
    backgroundColor: '#f3e8ff',
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawerContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 0,
    elevation: 16,
    shadowColor: '#a21caf',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f3e8ff',
    borderBottomWidth: 2,
    borderBottomColor: '#e9d5ff',
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2d0c57',
    letterSpacing: 0.5,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 8,
    marginHorizontal: 15,
    gap: 16,
    backgroundColor: '#fff',
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  drawerItemText: {
    fontSize: 17,
    color: '#3c0753',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  drawerDivider: {
    height: 2,
    backgroundColor: '#f3e8ff',
    marginVertical: 20,
    marginHorizontal: 15,
  },
  logoutItem: {
    backgroundColor: '#fee2e2',
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '800',
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
    color: '#2d0c57', 
    marginTop: 10 
  },
  email: { 
    fontSize: 14, 
    color: '#6b21a8', 
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
    marginBottom: 16,
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#f3e8ff',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#3c0753',
    letterSpacing: 0.3,
  },
  emptyText: {
    color: '#999',
    fontSize: 13,
    marginBottom: 12,
  },
  badgeCard: {
    padding: 16,
    borderRadius: 18,
    marginRight: 14,
    alignItems: 'center',
    width: 150,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  badgeIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350f',
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
  profileImageContainer: {
    position: 'relative',
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#a21caf',
    borderRadius: 22,
    padding: 10,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#a21caf',
    letterSpacing: 0.5,
  },
  statIconContainer: {
    backgroundColor: '#f5f3ff',
    borderRadius: 50,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  option: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: { 
    fontSize: 16, 
    marginLeft: 15, 
    color: '#3c0753', 
    fontWeight: '600',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#a21caf',
    borderRadius: 22,
    padding: 10,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#a21caf',
    letterSpacing: 0.5,
  },
  statIconContainer: {
    backgroundColor: '#f5f3ff',
    borderRadius: 50,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
