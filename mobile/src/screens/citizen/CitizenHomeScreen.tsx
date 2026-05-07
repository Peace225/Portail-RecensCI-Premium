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

// ── État civil ────────────────────────────────────────────────────────────────
const DECLARATIONS = [
  {
    label: 'Déclarer une Naissance',
    sub: 'Enregistrer un nouveau-né à l\'état civil',
    icon: 'happy-outline', route: 'BirthDeclaration', color: Colors.ciGreen,
  },
  {
    label: 'Déclarer un Décès',
    sub: 'Signaler le décès d\'un proche',
    icon: 'leaf-outline', route: 'DeathDeclaration', color: '#64748b',
  },
  {
    label: 'Mariage / Divorce',
    sub: 'Déclarer une union ou une séparation',
    icon: 'heart-outline', route: 'CitizenDeclaration', color: '#ec4899',
  },
  {
    label: 'Extrait de Naissance',
    sub: 'Demander une copie de votre acte de naissance',
    icon: 'document-outline', route: 'ExtraitNaissance', color: Colors.ciGreen,
  },
];

// ── Résidence & déplacements ──────────────────────────────────────────────────
const RESIDENCE = [
  {
    label: 'Changement d\'Adresse',
    sub: 'Mettre à jour votre adresse dans votre profil',
    icon: 'home-outline', route: 'AddressChange', color: Colors.ciOrange,
  },
  {
    label: 'Changement de Résidence',
    sub: 'Déménagement officiel avec dossier administratif (motif, justificatifs)',
    icon: 'location-outline', route: 'ResidenceChange', color: '#6366f1',
  },
  {
    label: 'Migration Interne',
    sub: 'Déplacement entre villes ou régions — suivi des flux nationaux',
    icon: 'map-outline', route: 'InternalMigration', color: '#0ea5e9',
  },
];

// ── Documents officiels ───────────────────────────────────────────────────────
const DOCUMENTS = [
  {
    label: 'CNI / Passeport',
    sub: 'Demande ou renouvellement de pièce d\'identité',
    icon: 'card-outline', route: 'CNIPasseport', color: '#3b82f6',
  },
  {
    label: 'Casier Judiciaire',
    sub: 'Bulletin n°3 pour emploi, visa, concours...',
    icon: 'shield-checkmark-outline', route: 'CasierJudiciaire', color: '#64748b',
  },
  {
    label: 'Bloquer / Signaler CNI',
    sub: 'Document perdu, volé ou détérioré',
    icon: 'ban-outline', route: 'BloquerCNI', color: Colors.ciOrange,
  },
];

// ── Services sociaux & sécurité ───────────────────────────────────────────────
const SERVICES = [
  {
    label: 'Recensement du Ménage',
    sub: 'Déclarer les membres de votre foyer au registre national',
    icon: 'people-outline', route: 'CensusDetails', color: Colors.ciOrange,
  },
  {
    label: 'Sécurité Sociale',
    sub: 'Affiliation et prestations sociales',
    icon: 'shield-checkmark-outline', route: 'SocialSecurity', color: Colors.ciGreen,
  },
  {
    label: 'Impôts & Taxes',
    sub: 'Consulter votre dossier fiscal',
    icon: 'cash-outline', route: 'ImpotsTaxes', color: '#f59e0b',
  },
  {
    label: 'Porter Plainte',
    sub: 'Signalement officiel transmis aux autorités',
    icon: 'megaphone-outline', route: 'PorterPlainte', color: '#ef4444',
  },
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

  // Composant réutilisable pour une liste de services avec sous-titres
  const ServiceList = ({ items }: { items: typeof DECLARATIONS }) => (
    <View style={styles.serviceList}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.serviceItem}
          onPress={() => navigation.navigate(item.route)}
          activeOpacity={0.75}
        >
          <View style={[styles.serviceIcon, { backgroundColor: `${item.color}18` }]}>
            <Ionicons name={item.icon as any} size={22} color={item.color} />
          </View>
          <View style={styles.serviceText}>
            <Text style={styles.serviceLabel}>{item.label}</Text>
            <Text style={styles.serviceSub} numberOfLines={1}>{item.sub}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.ciOrange} />}
    >
      {/* Header citoyen */}
      <View style={styles.headerContent}>
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

      {/* État civil */}
      <Text style={styles.sectionTitle}>État Civil</Text>
      <ServiceList items={DECLARATIONS} />

      {/* Résidence & déplacements */}
      <Text style={styles.sectionTitle}>Résidence & Déplacements</Text>
      <View style={styles.residenceNote}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.residenceNoteText}>
          3 démarches distinctes selon votre situation
        </Text>
      </View>
      <ServiceList items={RESIDENCE} />

      {/* Documents officiels */}
      <Text style={styles.sectionTitle}>Documents Officiels</Text>
      <ServiceList items={DOCUMENTS} />

      {/* Services sociaux */}
      <Text style={styles.sectionTitle}>Services & Sécurité</Text>
      <ServiceList items={SERVICES} />

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  headerContent: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: 24, paddingTop: 16,
    marginBottom: 8,
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
    marginHorizontal: 24, marginBottom: 10, marginTop: 16,
  },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  actionCard: {
    width: '30%', backgroundColor: Colors.bgCard,
    borderRadius: 16, padding: 14, alignItems: 'center',
    borderWidth: 1, gap: 8,
  },
  actionLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 },

  // Liste de services avec sous-titres
  serviceList: { marginHorizontal: 24, marginBottom: 4 },
  serviceItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: 16,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.border, gap: 14,
  },
  serviceIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  serviceText: { flex: 1 },
  serviceLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  serviceSub: { fontSize: 11, color: Colors.textMuted, lineHeight: 15 },

  // Note résidence
  residenceNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 24, marginBottom: 10, marginTop: -4,
  },
  residenceNoteText: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic' },
});


