import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../theme/colors';

export default function AdminHomeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const accentColor = user.role === 'ENTITY_ADMIN' ? Colors.mairie : Colors.admin;

  const fetchStats = async () => {
    try {
      const endpoint = user.role === 'ENTITY_ADMIN' ? '/analytics/mairie' : '/analytics/dashboard';
      const { data } = await api.get(endpoint);
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const SECTIONS = user.role === 'ENTITY_ADMIN'
    ? [
        { label: 'Agents', icon: '👥', route: 'AgentList' },
        { label: 'Directions & Services', icon: '🏛️', route: 'Departments' },
        { label: 'Registres', icon: '📚', route: 'Registres' },
        { label: 'Paramètres', icon: '⚙️', route: 'Settings' },
      ]
    : [
        { label: 'Citoyens', icon: '👤', route: 'CitizenDatabase' },
        { label: 'Agents', icon: '👥', route: 'AgentList' },
        { label: 'Flux Citoyens', icon: '🔄', route: 'CitizenFlux' },
        { label: 'Validation', icon: '✅', route: 'CitizenValidation' },
        { label: 'Incidents', icon: '🚨', route: 'IncidentMap' },
        { label: 'Alertes Sanitaires', icon: '⚠️', route: 'HealthAlerts' },
        { label: 'Rapports', icon: '📊', route: 'Reports' },
        { label: 'Audit', icon: '🔍', route: 'AuditLogs' },
        { label: 'Clés API', icon: '🔑', route: 'ApiKeys' },
        { label: 'Support', icon: '💬', route: 'Support' },
      ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} />}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: `${accentColor}30` }]}>
        <View>
          <Text style={[styles.roleLabel, { color: accentColor }]}>
            {user.role === 'SUPER_ADMIN' ? 'Super Administrateur' : user.role === 'ADMIN' ? 'Administrateur' : 'Admin Entité'}
          </Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Déco.</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      {stats && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContent}>
          {user.role === 'ENTITY_ADMIN'
            ? [
                { label: 'Naissances', value: stats.births || 0 },
                { label: 'Mariages', value: stats.marriages || 0 },
                { label: 'En attente', value: stats.pendingEvents || 0 },
              ]
            : [
                { label: 'Citoyens', value: stats.citizens?.total || 0 },
                { label: 'En attente', value: stats.citizens?.pending || 0 },
                { label: 'Agents', value: stats.agents || 0 },
                { label: 'Incidents', value: stats.incidents || 0 },
              ]
          }.map((s: any) => (
            <Card key={s.label} style={styles.statCard} accent={accentColor}>
              <Text style={[styles.statValue, { color: accentColor }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Sections */}
      <Text style={styles.sectionTitle}>Modules</Text>
      <View style={styles.grid}>
        {SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.route}
            style={[styles.sectionCard, { borderColor: `${accentColor}25` }]}
            onPress={() => navigation.navigate(section.route)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionIcon}>{section.icon}</Text>
            <Text style={[styles.sectionLabel, { color: accentColor }]}>{section.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, marginBottom: 16 },
  roleLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  userName: { fontSize: 22, fontWeight: '900', color: '#fff' },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { fontSize: 11, color: Colors.error, fontWeight: '800', textTransform: 'uppercase' },
  statsContent: { paddingHorizontal: 24, gap: 12, paddingBottom: 16 },
  statCard: { width: 110, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginHorizontal: 24, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, paddingBottom: 40 },
  sectionCard: { width: '30%', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1 },
  sectionIcon: { fontSize: 26, marginBottom: 6 },
  sectionLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 },
});
