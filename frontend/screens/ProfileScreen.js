import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ProfileScreen() {
  const { logout, user, token } = useContext(AuthContext);
  const navigation = useNavigation();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://eduzzleapp-react-native.onrender.com/api/attempts/my-stats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color="#a21caf" />
        <Text style={styles.name}>{user?.name || "Guest"}</Text>
        <Text style={styles.email}>{user?.email || "guest@example.com"}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#6a21a8" />
          ) : (
            <Text style={styles.statNumber}>{stats?.attemptCount ?? 0}</Text>
          )}
          <Text style={styles.statLabel}>Puzzles Solved</Text>
        </View>

        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#6a21a8" />
          ) : (
            <Text style={styles.statNumber}>{stats?.totalPoints ?? 0}</Text>
          )}
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={styles.statBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#6a21a8" />
          ) : (
            <Text style={styles.statNumber}>
              {stats?.highestLevel || "N/A"}
            </Text>
          )}
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>

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
  name: { fontSize: 22, fontWeight: '700', color: '#4b0082', marginTop: 10 },
  email: { fontSize: 14, color: '#555', marginTop: 4 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statBox: {
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: { fontSize: 20, fontWeight: '600', color: '#6a21a8' },
  statLabel: { fontSize: 12, color: '#444', marginTop: 4, textAlign: 'center' },
  section: { marginTop: 40, paddingHorizontal: 30 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#3c0753',
    fontWeight: '500',
  },
});

