// src/screens/FriendsScreen.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  StyleSheet
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

export default function FriendsScreen() {
  const { user, token } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [socket, setSocket] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // -------------------- Initialize Socket.IO --------------------
  useEffect(() => {
    if (!user?._id) return;
    const newSocket = io(API_URL, { query: { userId: user._id } });
    setSocket(newSocket);

    newSocket.on('friendRequestReceived', (request) => {
      setPendingRequests(prev => [...prev, request]);
    });

    newSocket.on('friendRequestAccepted', ({ requestId, friend }) => {
      setFriends(prev => [...prev, friend]);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
    });

    newSocket.on('friendRequestRejected', ({ requestId }) => {
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
    });

    newSocket.on('friendRemoved', ({ friendId }) => {
      setFriends(prev => prev.filter(f => f._id !== friendId));
    });

    return () => newSocket.disconnect();
  }, [user]);

  // -------------------- Fetch Friends & Pending Requests --------------------
  useEffect(() => {
    if (!user?._id) return;

    const fetchFriendsData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/friends/pending/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data.friends || []);
        setPendingRequests(res.data.pending || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFriendsData();
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
  const sendFriendRequest = async (friendId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/friends/send`,
        { userId: user._id, friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Request sent!');
      socket?.emit('friendRequestSent', res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to send friend request.');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/friends/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const friend = res.data.friend;
      setFriends(prev => [...prev, friend]);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      socket?.emit('friendRequestAccepted', { requestId, friend });
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      socket?.emit('friendRequestRejected', { requestId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfriend = async (friendId) => {
    try {
      await axios.post(
        `${API_URL}/api/friends/remove`,
        { userId: user._id, friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(prev => prev.filter(f => f._id !== friendId));
      socket?.emit('friendRemoved', { friendId });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to remove friend.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search Users */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Users</Text>
        <TextInput
          style={styles.input}
          placeholder="Type a name..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchResults.map(u => (
          <View key={u._id} style={styles.friendBox}>
            <Image source={{ uri: u.profilePic }} style={styles.friendPic} />
            <Text style={{ flex: 1, marginLeft: 10 }}>{u.name}</Text>
            <TouchableOpacity
              onPress={() => sendFriendRequest(u._id)}
              style={styles.acceptButton}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Pending Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Requests</Text>
        {pendingRequests.length === 0 ? (
          <Text style={{ color: '#555' }}>No pending requests.</Text>
        ) : (
          pendingRequests.map(r => (
            <View key={r._id} style={styles.friendBox}>
              <Image
                source={{
                  uri: r.sender?.profilePic || r.receiver?.profilePic,
                }}
                style={styles.friendPic}
              />
              <Text style={{ flex: 1, marginLeft: 10 }}>
                {r.sender?.name || r.receiver?.name}
              </Text>
              {!r.accepted && r.receiver?._id === user._id && (
                <>
                  <TouchableOpacity
                    onPress={() => acceptRequest(r._id)}
                    style={styles.acceptButton}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => rejectRequest(r._id)}
                    style={styles.rejectButton}
                  >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))
        )}
      </View>

      {/* Friends List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {friends.length === 0 ? (
          <Text style={{ color: '#555' }}>You have no friends yet.</Text>
        ) : (
          friends.map(f => (
            <View key={f._id} style={styles.friendBox}>
              <Image source={{ uri: f.profilePic }} style={styles.friendPic} />
              <Text style={{ flex: 1, marginLeft: 10 }}>{f.name}</Text>
              <TouchableOpacity
                onPress={() => handleUnfriend(f._id)}
                style={styles.rejectButton}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Unfriend</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ff', paddingHorizontal: 20 },
  section: { marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#4b0082', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  friendBox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  friendPic: { width: 40, height: 40, borderRadius: 20 },
  acceptButton: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4CAF50', borderRadius: 6, marginLeft: 5 },
  rejectButton: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#F44336', borderRadius: 6, marginLeft: 5 },
});
