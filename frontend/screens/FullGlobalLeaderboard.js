import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const FullGlobalLeaderboard = ({ navigation }) => {
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

  const renderItem = ({ item }) => {
    const isCurrentUser = user && item.userId.toString() === user._id.toString();
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: getRankBgColor(item.rank) },
          isCurrentUser && styles.currentUserCard,
          item.rank <= 3 && styles.topRankCard,
        ]}
      >
        <View style={[
          styles.rankMedalContainer,
          item.rank <= 3 && { backgroundColor: getRankColor(item.rank) + '25' }
        ]}>
          <Text style={[styles.rankMedal, { color: getRankColor(item.rank) }]}>
            {getMedalIcon(item.rank)}
          </Text>
        </View>

        <Image
          source={{ uri: item.profilePic }}
          style={[
            styles.avatar,
            item.rank <= 3 && { borderColor: getRankColor(item.rank), borderWidth: 3 }
          ]}
        />

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.rank <= 3 && (
              <MaterialCommunityIcons name="crown" size={18} color={getRankColor(item.rank)} />
            )}
            {isCurrentUser && (
              <View style={styles.youBadge}>
                <Text style={styles.youText}>You</Text>
              </View>
            )}
          </View>
          <View style={styles.statsRow}>
            <MaterialCommunityIcons name="star" size={14} color="#fbbf24" />
            <Text style={styles.points}>{item.totalPoints} pts</Text>
            <Text style={styles.divider}>•</Text>
            <MaterialCommunityIcons name="puzzle" size={14} color="#4a044e" />
            <Text style={styles.quizzes}>{item.quizzesSolved} quizzes</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4a044e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Global Leaderboard</Text>
          <View style={{ width: 40 }} />
        </View>
        <ActivityIndicator size="large" color="#4a044e" style={{ marginTop: 50 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a044e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Global Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="earth" size={80} color="#ddd" />
          <Text style={styles.emptyText}>No users found!</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a044e']} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2d0c57',
  },
  listContent: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: '#4a044e',
  },
  topRankCard: {
    elevation: 6,
    shadowOpacity: 0.15,
  },
  rankMedalContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f9fafb',
  },
  rankMedal: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d0c57',
    marginRight: 8,
    flex: 1,
  },
  youBadge: {
    backgroundColor: '#4a044e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 6,
  },
  youText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    marginHorizontal: 8,
    color: '#ccc',
  },
  quizzes: {
    fontSize: 13,
    color: '#4a044e',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default FullGlobalLeaderboard;
