import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import CardSkeleton from './CardSkeleton';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const FriendsLeaderboard = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/leaderboard/friends/${user._id}`);
      if (res.data.success) setLeaderboard(res.data.leaderboard);
    } catch (err) {
      console.error('Error fetching friends leaderboard:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Section Header (Same as Daily Quest Style) --- */}
   <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="bg-fuchsia-100 p-2 rounded-xl mr-3">
            <MaterialCommunityIcons name="trophy-variant" size={20} color="#4a044e" />
          </View>
          <View>
            <Text className="text-xl font-black text-slate-800 tracking-tight">Friends League</Text>
            <Text className="text-[10px] font-bold text-[#701a75] uppercase">Weekly Standings</Text>
          </View>
        </View>

        {!loading && leaderboard.length >= 2 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('FullFriendsLeaderboard')}
            className="bg-fuchsia-50 px-3 py-1.5 rounded-full border border-fuchsia-100"
          >
            <Text className="text-xs font-black text-fuchsia-700">VIEW ALL</Text>
          </TouchableOpacity>
        )}
      </View>


      {/* --- Premium Leaderboard Card --- */}
      <View style={styles.mainCard}>
        {loading ? (
          <CardSkeleton />
        ) : leaderboard.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={50} color="#cbd5e1" />
            <Text style={styles.emptyText}>Add friends to start the race!</Text>
          </View>
        ) : (
          <View>
            {leaderboard.slice(0, 3).map((friend, index) => {
              const isCurrentUser = user && friend.userId.toString() === user._id.toString();
              const isTop = index === 0;

              return (
                <TouchableOpacity
                  key={friend.userId}
                  activeOpacity={0.8}
                  style={[
                    styles.rankRow,
                    isCurrentUser && styles.currentUserRow
                  ]}
                >
                  {/* Rank & Avatar */}
                  <View style={styles.leftSection}>
                    <View style={styles.rankCircle}>
                        {index === 0 ? (
                            <MaterialCommunityIcons name="crown" size={18} color="#facc15" />
                        ) : (
                            <Text style={styles.rankNumber}>{index + 1}</Text>
                        )}
                    </View>
                    
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: friend.profilePic }} style={styles.avatar} />
                        {isTop && <View style={styles.topBadge} />}
                    </View>
                  </View>

                  {/* Name & Subtitle */}
                  <View style={styles.midSection}>
                    <Text style={styles.userName} numberOfLines={1}>
                        {isCurrentUser ? "You (🎯)" : friend.name}
                    </Text>
                    <Text style={styles.userSub}>{friend.quizzesSolved} quizzes solved</Text>
                  </View>

                  {/* Points Pill */}
                  <View style={[styles.pointsPill, isCurrentUser && styles.pointsPillActive]}>
                    <Text style={[styles.pointsText, isCurrentUser && styles.pointsTextActive]}>
                        {friend.totalPoints}
                    </Text>
                    <Text style={[styles.ptsLabel, isCurrentUser && styles.ptsLabelActive]}>PTS</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginVertical: 15 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerIconBg: { padding: 6, borderRadius: 10, marginRight: 10 },
  titleText: { fontSize: 18, fontWeight: '900', color: '#1e293b', letterSpacing: -0.5 },
  
  viewAllBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fdf4ff', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fae8ff'
  },
  viewAllText: { fontSize: 10, fontWeight: '900', color: '#4a044e', marginRight: 2 },

  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 12,
    elevation: 8,
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minWidth: 320, // Increased width for card
    alignSelf: 'center',
    width: '97%', // Make card a bit wider
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginBottom: 4
  },
  currentUserRow: {
    backgroundColor: '#fdf4ff',
    borderWidth: 1,
    borderColor: '#fae8ff'
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  rankCircle: { width: 28, alignItems: 'center', justifyContent: 'center' },
  rankNumber: { fontSize: 14, fontWeight: '800', color: '#94a3b8' },
  
  imageContainer: { position: 'relative', marginLeft: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f1f5f9' },
  topBadge: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    backgroundColor: '#22c55e', 
    borderWidth: 2, 
    borderColor: '#fff' 
  },

  midSection: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 15, fontWeight: '800', color: '#334155' },
  userSub: { fontSize: 11, fontWeight: '600', color: '#94a3b8', marginTop: 1 },

  pointsPill: { 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 15, 
    alignItems: 'center',
    minWidth: 65
    
  },
  pointsPillActive: { backgroundColor: '#701a75',borderRadius: 15, },
  pointsText: { fontSize: 14, fontWeight: '900', color: '#4a044e' },
  pointsTextActive: { color: '#fff' },
  ptsLabel: { fontSize: 8, fontWeight: '800', color: '#94a3b8', marginTop: -2 },
  ptsLabelActive: { color: '#f5d0fe' },

  emptyState: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontWeight: '700', marginTop: 10, textAlign: 'center' }
});

export default FriendsLeaderboard;