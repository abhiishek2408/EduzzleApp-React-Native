import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const THEME_DARK = "#4a044e";
const THEME_ACCENT = "#f3c999";

export default function PendingRequestsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshPending = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${API_URL}/api/friends/pending/${user._id}`);
      setPendingRequests(res.data.received || []);
    } catch (err) {
      console.error('refreshPending error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPending();
  }, [user]);

  const acceptRequest = async (sender) => {
    try {
      await axios.post(`${API_URL}/api/friends/accept/${sender._id}`, { receiverId: user._id });
      refreshPending();
    } catch (err) { console.error(err); }
  };

  const rejectRequest = async (senderId) => {
    try {
      await axios.post(`${API_URL}/api/friends/reject/${senderId}`, { receiverId: user._id });
      refreshPending();
    } catch (err) { console.error(err); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient - Same as Leaderboard/Friends */}
      <LinearGradient colors={[THEME_DARK, "#701a75"]} style={styles.headerArea}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Friend Requests</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.statsBar}>
           <MaterialCommunityIcons name="account-clock" size={20} color={THEME_ACCENT} />
           <Text style={styles.statsText}>{pendingRequests.length} People want to connect</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerBox}><ActivityIndicator size="large" color={THEME_DARK} /></View>
        ) : pendingRequests.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="bell-off-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No new friend requests at the moment.</Text>
          </View>
        ) : (
          pendingRequests.map((r, index) => (
            <View key={r._id} style={styles.userCard}>
              <View style={styles.rankCircle}>
                <Text style={styles.rankNum}>{index + 1}</Text>
              </View>
              
              <Image source={{ uri: r.profilePic || 'https://via.placeholder.com/150' }} style={styles.avatar} />
              
              <View style={styles.info}>
                <Text style={styles.userName} numberOfLines={1}>{r.name}</Text>
                <Text style={styles.subText}>Invited you</Text>
              </View>

              <View style={styles.actionGroup}>
                <TouchableOpacity onPress={() => acceptRequest(r)} style={styles.acceptBtn}>
                  <MaterialCommunityIcons name="check-bold" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectRequest(r._id)} style={styles.rejectBtn}>
                  <MaterialCommunityIcons name="close-thick" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerArea: { paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.15)', paddingVertical: 8, borderRadius: 15 },
  statsText: { color: '#fff', marginLeft: 8, fontWeight: '700', fontSize: 13 },

  scrollBody: { padding: 20 },
  centerBox: { marginTop: 50, alignItems: 'center' },
  
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 22, 
    marginBottom: 12, 
    elevation: 4, 
    shadowColor: THEME_DARK, 
    shadowOpacity: 0.08, 
    shadowRadius: 10 
  },
  rankCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  rankNum: { fontSize: 10, fontWeight: '900', color: '#94a3b8' },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#f1f5f9', borderWidth: 2, borderColor: '#f3e8ff' },
  info: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  subText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginTop: 2 },
  
  actionGroup: { flexDirection: 'row', gap: 10 },
  acceptBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  rejectBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', elevation: 3 },

  emptyBox: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: THEME_DARK, marginTop: 15 },
  emptySub: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 40, fontWeight: '600' }
});
