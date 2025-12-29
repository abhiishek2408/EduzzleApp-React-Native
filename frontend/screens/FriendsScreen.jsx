import React, { useContext, useEffect, useState } from 'react';
import CardSkeleton from '../components/CardSkeleton';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet,
  ToastAndroid,
  Platform,
  StatusBar
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const THEME_DARK = "#4a044e";
const THEME_ACCENT = "#f3c999";

export default function FriendsScreen() {
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [socket, setSocket] = useState(null);
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [sentRequestUsers, setSentRequestUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  // Logic remains exactly same as your original code
  const refreshLists = async () => {
    if (!user?._id) return;
    try {
      const [pendingRes, friendsRes] = await Promise.all([
        axios.get(`${API_URL}/api/friends/pending/${user._id}`),
        axios.get(`${API_URL}/api/friends/friends/${user._id}`),
      ]);
      setPendingRequests(pendingRes.data.received || []);
      setSentRequestUsers(pendingRes.data.sent || []);
      setSentRequests((pendingRes.data.sent || []).map(u => u._id));
      setFriends(friendsRes.data || []);
    } catch (err) {
      console.error('refreshLists error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    const newSocket = io(API_URL, { query: { userId: user._id } });
    setSocket(newSocket);
    refreshLists();
    
    newSocket.on('friendRequestReceived', ({ from }) => refreshLists());
    newSocket.on('friendRequestAccepted', () => refreshLists());
    newSocket.on('friendRequestRejected', () => refreshLists());
    newSocket.on('friendRemoved', () => refreshLists());
    newSocket.on('friendRequestCancelled', () => refreshLists());

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    if (searchText.trim() === '') return setSearchResults([]);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/search?query=${searchText}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(res.data.filter(u => u._id !== user._id && !friends.some(f => f._id === u._id)));
      } catch (err) { console.error(err); }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchText, friends]);

  // Handlers (sendFriendRequest, acceptRequest, etc. - keep your existing implementation)
  const sendFriendRequest = async (receiverId) => {
    try {
      const res = await axios.post(`${API_URL}/api/friends/send/${receiverId}`, { senderId: user._id });
      socket?.emit('friendRequestSent', res.data);
      refreshLists();
      ToastAndroid.show('Request Sent!', ToastAndroid.SHORT);
    } catch (err) { Alert.alert('Error', 'Failed to send request'); }
  };

  const acceptRequest = async (sender) => {
    try {
      await axios.post(`${API_URL}/api/friends/accept/${sender._id}`, { receiverId: user._id });
      socket?.emit('friendRequestAccepted', { senderId: sender._id });
      refreshLists();
    } catch (err) { console.error(err); }
  };

  const rejectRequest = async (senderId) => {
    try {
      await axios.post(`${API_URL}/api/friends/reject/${senderId}`, { receiverId: user._id });
      socket?.emit('friendRequestRejected', { senderId });
      refreshLists();
    } catch (err) { console.error(err); }
  };

  const handleUnfriend = (id) => {
    Alert.alert("Unfriend", "Are you sure?", [
        { text: "Cancel" },
        { text: "Remove", onPress: async () => {
            await axios.post(`${API_URL}/api/friends/remove/${id}`, { userId: user._id });
            refreshLists();
        }}
    ]);
  };

  const cancelSentRequest = async (receiverId) => {
    try {
      await axios.post(`${API_URL}/api/friends/cancel/${receiverId}`, { senderId: user._id });
      refreshLists();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[THEME_DARK, "#701a75"]} style={styles.header}><Text style={styles.headerTitle}>Friends</Text></LinearGradient>
      <View style={{padding: 20}}><CardSkeleton /><CardSkeleton /></View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
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
                <MaterialCommunityIcons name="close" size={28} color="#2d0c57" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('PendingRequests'); }}>
              <MaterialCommunityIcons name="account-clock" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Pending Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setDrawerOpen(false); navigation.navigate('SentRequests'); }}>
              <MaterialCommunityIcons name="send" size={24} color="#6b21a8" />
              <Text style={styles.drawerItemText}>Sent Requests</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Header Section */}
      <LinearGradient colors={[THEME_DARK, "#701a75"]} style={styles.header}>
        <TouchableOpacity 
          style={{position: 'absolute', left: 20, top: 60, zIndex: 2}} 
          onPress={() => setDrawerOpen(true)}
        >
          <MaterialCommunityIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Social Hub</Text>
        <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#999" />
            <TextInput
                style={styles.input}
                placeholder="Search new friends..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* Search Results Section */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>People You May Know</Text>
            {searchResults.map(u => {
              const isSent = sentRequests.includes(u._id);
              return (
                <View key={u._id} style={styles.userCard}>
                  <Image source={{ uri: u.profilePic || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                  <Text style={styles.userName}>{u.name}</Text>
                  <TouchableOpacity 
                    onPress={() => !isSent && sendFriendRequest(u._id)}
                    style={[styles.miniBtn, isSent ? styles.sentBtn : styles.addBtn]}>
                    <MaterialCommunityIcons name={isSent ? "check" : "account-plus"} size={16} color={isSent ? "#666" : "#fff"} />
                    <Text style={[styles.btnText, {color: isSent ? "#666" : "#fff"}]}>{isSent ? "Sent" : "Add"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Friend Requests</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>{pendingRequests.length}</Text></View>
            </View>
            {pendingRequests.map(r => (
              <View key={r._id} style={styles.userCard}>
                <Image source={{ uri: r.profilePic }} style={styles.avatar} />
                <View style={{flex: 1}}><Text style={styles.userName}>{r.name}</Text></View>
                <View style={styles.actionGroup}>
                    <TouchableOpacity onPress={() => acceptRequest(r)} style={styles.iconBtnCheck}>
                        <MaterialCommunityIcons name="check-bold" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => rejectRequest(r._id)} style={styles.iconBtnClose}>
                        <MaterialCommunityIcons name="close-thick" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Friends List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Friends ({friends.length})</Text>
          {friends.length === 0 ? (
            <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="account-group-outline" size={50} color="#cbd5e1" />
                <Text style={styles.emptyText}>Find some friends to compete with!</Text>
            </View>
          ) : (
            friends.map(f => (
              <View key={f._id} style={styles.userCard}>
                <Image source={{ uri: f.profilePic }} style={styles.avatar} />
                <View style={{flex: 1}}>
                    <Text style={styles.userName}>{f.name}</Text>
                    <Text style={styles.subText}>Online</Text>
                </View>
                <TouchableOpacity onPress={() => handleUnfriend(f._id)} style={styles.unfriendBtn}>
                    <MaterialCommunityIcons name="account-minus-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Sent Requests Section */}
        {sentRequestUsers.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sent Invitations</Text>
                {sentRequestUsers.map(s => (
                    <View key={s._id} style={styles.userCard}>
                        <Image source={{ uri: s.profilePic }} style={[styles.avatar, {opacity: 0.6}]} />
                        <Text style={[styles.userName, {color: '#94a3b8'}]}>{s.name}</Text>
                        <TouchableOpacity onPress={() => cancelSentRequest(s._id)} style={styles.cancelLink}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, height: 50, elevation: 5 },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  
  scrollBody: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 25 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: THEME_DARK, marginBottom: 12 },
  
  badge: { backgroundColor: THEME_ACCENT, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontWeight: '900', fontSize: 12, color: THEME_DARK },
  
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 20, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f1f5f9' },
  userName: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '700', color: '#1e293b' },
  subText: { marginLeft: 15, fontSize: 12, color: '#10b981', fontWeight: '600' },
  
  miniBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  addBtn: { backgroundColor: THEME_DARK },
  sentBtn: { backgroundColor: '#f1f5f9' },
  btnText: { fontSize: 12, fontWeight: '800', marginLeft: 4 },
  
  actionGroup: { flexDirection: 'row', gap: 8 },
  iconBtnCheck: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' },
  iconBtnClose: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  
  unfriendBtn: { padding: 8 },
  cancelLink: { padding: 8 },
  cancelText: { color: '#ef4444', fontWeight: '700', fontSize: 13 },
  
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 10, fontWeight: '600' },

  // Drawer styles
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawerContainer: {
    width: 260,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME_DARK,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_DARK,
    marginLeft: 16,
  },
});