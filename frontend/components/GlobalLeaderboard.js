import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import CardSkeleton from './CardSkeleton';

const GlobalLeaderboard = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/leaderboard/global?limit=100`);
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Error fetching global leaderboard:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#6b7280';
    }
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFF9E6';
      case 2:
        return '#F5F5F5';
      case 3:
        return '#FFF4E6';
      default:
        return '#FAFAFA';
    }
  };

  // Always render the card, but show skeleton inside card if loading

  // Always render the card, but show skeleton or empty state inside

  return (
    <View className="my-6 bg-white">
      {/* Title and View All outside card */}
      <View className="flex-row mr-8 gap-9">
        {loading ? (
          <>
            <View className="w-8 h-8 rounded-full bg-gray-200 ml-2" />
            <View className="h-5 w-40 bg-gray-200 rounded ml-2" />
          </>
        ) : (
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="earth" size={32} color="#a21caf" style={{ marginLeft: 8 }} />
            <Text className="text-[18px] font-extrabold font-[Inter] bg-gradient-to-r from-violet-700 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md tracking-wide">Global Leaderboard</Text>
          </View>
        )}
        {!loading && leaderboard.length >= 2 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('FullGlobalLeaderboard')}
            className="flex-row items-center mr-4 py-1.5 px-3 bg-[#faf5ff] rounded-2xl border border-[#e9d5ff]"
            style={{ alignSelf: 'flex-start' }}
          >
            <Text className="text-xs font-bold text-[#a21caf] mr-1">View All</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#a21caf" />
          </TouchableOpacity>
        )}
      </View>

      <View className="rounded-3xl my-2 px-2 p-5 shadow-lg border border-purple-200 bg-white">
        <View className="px-2 space-y-8">
          {loading ? (
            <CardSkeleton />
          ) : leaderboard.length === 0 ? (
            <View className="items-center justify-center py-12 rounded-2xl mx-2 shadow-lg border border-purple-200 bg-white">
              <MaterialCommunityIcons name="trophy-outline" size={72} color="#ddd" />
              <Text className="mt-4 text-lg text-gray-400 font-bold">No users found!</Text>
            </View>
          ) : (
            leaderboard.slice(0, 3).map((player, index) => {
              const isCurrentUser = user && player.userId.toString() === user._id.toString();
              const marginClass = index !== 0 ? 'mt-2' : '';
              return (
                <TouchableOpacity
                  key={player.userId}
                  activeOpacity={0.9}
                  className={`flex-row items-center rounded-2xl p-3 border-2 shadow-lg bg-white ${marginClass} ${isCurrentUser ? 'border-purple-400' : 'border-transparent'} ${player.rank <= 3 ? 'border-2' : ''}`}
                >
                  {/* Left: Rank Medal */}
                  <View className="w-11 h-11 items-center justify-center rounded-full bg-white" style={player.rank <= 3 ? { backgroundColor: getRankColor(player.rank) + '25' } : {}}>
                    <Text className="text-2xl font-extrabold drop-shadow-md" style={{ color: getRankColor(player.rank) }}>
                      {getMedalIcon(player.rank)}
                    </Text>
                  </View>

                  {/* Center: Profile Picture */}
                  <Image
                    source={{ uri: player.profilePic }}
                    className={`w-14 h-14 rounded-full ml-3 border-2 shadow-md ${player.rank <= 3 ? '' : 'border-gray-200'}`}
                    style={player.rank <= 3 ? { borderColor: getRankColor(player.rank), borderWidth: 3 } : { borderColor: '#a21caf', borderWidth: 2 }}
                  />

                  {/* Right: Name and Points */}
                  <View className="flex-1 ml-3 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-extrabold text-gray-800 mb-1 drop-shadow-md" numberOfLines={1}>
                        {isCurrentUser ? 'You 🎯' : player.name}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <MaterialCommunityIcons name="puzzle-outline" size={16} color="#a21caf" />
                        <Text className="text-sm font-bold text-[#a21caf]">{player.quizzesSolved} solved</Text>
                      </View>
                    </View>
                    <View className="items-end bg-white px-3 py-1.5 rounded-xl min-w-[55px] shadow-md">
                      <Text className="text-xl font-extrabold text-purple-600 drop-shadow-md">{player.totalPoints}</Text>
                      <Text className="text-xs font-bold text-purple-700 -mt-0.5">pts</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};


export default GlobalLeaderboard;
