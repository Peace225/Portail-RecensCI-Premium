import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DynamicChart, PopCounter } from '../../components/DynamicChart';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const QUICK_ACTIONS = [
  { label: 'Mes Demandes', icon: 'list-outline', route: 'CitizenRequests', color: Colors.orange },
  { label: 'Certificats', icon: 'document-text-outline', route: 'CertificateRequest', color: '#10b981' },
  { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications', color: '#3b82f6' },
  { label: 'Urgence', icon: 'alert-circle-outline', route: 'Emergency', color: '#ef4444' },
  { label: 'Mon Profil', icon: 'person-outline', route: 'CitizenProfile', color: '#a855f7' },
  { label: 'Support', icon: 'chatbubble-outline', route: 'Support', color: '#f59e0b' },
];

export default function CitizenHomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data || []);
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Badge label="Citoyen" color={Colors.orange} />
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* NNI Card */}
      {user.nni && (
        <Card style={styles.nniCard} accent={Colors.orange}>
          <Text style={styles.nniLabel}>Numéro National d'Identification</Text>
          <Text style={styles.nniValue}>{user.nni}</Text>
        </Card>
      )}

      {/* Compteur population */}
      <View style={styles.section}>
        <PopCounter value={29389142} label="Population Côte d'Ivoire (Live)" />
      </View>

      {/* Notifications badge */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.notifBanner} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.notifText}>🔔 {unreadCount} nouvelle(s) notification(s)</Text>
        </TouchableOpacity>
      )}

      {/* Actions rapides */}
      <Text style={styles.sectionTitle}>Actions Rapides</Text>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.route}
            style={[styles.actionCard, { borderColor: `${action.color}30` }]}
            onPress={() => navigation.navigate(action.route)}
            activeOpacity={0.7}
          >
            <Ionicons name={action.icon as any} size={28} color={action.color} style={{ marginBottom: 8 }} />
            <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Déclarations */}
      <Text style={styles.sectionTitle}>Déclarer un Événement</Text>
      <View style={styles.declarationList}>
        {[
          { label: 'Naissance', icon: 'happy-outline', route: 'BirthDeclaration' },
          { label: 'Décès', icon: 'leaf-outline', route: 'DeathDeclaration' },
          { label: 'Changement d\'adresse', icon: 'home-outline', route: 'AddressChange' },
        ].map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.declarationItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons name={item.icon as any} size={24} color={Colors.orange} style={{ marginRight: 16 }} />
            <Text style={styles.declarationLabel}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24, paddingTop: 60 },
  greeting: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  userName: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 8 },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { fontSize: 11, color: Colors.error, fontWeight: '800', textTransform: 'uppercase' },
  section: { paddingHorizontal: 24, marginBottom: 16 },
  nniCard: { marginHorizontal: 24, marginBottom: 16 },
  nniLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  nniValue: { fontSize: 18, fontWeight: '900', color: Colors.orange, fontFamily: 'monospace' },
  notifBanner: { marginHorizontal: 24, marginBottom: 16, backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)' },
  notifText: { fontSize: 13, color: '#3b82f6', fontWeight: '700' },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginHorizontal: 24, marginBottom: 12, marginTop: 8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 24 },
  actionCard: { width: '30%', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1 },
  actionLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 },
  declarationList: { marginHorizontal: 24, marginBottom: 40 },
  declarationItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  declarationLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#fff' },
  chevron: { fontSize: 24, color: Colors.textMuted },
});
