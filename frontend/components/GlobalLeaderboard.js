import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import CardSkeleton from './CardSkeleton';

const GlobalLeaderboard = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Helper for retrying API calls on 429
  const retryOn429 = async (fn, maxRetries = 3, delay = 1500) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await fn();
      } catch (err) {
        if (err.response?.status === 429) {
          if (attempt === maxRetries - 1) throw err;
          await new Promise(res => setTimeout(res, delay * (attempt + 1)));
          attempt++;
        } else {
          throw err;
        }
      }
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await retryOn429(() => axios.get(`${API_URL}/api/leaderboard/global?limit=100`, config));
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        Alert.alert('Too Many Requests', 'You are making requests too quickly. Please wait and try again.');
      } else {
        console.error('Error fetching global leaderboard:', err?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- 🔥 SAME HEADER AS FRIENDS LEAGUE --- */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="bg-fuchsia-100 p-2 rounded-xl mr-3">
            <MaterialCommunityIcons name="earth" size={20} color="#4a044e" />
          </View>
          <View>
            <Text className="text-xl font-black text-slate-800 tracking-tight">Global World</Text>
            <Text className="text-[10px] font-bold text-[#701a75] uppercase">Top Players</Text>
          </View>
        </View>

        {!loading && leaderboard.length >= 2 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('FullGlobalLeaderboard')}
            className="bg-fuchsia-50 px-3 py-1.5 rounded-full border border-fuchsia-100"
          >
            <Text className="text-xs font-black text-fuchsia-700">VIEW ALL</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* --- PREMIUM GLOBAL CARD --- */}
      <View style={styles.mainCard}>
        {loading ? (
          <CardSkeleton />
        ) : leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="trophy-outline" size={48} color="#e2e8f0" />
            <Text style={styles.emptyText}>No world rankings found!</Text>
          </View>
        ) : (
          <View>
            {leaderboard.slice(0, 3).map((player, index) => {
              const isCurrentUser = user && player.userId.toString() === user._id.toString();
              const rank = index + 1;

              return (
                <TouchableOpacity
                  key={player.userId}
                  activeOpacity={0.8}
                  style={[
                    styles.rankRow,
                    isCurrentUser && styles.currentUserRow
                  ]}
                >
                  {/* Rank Badge */}
                  <View style={styles.rankContainer}>
                    {rank === 1 ? (
                      <View style={[styles.medalBg, { backgroundColor: '#fef3c7' }]}>
                        <MaterialCommunityIcons name="crown" size={18} color="#fbbf24" />
                      </View>
                    ) : rank === 2 ? (
                      <View style={[styles.medalBg, { backgroundColor: '#f1f5f9' }]}>
                        <MaterialCommunityIcons name="medal" size={18} color="#94a3b8" />
                      </View>
                    ) : rank === 3 ? (
                      <View style={[styles.medalBg, { backgroundColor: '#ffedd5' }]}>
                        <MaterialCommunityIcons name="medal" size={18} color="#d97706" />
                      </View>
                    ) : (
                      <Text style={styles.rankText}>{rank}</Text>
                    )}
                  </View>

                  {/* Avatar */}
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: player.profilePic }} style={styles.avatar} />
                    {isCurrentUser && <View style={styles.onlineDot} />}
                  </View>

                  {/* Name & Stats */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.nameText} numberOfLines={1}>
                      {isCurrentUser ? "You (🎯)" : player.name}
                    </Text>
                    <View style={styles.statsRow}>
                      <MaterialCommunityIcons name="globe-model" size={12} color="#4a044e" />
                      <Text style={styles.statsText}>{player.quizzesSolved} Solved</Text>
                    </View>
                  </View>

                  {/* Points Pill (Dark Purple for current user) */}
                  <LinearGradient
                    colors={isCurrentUser ? ['#4a044e', '#701a75'] : ['#f8fafc', '#f1f5f9']}
                    style={styles.pointsPill}
                  >
                    <Text style={[styles.pointsValue, isCurrentUser && { color: '#fff' }]}>
                      {player.totalPoints}
                    </Text>
                    <Text style={[styles.ptsLabel, isCurrentUser && { color: '#f5d0fe' }]}>PTS</Text>
                  </LinearGradient>
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
  container: { paddingHorizontal: 20, marginVertical: 10 },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    elevation: 6,
    shadowColor: '#4a044e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minWidth: 320, // Increased width for card
    alignSelf: 'center',
    width: '97%', // Make card a bit wider
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 22,
    marginBottom: 6,
  },
  currentUserRow: {
    backgroundColor: '#fdf4ff',
    borderWidth: 1,
    borderColor: '#fae8ff',
  },
  rankContainer: { width: 40, alignItems: 'center', justifyContent: 'center' },
  medalBg: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 16, fontWeight: '900', color: '#cbd5e1' },
  
  avatarWrapper: { position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f8fafc', borderWidth: 2, borderColor: '#fff' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#fff' },

  infoContainer: { flex: 1, marginLeft: 12 },
  nameText: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statsText: { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginLeft: 4 },

  pointsPill: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16, 
    alignItems: 'center', 
    minWidth: 65,
    justifyContent: 'center'
  },
  pointsValue: { fontSize: 15, fontWeight: '900', color: '#1e293b' },
  ptsLabel: { fontSize: 8, fontWeight: '900', color: '#94a3b8', marginTop: -2 },

  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontWeight: '700', marginTop: 12, textAlign: 'center' }
});

export default GlobalLeaderboard;