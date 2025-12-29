import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const THEME_DARK = "#4a044e";
const THEME_ACCENT = "#f3c999";

export default function SentRequestsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [sentRequestUsers, setSentRequestUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSent = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${API_URL}/api/friends/pending/${user._id}`);
      setSentRequestUsers(res.data.sent || []);
    } catch (err) {
      console.error('refreshSent error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSent();
  }, [user]);

  const cancelSentRequest = async (receiverId) => {
    try {
      await axios.post(`${API_URL}/api/friends/cancel/${receiverId}`, { senderId: user._id });
      refreshSent();
    } catch (err) { console.error(err); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Area - Consistent with Leaderboard & Friends */}
      <LinearGradient colors={[THEME_DARK, "#701a75"]} style={styles.headerArea}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sent Requests</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.infoBadge}>
           <MaterialCommunityIcons name="send-clock" size={18} color={THEME_ACCENT} />
           <Text style={styles.infoText}>Waiting for their response</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerBox}><ActivityIndicator size="large" color={THEME_DARK} /></View>
        ) : sentRequestUsers.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons name=" bird" size={60} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No Pending Invitations</Text>
            <Text style={styles.emptySub}>When you send a friend request, it will appear here until they accept.</Text>
            <TouchableOpacity 
                style={styles.findBtn} 
                onPress={() => navigation.navigate('FriendsScreen')}>
                <Text style={styles.findBtnText}>Find Friends</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sentRequestUsers.map((s) => (
            <View key={s._id} style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: s.profilePic || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                <View style={styles.statusDot} />
              </View>
              
              <View style={styles.info}>
                <Text style={styles.userName} numberOfLines={1}>{s.name}</Text>
                <View style={styles.timerRow}>
                    <MaterialCommunityIcons name="clock-outline" size={12} color="#94a3b8" />
                    <Text style={styles.subText}>Request pending...</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => cancelSentRequest(s._id)} 
                style={styles.cancelActionBtn}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="account-minus" size={18} color="#ef4444" />
                <Text style={styles.cancelActionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerArea: { paddingTop: 50, paddingBottom: 35, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 10 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  
  infoBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'center' },
  infoText: { color: 'rgba(255,255,255,0.9)', marginLeft: 8, fontWeight: '700', fontSize: 12 },

  scrollBody: { padding: 20, paddingBottom: 40 },
  centerBox: { marginTop: 50, alignItems: 'center' },
  
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 24, 
    marginBottom: 12, 
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.05, 
    shadowRadius: 10 
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f1f5f9', opacity: 0.85 },
  statusDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#fbbf24', borderWidth: 2, borderColor: '#fff' },
  
  info: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: '800', color: '#334155' },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  subText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  
  cancelActionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff1f2', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecdd3'
  },
  cancelActionText: { color: '#ef4444', fontWeight: '800', fontSize: 12, marginLeft: 5 },

  emptyBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: THEME_DARK },
  emptySub: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20, fontWeight: '600' },
  findBtn: { marginTop: 25, backgroundColor: THEME_DARK, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  findBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 }
});