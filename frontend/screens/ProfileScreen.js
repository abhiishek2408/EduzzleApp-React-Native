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
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const THEME_DARK = "#4a044e";
const THEME_ACCENT = "#f3c999";

export default function ProfileScreen() {
  const { logout, user, token, setUser, refreshUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const API_URL = 'https://eduzzleapp-react-native.onrender.com';

  const handleLogout = () => logout();

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

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try { await refreshUser?.(); } catch {}
        await fetchStats();
      })();
    }, [token])
  );

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?._id) return;
      setLoadingBadges(true);
      try {
        const res = await axios.get(`${API_URL}/api/badges/${user._id}`);
        setBadges(Array.isArray(res.data) ? res.data : []);
      } catch (err) { console.error(err); } finally { setLoadingBadges(false); }
    };
    fetchBadges();
  }, [user]);

  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (result.canceled || !result.assets?.length) return;
      const file = result.assets[0];
      const formData = new FormData();
      formData.append("profilePic", {
        uri: file.uri,
        type: file.mimeType || "image/jpeg",
        name: file.name || `profile.jpg`,
      });
      setUploading(true);
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_URL}/api/user/profile-pic`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response?.user) {
            setUser(response.user);
            Alert.alert("Success", "Profile updated!");
          }
        }
      };
      xhr.send(formData);
    } catch (err) { setUploading(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Drawer Overlay Menu */}
      {drawerOpen && (
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={() => setDrawerOpen(false)}>
          <LinearGradient colors={['#fff', '#f3e8ff']} style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}><Ionicons name="close-circle" size={32} color={THEME_DARK} /></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('StackFriends'); }}>
              <MaterialCommunityIcons name="account-group-outline" size={24} color={THEME_DARK} />
              <Text style={styles.drawerItemText}>My Friends List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('PremiumDashboard'); }}>
              <MaterialCommunityIcons name="crown-outline" size={24} color="#b45309" />
              <Text style={styles.drawerItemText}>Upgrade to Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.drawerItem, styles.logoutItem]} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="#dc2626" />
              <Text style={[styles.drawerItemText, {color: '#dc2626'}]}>Log Out</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Gradient */}
        <LinearGradient colors={[THEME_DARK, "#701a75"]} style={styles.headerArea}>
          <TouchableOpacity style={styles.menuTrigger} onPress={() => setDrawerOpen(true)}>
            <Ionicons name="grid-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.profileBox}>
            <TouchableOpacity onPress={handleImagePick} style={styles.avatarWrapper}>
              {uploading ? <ActivityIndicator size="large" color={THEME_ACCENT} /> : (
                <Image source={{ uri: user?.profilePic || 'https://via.placeholder.com/150' }} style={styles.avatar} />
              )}
              <View style={styles.camBadge}><Ionicons name="camera" size={14} color="#fff" /></View>
            </TouchableOpacity>
            <Text style={styles.nameText}>{user?.name || 'Player'}</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
            
            <View style={styles.levelBadge}>
               <MaterialCommunityIcons name="lightning-bolt" size={16} color={THEME_ACCENT} />
               <Text style={styles.levelText}>Master Level {stats?.highestLevel || 1}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Interaction Hub (Requests Buttons) */}
        <View style={styles.hubContainer}>
          <TouchableOpacity 
            style={[styles.hubBtn, {backgroundColor: '#f0fdf4'}]} 
            onPress={() => navigation.navigate('PendingRequests')}>
            <MaterialCommunityIcons name="account-arrow-left" size={24} color="#16a34a" />
            <Text style={styles.hubBtnText}>Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.hubBtn, {backgroundColor: '#eff6ff'}]} 
            onPress={() => navigation.navigate('SentRequests')}>
            <MaterialCommunityIcons name="account-arrow-right" size={24} color="#2563eb" />
            <Text style={styles.hubBtnText}>Sent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.hubBtn, {backgroundColor: '#fff7ed'}]} 
            onPress={() => navigation.navigate('StackFriends')}>
            <MaterialCommunityIcons name="account-multiple" size={24} color="#ea580c" />
            <Text style={styles.hubBtnText}>Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Coins & Stats */}
        <View style={styles.contentPadding}>
          <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.coinCard}>
            <View>
              <Text style={styles.coinLabel}>Available Balance</Text>
              <Text style={styles.coinValue}>{user?.coins || 0} Coins</Text>
            </View>
            <MaterialCommunityIcons name="database" size={45} color="rgba(255,255,255,0.4)" />
          </LinearGradient>

          <View style={styles.statsRow}>
            <View style={styles.statMiniCard}>
              <Text style={styles.statVal}>{stats?.attemptCount || 0}</Text>
              <Text style={styles.statLab}>Games</Text>
            </View>
            <View style={styles.statMiniCard}>
              <Text style={styles.statVal}>{stats?.totalPoints || 0}</Text>
              <Text style={styles.statLab}>Score</Text>
            </View>
            <View style={styles.statMiniCard}>
              <Text style={styles.statVal}>{badges.length}</Text>
              <Text style={styles.statLab}>Badges</Text>
            </View>
          </View>

          {/* Badges Section */}
          <Text style={styles.sectionTitle}>Hall of Fame</Text>
          {loadingBadges ? <ActivityIndicator color={THEME_DARK} /> : (
            <FlatList
              data={badges}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.badgeItem}>
                  <LinearGradient colors={['#fff', '#fef3c7']} style={styles.badgeCircle}>
                    <MaterialCommunityIcons name="medal" size={35} color="#d97706" />
                  </LinearGradient>
                  <Text style={styles.badgeNameText} numberOfLines={1}>{item.name || 'Champion'}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerArea: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  menuTrigger: { alignSelf: 'flex-end', padding: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12 },
  profileBox: { alignItems: 'center', marginTop: 10 },
  avatarWrapper: { width: 110, height: 110, borderRadius: 55, padding: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  avatar: { width: '100%', height: '100%', borderRadius: 55, borderWidth: 3, borderColor: '#fff' },
  camBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4a044e', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: THEME_DARK },
  nameText: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 15 },
  emailText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  levelText: { color: THEME_ACCENT, fontWeight: '800', fontSize: 13, marginLeft: 5 },

  hubContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -30 },
  hubBtn: { width: '30%', height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1 },
  hubBtnText: { fontSize: 12, fontWeight: '800', color: '#475569', marginTop: 5 },

  contentPadding: { padding: 20 },
  coinCard: { padding: 25, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, elevation: 8 },
  coinLabel: { color: '#fff', fontSize: 14, fontWeight: '700', opacity: 0.9 },
  coinValue: { color: '#fff', fontSize: 32, fontWeight: '900' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statMiniCard: { width: '31%', backgroundColor: '#fff', padding: 15, borderRadius: 20, alignItems: 'center', elevation: 2 },
  statVal: { fontSize: 20, fontWeight: '900', color: THEME_DARK },
  statLab: { fontSize: 12, color: '#94a3b8', fontWeight: '700' },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: THEME_DARK, marginBottom: 15 },
  badgeItem: { marginRight: 15, alignItems: 'center', width: 80 },
  badgeCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 3, marginBottom: 8 },
  badgeNameText: { fontSize: 11, fontWeight: '700', color: '#64748b', textAlign: 'center' },

  drawerOverlay: { position: 'absolute', zIndex: 999, top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row' },
  drawerContainer: { width: '75%', height: '100%', padding: 25, paddingTop: 60 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  drawerTitle: { fontSize: 24, fontWeight: '900', color: THEME_DARK },
  drawerItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, backgroundColor: '#fff', marginBottom: 15, elevation: 2 },
  drawerItemText: { marginLeft: 15, fontSize: 16, fontWeight: '700', color: '#334155' },
  logoutItem: { marginTop: 'auto', backgroundColor: '#fef2f2' }
});