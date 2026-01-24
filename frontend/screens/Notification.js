import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

function Notification() {
  const { user, token } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    if (!user?._id || !token) return;
    try {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [user, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Helper to determine icon and color
  const getStyleConfig = (type) => {
    const configs = {
      welcome: { icon: 'hand-wave', color: '#10b981' },
      friendRequest: { icon: 'account-plus', color: '#701a75' },
      friendAccepted: { icon: 'check-decagram', color: '#10b981' },
      achievement: { icon: 'trophy', color: '#fbbf24' },
      system: { icon: 'shield-check', color: '#3b82f6' },
      default: { icon: 'bell', color: '#64748b' }
    };
    return configs[type] || configs.default;
  };

  const formatTime = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* --- PREMIUM HEADER --- */}
      <LinearGradient colors={['#4a044e', '#701a75']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length} New</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Stay updated with your learning progress</Text>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#701a75']} />}
      >
        {loading ? (
          <View style={styles.centerContainer}><ActivityIndicator size="large" color="#701a75" /></View>
        ) : notifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialCommunityIcons name="bell-off-outline" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        ) : (
          notifications.map((notif, idx) => {
            const { icon, color } = getStyleConfig(notif.type);
            const isUnread = idx < 2; // Logic placeholder for unread status

            return (
              <TouchableOpacity key={notif._id || notif.id} activeOpacity={0.7} style={[styles.card, isUnread && styles.unreadCard]}>
                <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                  <MaterialCommunityIcons name={icon} size={24} color={color} />
                </View>

                <View style={styles.mainContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.messageText} numberOfLines={2}>{notif.message}</Text>
                    {isUnread && <View style={styles.dot} />}
                  </View>
                  
                  <Text style={styles.timeText}>{formatTime(notif.createdAt || notif.timestamp)}</Text>

                  {/* ACTION BUTTONS: Only for Friend Requests */}
                  {notif.type === 'friendRequest' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.acceptBtn}>
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineBtn}>
                        <Text style={styles.declineText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {notif.from?.profilePic && (
                  <Image source={{ uri: notif.from.profilePic }} style={styles.avatar} />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    paddingTop: 60, paddingBottom: 25, paddingHorizontal: 25, 
    borderBottomLeftRadius: 35, borderBottomRightRadius: 35,
    elevation: 10, shadowColor: '#4a044e'
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  headerSubtitle: { color: '#f5d0fe', fontSize: 14, marginTop: 5, fontWeight: '500' },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  scrollContent: { padding: 20, paddingBottom: 100 },
  centerContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 18, fontWeight: '600', marginTop: 10 },

  card: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderRadius: 20, 
    marginBottom: 15, alignItems: 'flex-start',
    borderWidth: 1, borderColor: '#f1f5f9',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  unreadCard: { borderColor: '#fae8ff', backgroundColor: '#fffaff' },
  iconBox: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  mainContent: { flex: 1, marginLeft: 15, marginRight: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  messageText: { fontSize: 15, fontWeight: '700', color: '#1e293b', lineHeight: 20 },
  timeText: { fontSize: 12, color: '#94a3b8', marginTop: 6, fontWeight: '500' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#701a75', marginTop: 5 },

  avatar: { width: 40, height: 40, borderRadius: 12, borderWidth: 1.5, borderColor: '#f0abfc' },

  actionRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  acceptBtn: { backgroundColor: '#701a75', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  acceptText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  declineBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  declineText: { color: '#64748b', fontSize: 13, fontWeight: 'bold' },
});

export default Notification;