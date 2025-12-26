import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Notification() {
  const { user, token } = useContext(AuthContext);
  const API_URL = 'https://eduzzleapp-react-native.onrender.com';
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications from API
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

  useEffect(() => {
    fetchNotifications();
  }, [user, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(API_URL, { query: { userId: user._id } });

    socket.on('friendRequestReceived', ({ from }) => {
      if (from?._id) {
        const newNotif = {
          id: Date.now(),
          type: 'friendRequest',
          from: from,
          message: `${from.name} sent you a friend request`,
          timestamp: new Date(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    });

    socket.on('friendRequestAccepted', ({ by }) => {
      if (by?._id) {
        const newNotif = {
          id: Date.now(),
          type: 'friendAccepted',
          from: by,
          message: `${by.name} accepted your friend request`,
          timestamp: new Date(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    });

    socket.on('friendRequestRejected', ({ by }) => {
      if (by?._id) {
        const newNotif = {
          id: Date.now(),
          type: 'friendRejected',
          from: by,
          message: `${by.name} rejected your friend request`,
          timestamp: new Date(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    });

    socket.on('friendRequestCancelled', ({ by }) => {
      if (by?._id) {
        const newNotif = {
          id: Date.now(),
          type: 'friendCancelled',
          from: by,
          message: `${by.name} cancelled their friend request`,
          timestamp: new Date(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const getNotificationIcon = (type, metadata) => {
    // Check for custom icon in metadata
    if (metadata?.icon) return metadata.icon;
    
    switch (type) {
      case 'welcome':
        return 'hand-wave';
      case 'friendRequest':
        return 'account-plus';
      case 'friendAccepted':
        return 'check-circle';
      case 'friendRejected':
        return 'close-circle';
      case 'friendCancelled':
        return 'cancel';
      case 'achievement':
        return 'trophy';
      case 'system':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type, metadata) => {
    // Check for custom color in metadata
    if (metadata?.color) return metadata.color;
    
    switch (type) {
      case 'welcome':
        return '#10b981';
      case 'friendRequest':
        return '#a21caf';
      case 'friendAccepted':
        return '#10b981';
      case 'friendRejected':
        return '#ef4444';
      case 'friendCancelled':
        return '#f59e0b';
      case 'achievement':
        return '#fbbf24';
      case 'system':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="bell" size={28} color="#a21caf" />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#a21caf']} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a21caf" />
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={64} color="#ddd" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map(notif => (
            <View key={notif._id || notif.id} style={styles.notificationCard}>
              <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notif.type, notif.metadata) + '20' }]}>
                <MaterialCommunityIcons 
                  name={getNotificationIcon(notif.type, notif.metadata)} 
                  size={24} 
                  color={getNotificationColor(notif.type, notif.metadata)} 
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationMessage}>{notif.message}</Text>
                <Text style={styles.notificationTime}>{formatTime(notif.createdAt || notif.timestamp)}</Text>
              </View>
              {notif.from?.profilePic && (
                <Image source={{ uri: notif.from.profilePic }} style={styles.notificationAvatar} />
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2d0c57',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d0c57',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 13,
    color: '#999',
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e879f9',
  },
});

export default Notification;
