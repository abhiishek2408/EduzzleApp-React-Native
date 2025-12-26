// src/screens/FriendsScreen.jsx
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
  Platform
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

export default function FriendsScreen() {
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [socket, setSocket] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // array of userIds
  const [sentRequestUsers, setSentRequestUsers] = useState([]); // array of user objects
  const [friends, setFriends] = useState([]);

  // Helper to refresh lists (pending, sent, friends)
  const refreshLists = async () => {
    if (!user?._id) return;
    setLoading(true);
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
      console.error('refreshLists error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Initialize Socket.IO --------------------
  useEffect(() => {
    if (!user?._id) return;
    const newSocket = io(API_URL, { query: { userId: user._id } });
    setSocket(newSocket);

    newSocket.on('friendRequestReceived', ({ from }) => {
      // When I receive a request, push sender into my pending list
      if (from?._id) setPendingRequests(prev => {
        if (prev.find(p => p._id === from._id)) return prev;
        return [...prev, from];
      });
    });

    newSocket.on('friendRequestAccepted', ({ by }) => {
      // When my sent request is accepted by 'by', remove from sent list and add friend
      if (by?._id) {
        setSentRequests(prev => prev.filter(id => id !== by._id));
        setSentRequestUsers(prev => prev.filter(u => u._id !== by._id));
        setFriends(prev => {
          if (prev.find(f => f._id === by._id)) return prev;
          return [...prev, by];
        });
      }
    });

    newSocket.on('friendRequestRejected', ({ by }) => {
      // When my sent request is rejected by 'by', remove from sent list
      if (by?._id) {
        setSentRequests(prev => prev.filter(id => id !== by._id));
        setSentRequestUsers(prev => prev.filter(u => u._id !== by._id));
      }
    });

    newSocket.on('friendRemoved', ({ friendId }) => {
      setFriends(prev => prev.filter(f => f._id !== friendId));
    });

    newSocket.on('friendRequestCancelled', ({ by }) => {
      if (by?._id) {
        setPendingRequests(prev => prev.filter(r => r._id !== by._id));
      }
    });

    return () => newSocket.disconnect();
  }, [user]);

  // -------------------- Fetch Friends & Pending Requests --------------------
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch pending (received & sent) requests
        const pendingRes = await axios.get(`${API_URL}/api/friends/pending/${user._id}`);
        setPendingRequests(pendingRes.data.received || []);
        setSentRequestUsers(pendingRes.data.sent || []);
        setSentRequests((pendingRes.data.sent || []).map(u => u._id));
        // Fetch actual friends list
        const friendsRes = await axios.get(`${API_URL}/api/friends/friends/${user._id}`);
        setFriends(friendsRes.data || []);
      } catch (err) {
        console.error('Friends fetch error:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);

  // -------------------- Search Users --------------------
  useEffect(() => {
    if (searchText.trim() === '') return setSearchResults([]);

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/search?query=${searchText}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(
          res.data.filter(
            u => u._id !== user._id && !friends.some(f => f._id === u._id)
          )
        );
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText, friends]);

  // -------------------- Friend Requests --------------------
  const sendFriendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/friends/send/${receiverId}`,
        { senderId: user._id }
      );
      if (Platform.OS === 'android') {
        ToastAndroid.show('Friend request sent!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Friend request sent!');
      }
      socket?.emit('friendRequestSent', res.data);
      // Mark this user as request sent to update UI
      setSentRequests(prev => prev.includes(receiverId) ? prev : [...prev, receiverId]);
      // Try to add full user object to sent list for the section
      const found = searchResults.find(u => u._id === receiverId);
      if (found) {
        setSentRequestUsers(prev => prev.find(u => u._id === receiverId) ? prev : [...prev, found]);
      }
    } catch (err) {
      console.error('Send request error:', err?.response?.data || err.message);
      const status = err?.response?.status;
      if (status === 502 || status === 503 || !status) {
        Alert.alert('Server Unavailable', 'The server is temporarily unavailable. Please try again in a moment.');
      } else {
        Alert.alert('Error', err?.response?.data?.message || 'Failed to send friend request.');
      }
    }
  };

  const acceptRequest = async (sender) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/friends/accept/${sender._id}`,
        { receiverId: user._id }
      );
      // After accept, refresh lists
      setFriends(prev => (prev.find(f => f._id === sender._id) ? prev : [...prev, sender]));
      setPendingRequests(prev => prev.filter(r => r._id !== sender._id));
      socket?.emit('friendRequestAccepted', { senderId: sender._id });
    } catch (err) {
      console.error('Accept error:', err?.response?.data || err.message);
    }
  };

  const rejectRequest = async (senderId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/reject/${senderId}`,
        { receiverId: user._id }
      );
      setPendingRequests(prev => prev.filter(r => r._id !== senderId));
      socket?.emit('friendRequestRejected', { senderId });
    } catch (err) {
      console.error('Reject error:', err?.response?.data || err.message);
    }
  };

  const cancelSentRequest = async (receiverId) => {
    try {
      // Try the cancel endpoint first
      await axios.post(
        `${API_URL}/api/friends/cancel/${receiverId}`,
        { senderId: user._id }
      );
      setSentRequests(prev => prev.filter(id => id !== receiverId));
      setSentRequestUsers(prev => prev.filter(u => u._id !== receiverId));
      // Show success feedback
      if (Platform.OS === 'android') {
        ToastAndroid.show('Friend request cancelled', ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', 'Friend request cancelled');
      }
    } catch (err) {
      // Fallback: if cancel endpoint not available (404), use reject route
      const status = err?.response?.status;
      // Handle server unavailable errors
      if (status === 502 || status === 503 || !status) {
        Alert.alert('Server Unavailable', 'The server is temporarily unavailable. Please try again in a moment.');
        return;
      }
      if (status === 404) {
        try {
          await axios.post(
            `${API_URL}/api/friends/reject/${user._id}`,
            { receiverId }
          );
          setSentRequests(prev => prev.filter(id => id !== receiverId));
          setSentRequestUsers(prev => prev.filter(u => u._id !== receiverId));
          if (Platform.OS === 'android') {
            ToastAndroid.show('Friend request cancelled', ToastAndroid.SHORT);
          } else {
            Alert.alert('Success', 'Friend request cancelled');
          }
        } catch (fallbackErr) {
          const fallbackStatus = fallbackErr?.response?.status;
          if (fallbackStatus === 502 || fallbackStatus === 503 || !fallbackStatus) {
            Alert.alert('Server Unavailable', 'The server is temporarily unavailable. Please try again in a moment.');
            return;
          }
          const fMsg = fallbackErr?.response?.data?.message || fallbackErr?.message || 'Failed to cancel friend request.';
          Alert.alert('Error', fMsg);
        }
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Failed to cancel friend request.';
        Alert.alert('Error', msg);
      }
    }
    // Ensure lists are in sync
    refreshLists();
  };

  const handleUnfriend = async (friendId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/remove/${friendId}`,
        { userId: user._id }
      );
      setFriends(prev => prev.filter(f => f._id !== friendId));
      socket?.emit('friendRemoved', { friendId });
    } catch (err) {
      console.error('Unfriend error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to remove friend.');
    }
  };

  if (loading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerTitle}>Friends</Text>
        <View style={styles.section}><CardSkeleton /></View>
        <View style={styles.section}><CardSkeleton /></View>
        <View style={styles.section}><CardSkeleton /></View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={styles.headerTitle}>Friends</Text>

      {/* Search Users */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="account-search" size={24} color="#a21caf" />
          <Text style={styles.sectionTitle}>Search Users</Text>
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Type a name..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {searchResults.map(u => {
          const isSent = sentRequests.includes(u._id);
          return (
            <View key={u._id} style={styles.friendBox}>
              <Image source={{ uri: u.profilePic }} style={styles.friendPic} />
              <Text style={styles.friendName} numberOfLines={1} ellipsizeMode="tail">{u.name}</Text>
              {isSent ? (
                <View style={styles.sentButton}>
                  <MaterialCommunityIcons name="check" size={18} color="#6b7280" />
                  <Text style={styles.sentButtonText}>Sent</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => sendFriendRequest(u._id)}
                  style={styles.addButton}
                >
                  <MaterialCommunityIcons name="account-plus" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Pending Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Pending Requests</Text>
        </View>
        {pendingRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        ) : (
          pendingRequests.map(r => (
            <View key={r._id} style={styles.friendBox}>
              <Image
                source={{ uri: r.profilePic }}
                style={styles.friendPic}
              />
              <Text style={styles.friendName} numberOfLines={1} ellipsizeMode="tail">{r.name}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => acceptRequest(r)}
                  style={styles.acceptButton}
                >
                  <MaterialCommunityIcons name="check" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => rejectRequest(r._id)}
                  style={styles.rejectButton}
                >
                  <MaterialCommunityIcons name="close" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Sent Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="send" size={24} color="#6366f1" />
          <Text style={styles.sectionTitle}>Sent Requests</Text>
        </View>
        {sentRequestUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clock-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No sent requests</Text>
          </View>
        ) : (
          sentRequestUsers.map(s => (
            <View key={s._id} style={styles.sentRow}>
              <View style={styles.sentLeft}>
                <Image source={{ uri: s.profilePic }} style={[styles.friendPic, styles.sentPic]} />
                <Text style={styles.sentName} numberOfLines={1} ellipsizeMode="tail">{s.name}</Text>
              </View>
              <View style={styles.sentActionsRight}>
                <View style={styles.sentButton}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#6b7280" />
                  <Text style={styles.sentButtonText}>Pending</Text>
                </View>
                <TouchableOpacity
                  onPress={() => cancelSentRequest(s._id)}
                  style={styles.cancelButton}
                >
                  <MaterialCommunityIcons name="close" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Friends List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="account-heart" size={24} color="#10b981" />
          <Text style={styles.sectionTitle}>Friends</Text>
        </View>
        {friends.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-off-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>You have no friends yet</Text>
          </View>
        ) : (
          friends.map(f => (
            <View key={f._id} style={styles.friendBox}>
              <Image source={{ uri: f.profilePic }} style={styles.friendPic} />
              <Text style={styles.friendName} numberOfLines={1} ellipsizeMode="tail">{f.name}</Text>
              <TouchableOpacity
                onPress={() => handleUnfriend(f._id)}
                style={styles.unfriendButton}
              >
                <MaterialCommunityIcons name="account-minus" size={18} color="#fff" />
                <Text style={styles.buttonText}>Unfriend</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fef9ff',
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#a21caf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
  },
  section: { 
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#2d0c57',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: { 
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  friendBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#faf7fb',
    borderRadius: 12,
    marginBottom: 8,
  },
  friendPic: { 
    width: 50, 
    height: 50, 
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e879f9',
  },
  friendName: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#2d0c57',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#a21caf',
    borderRadius: 8,
  },
  sentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sentBox: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#faf7fb',
    borderRadius: 12,
    marginBottom: 8,
  },
  sentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: '#faf7fb',
    borderRadius: 12,
    marginBottom: 8,
  },
  sentLeft: {
    width: 110,
    alignItems: 'flex-start',
  },
  sentName: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#2d0c57',
  },
  sentActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentPic: {
    marginLeft: 12,
  },
  acceptButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    backgroundColor: '#10b981', 
    borderRadius: 8,
  },
  rejectButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    backgroundColor: '#ef4444', 
    borderRadius: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  unfriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  sentButtonText: {
    color: '#6b7280',
    fontWeight: '800',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
});
