import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PopCounter } from '../../components/DynamicChart';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

// Toutes les actions disponibles pour le citoyen
const QUICK_ACTIONS = [
  { label: 'Mes Demandes', icon: 'list-outline', route: 'CitizenRequests', color: Colors.ciOrange },
  { label: 'Certificats', icon: 'document-text-outline', route: 'CertificateRequest', color: Colors.ciGreen },
  { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications', color: '#3b82f6' },
  { label: 'Urgence', icon: 'alert-circle-outline', route: 'Emergency', color: '#ef4444' },
  { label: 'Mon Profil', icon: 'person-outline', route: 'CitizenProfile', color: '#a855f7' },
  { label: 'Support', icon: 'chatbubble-outline', route: 'Support', color: Colors.ciOrange },
];

// Déclarations d'état civil accessibles au citoyen depuis chez lui
const DECLARATIONS = [
  { label: 'Déclarer une Naissance', icon: 'happy-outline', route: 'BirthDeclaration', color: Colors.ciGreen },
  { label: 'Déclarer un Décès', icon: 'leaf-outline', route: 'DeathDeclaration', color: '#64748b' },
  { label: 'Mariage / Divorce', icon: 'heart-outline', route: 'CitizenDeclaration', color: '#ec4899' },
  { label: 'Changement d\'Adresse', icon: 'home-outline', route: 'AddressChange', color: Colors.ciOrange },
  { label: 'Migration Interne', icon: 'map-outline', route: 'InternalMigration', color: '#6366f1' },
];

// Services sociaux
const SERVICES = [
  { label: 'Sécurité Sociale', icon: 'shield-checkmark-outline', route: 'SocialSecurity', color: Colors.ciGreen },
  { label: 'Recensement', icon: 'people-outline', route: 'CensusDetails', color: Colors.ciOrange },
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.ciOrange} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.flagStripe}>
          <View style={[styles.stripe, { backgroundColor: Colors.ciOrange }]} />
          <View style={[styles.stripe, { backgroundColor: Colors.ciWhite }]} />
          <View style={[styles.stripe, { backgroundColor: Colors.ciGreen }]} />
        </View>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Badge label="Citoyen" color={Colors.ciGreen} />
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* NNI */}
      {user.nni && (
        <View style={styles.section}>
          <Card style={styles.nniCard} accent={Colors.ciOrange}>
            <Text style={styles.nniLabel}>Numéro National d'Identification</Text>
            <Text style={styles.nniValue}>{user.nni}</Text>
          </Card>
        </View>
      )}

      {/* Compteur population */}
      <View style={styles.section}>
        <PopCounter value={29389142} label="Population Côte d'Ivoire (Live)" />
      </View>

      {/* Notification banner */}
      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.notifBanner}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={16} color={Colors.ciOrange} />
          <Text style={styles.notifText}>{unreadCount} nouvelle(s) notification(s)</Text>
          <Ionicons name="chevron-forward-outline" size={16} color={Colors.ciOrange} />
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
            <Ionicons name={action.icon as any} size={28} color={action.color} />
            <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Déclarations d'état civil */}
      <Text style={styles.sectionTitle}>Déclarer un Événement</Text>
      <View style={styles.declarationList}>
        {DECLARATIONS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.declarationItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.declarationIcon, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={styles.declarationLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Services sociaux */}
      <Text style={styles.sectionTitle}>Services Sociaux</Text>
      <View style={styles.declarationList}>
        {SERVICES.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.declarationItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.declarationIcon, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={styles.declarationLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: { marginBottom: 8 },
  flagStripe: { flexDirection: 'row', height: 4 },
  stripe: { flex: 1 },
  headerContent: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: 24, paddingTop: 60,
  },
  greeting: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  userName: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 8 },
  logoutBtn: {
    padding: 10, backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },

  section: { paddingHorizontal: 24, marginBottom: 12 },
  nniCard: {},
  nniLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  nniValue: { fontSize: 18, fontWeight: '900', color: Colors.ciOrange, fontFamily: 'monospace' },

  notifBanner: {
    marginHorizontal: 24, marginBottom: 12,
    backgroundColor: `${Colors.ciOrange}10`, borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: `${Colors.ciOrange}30`,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  notifText: { flex: 1, fontSize: 13, color: Colors.ciOrange, fontWeight: '700' },

  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5,
    marginHorizontal: 24, marginBottom: 12, marginTop: 8,
  },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  actionCard: {
    width: '30%', backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 14, alignItems: 'center',
    borderWidth: 1, gap: 8,
  },
  actionLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 },

  declarationList: { marginHorizontal: 24, marginBottom: 8 },
  declarationItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: 16,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.border, gap: 14,
  },
  declarationIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  declarationLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#fff' },
});


