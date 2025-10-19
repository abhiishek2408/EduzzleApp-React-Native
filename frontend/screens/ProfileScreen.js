// import React, { useContext, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as DocumentPicker from 'expo-document-picker';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

// export default function ProfileScreen() {
//   const { logout, user, token, setUser } = useContext(AuthContext);
//   const navigation = useNavigation();

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   console.log("Profile pic URL:", user?.profilePic);
//   console.log("Profile name:", user?.name);


//   const API_URL = "https://eduzzleapp-react-native.onrender.com"; // ✅ your backend URL

//   // ✅ Logout handler
//   const handleLogout = () => {
//     logout();
//     navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
//   };

//   // ✅ Fetch user stats
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         if (!user?._id) return;
//         const res = await axios.get(`${API_URL}/api/attempts/stats/${user._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStats(res.data);
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [user, token]);

//   // ✅ Pick and upload profile image
//   const handleImagePick = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: 'image/*',
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled) {
//         console.log('User cancelled image selection');
//         return;
//       }

//       const file = result.assets[0];

//       const formData = new FormData();
//       formData.append('profilePic', {
//         uri: file.uri,
//         name: file.name || 'profile.jpg',
//         type: file.mimeType || 'image/jpeg',
//       });

//       setUploading(true);

//       const response = await axios.put(`${API_URL}/api/user/profile-pic`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // ✅ Backend responds with updated user data
//       if (response.status === 200) {
//         setUser(response.data.user);
//         Alert.alert('✅ Success', 'Profile picture updated successfully!');
//       } else {
//         Alert.alert('Error', response.data?.message || 'Unexpected response.');
//       }
//     } catch (err) {
//       console.error('Upload error:', err.response?.data || err.message);

//       // Handle 500 errors gracefully
//       if (err.response?.status === 500) {
//         Alert.alert('Server Error', 'Something went wrong on the server.');
//       } else if (err.response?.status === 400) {
//         Alert.alert('Upload Failed', 'No file selected or invalid file type.');
//       } else {
//         Alert.alert('Error', 'Failed to upload profile picture.');
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleImagePick}>
//           {uploading ? (
//             <ActivityIndicator size="large" color="#a21caf" />
//           ) : (
//             <Image
//               source={{
//                 uri:
//                   user?.profilePic ||
//                   "https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png",
//               }}
//               style={styles.profileImage}
//             />
//           )}
//         </TouchableOpacity>

//         <Text style={styles.name}>{user?.name || "Guest"}</Text>
//         <Text style={styles.email}>{user?.email || "guest@example.com"}</Text>
//       </View>

//       {/* Stats Section */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statBox}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#6a21a8" />
//           ) : (
//             <Text style={styles.statNumber}>{stats?.attemptCount ?? 0}</Text>
//           )}
//           <Text style={styles.statLabel}>Puzzles Solved</Text>
//         </View>

//         <View style={styles.statBox}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#6a21a8" />
//           ) : (
//             <Text style={styles.statNumber}>{stats?.totalPoints ?? 0}</Text>
//           )}
//           <Text style={styles.statLabel}>Total Points</Text>
//         </View>

//         <View style={styles.statBox}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#6a21a8" />
//           ) : (
//             <Text style={styles.statNumber}>{stats?.highestLevel ?? "N/A"}</Text>
//           )}
//           <Text style={styles.statLabel}>Rank</Text>
//         </View>
//       </View>

//       {/* Options Section */}
//       <View style={styles.section}>
//         <TouchableOpacity style={styles.option}>
//           <Ionicons name="settings-outline" size={24} color="#6b21a8" />
//           <Text style={styles.optionText}>Settings</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.option}>
//           <Ionicons name="lock-closed-outline" size={24} color="#6b21a8" />
//           <Text style={styles.optionText}>Change Password</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.option} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={24} color="#6b21a8" />
//           <Text style={styles.optionText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fef9ff' },
//   header: {
//     alignItems: 'center',
//     paddingTop: 40,
//     paddingBottom: 20,
//     backgroundColor: '#f3e8ff',
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     elevation: 2,
//   },
//   profileImage: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     borderWidth: 3,
//     borderColor: '#a21caf',
//   },
//   name: { fontSize: 22, fontWeight: '700', color: '#4b0082', marginTop: 10 },
//   email: { fontSize: 14, color: '#555', marginTop: 4 },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 30,
//     paddingHorizontal: 20,
//   },
//   statBox: {
//     backgroundColor: '#ede9fe',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     width: '30%',
//   },
//   statNumber: { fontSize: 20, fontWeight: '600', color: '#6a21a8' },
//   statLabel: { fontSize: 12, color: '#444', marginTop: 4, textAlign: 'center' },
//   section: { marginTop: 40, paddingHorizontal: 30 },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomColor: '#ddd',
//     borderBottomWidth: 1,
//   },
//   optionText: {
//     fontSize: 16,
//     marginLeft: 15,
//     color: '#3c0753',
//     fontWeight: '500',
//   },
// });




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

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [socket, setSocket] = useState(null);

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

  // -------------------- Profile pic upload --------------------
  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'cancel') return;

      const file = result;
      const formData = new FormData();
      formData.append('profilePic', {
        uri: file.uri,
        name: file.name || 'profile.jpg',
        type: file.mimeType || 'image/jpeg',
      });

      setUploading(true);
      const response = await axios.put(`${API_URL}/api/user/profile-pic`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) setUser(response.data.user);
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  // -------------------- Fetch Friends & Pending Requests --------------------
  useEffect(() => {
    if (!user?._id) return;

    const fetchFriendsData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/friends/${user._id}`, {
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

      {/* Friend Search */}
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
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#4b0082', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 },
  friendBox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  friendPic: { width: 40, height: 40, borderRadius: 20 },
  acceptButton: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4CAF50', borderRadius: 6, marginLeft: 5 },
  rejectButton: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#F44336', borderRadius: 6, marginLeft: 5 },
});
