import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data || []);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={Colors.orange} size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>
      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        notifications.map((n: any) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.card, !n.read && styles.cardUnread]}
            onPress={() => !n.read && markRead(n.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              {!n.read && <View style={styles.dot} />}
            </View>
            <Text style={styles.cardContent}>{n.content}</Text>
            <Text style={styles.cardDate}>{new Date(n.createdAt).toLocaleDateString('fr-FR')}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 20 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardUnread: { borderColor: `${Colors.orange}40` },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.orange },
  cardContent: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  cardDate: { fontSize: 10, color: Colors.textMuted, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
});
