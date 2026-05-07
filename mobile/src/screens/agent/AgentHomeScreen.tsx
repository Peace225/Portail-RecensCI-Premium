import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { DynamicChart } from '../../components/DynamicChart';
import { FlagStripe } from '../../components/ui/FlagStripe';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const MODULES = [
  { label: 'Naissance', icon: 'happy-outline', route: 'BirthForm', color: '#10b981' },
  { label: 'Décès', icon: 'leaf-outline', route: 'DeathForm', color: '#64748b' },
  { label: 'Mariage', icon: 'heart-outline', route: 'MarriageForm', color: '#ec4899' },
  { label: 'Divorce', icon: 'scale-outline', route: 'DivorceForm', color: '#f59e0b' },
  { label: 'Mariage Coutumier', icon: 'library-outline', route: 'CustomaryMarriage', color: '#d97706' },
  { label: 'Naissance Terrain', icon: 'leaf-outline', route: 'OutOfFacilityBirth', color: '#16a34a' },
  { label: 'Accident', icon: 'car-outline', route: 'AccidentForm', color: '#f97316' },
  { label: 'Homicide', icon: 'warning-outline', route: 'HomicideForm', color: '#ef4444' },
  { label: 'Mort Maternelle', icon: 'medical-outline', route: 'MaternalDeath', color: '#be185d' },
  { label: 'Migration Int.', icon: 'airplane-outline', route: 'InternationalMigration', color: '#0ea5e9' },
  { label: 'Migration Interne', icon: 'map-outline', route: 'InternalMigration', color: '#6366f1' },
  { label: 'Alerte Sanitaire', icon: 'warning-outline', route: 'HealthAlerts', color: '#dc2626' },
];

export default function AgentHomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/analytics/dashboard');
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.ciOrange} />}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>Agent de terrain</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Déco.</Text>
        </TouchableOpacity>
      </View>

      {/* Stats rapides */}
      {stats && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow} contentContainerStyle={styles.statsContent}>
            {[
              { label: 'Citoyens', value: stats.citizens?.total || 0, color: Colors.ciOrange },
              { label: 'Naissances', value: stats.vitalEvents?.births || 0, color: '#10b981' },
              { label: 'Décès', value: stats.vitalEvents?.deaths || 0, color: '#64748b' },
              { label: 'Incidents', value: stats.incidents || 0, color: '#ef4444' },
            ].map((s) => (
              <Card key={s.label} style={styles.statCard} accent={s.color}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </Card>
            ))}
          </ScrollView>

          {/* Graphique événements vitaux */}
          <View style={styles.chartSection}>
            <DynamicChart
              title="Événements Vitaux"
              data={[
                { label: 'Naissances', value: stats.vitalEvents?.births || 0, color: '#10b981' },
                { label: 'Décès', value: stats.vitalEvents?.deaths || 0, color: '#64748b' },
                { label: 'Mariages', value: stats.vitalEvents?.marriages || 0, color: '#ec4899' },
                { label: 'Divorces', value: stats.vitalEvents?.divorces || 0, color: '#f59e0b' },
                { label: 'Migrations', value: stats.vitalEvents?.migrations || 0, color: '#6366f1' },
              ]}
            />
          </View>
        </>
      )}

      {/* Modules de saisie */}
      <Text style={styles.sectionTitle}>Modules de Saisie</Text>
      <View style={styles.modulesGrid}>
        {MODULES.map((mod) => (
          <TouchableOpacity
            key={mod.route}
            style={[styles.moduleCard, { borderColor: `${mod.color}30` }]}
            onPress={() => navigation.navigate(mod.route)}
            activeOpacity={0.7}
          >
            <Ionicons name={mod.icon as any} size={26} color={mod.color} style={{ marginBottom: 6 }} />
            <Text style={[styles.moduleLabel, { color: mod.color }]}>{mod.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Accès rapides */}
      <Text style={styles.sectionTitle}>Outils</Text>
      <View style={styles.toolsList}>
        {[
          { label: 'Carte des Incidents', icon: 'map-outline', route: 'IncidentMap' },
          { label: 'Certificats', icon: 'document-text-outline', route: 'CertificateRequest' },
          { label: 'Alertes Sanitaires', icon: 'warning-outline', route: 'HealthAlerts' },
          { label: 'Support', icon: 'chatbubble-outline', route: 'Support' },
        ].map((tool) => (
          <TouchableOpacity key={tool.route} style={styles.toolItem} onPress={() => navigation.navigate(tool.route)}>
            <Ionicons name={tool.icon as any} size={22} color={Colors.ciOrange} style={{ marginRight: 14 }} />
            <Text style={styles.toolLabel}>{tool.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24 },
  greeting: { fontSize: 12, color: Colors.ciOrange, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  userName: { fontSize: 22, fontWeight: '900', color: '#fff', marginTop: 2 },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { fontSize: 11, color: Colors.error, fontWeight: '800', textTransform: 'uppercase' },
  statsRow: { marginBottom: 8 },
  statsContent: { paddingHorizontal: 24, gap: 12 },
  chartSection: { paddingHorizontal: 24, marginBottom: 8 },
  statCard: { width: 110, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginHorizontal: 24, marginBottom: 12, marginTop: 16 },
  modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  moduleCard: { width: '30%', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1 },
  moduleLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 },
  toolsList: { marginHorizontal: 24, marginBottom: 40 },
  toolItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  toolLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#fff' },
  chevron: { fontSize: 22, color: Colors.textMuted },
});


