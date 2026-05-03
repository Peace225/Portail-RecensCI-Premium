import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../theme/colors';

const STAT_CONFIG = [
  { key: 'births', label: 'Naissances', icon: '👶', color: Colors.success },
  { key: 'deaths', label: 'Décès', icon: '🕊️', color: Colors.textMuted },
  { key: 'marriages', label: 'Mariages', icon: '💍', color: Colors.orange },
  { key: 'divorces', label: 'Divorces', icon: '⚖️', color: Colors.warning },
  { key: 'migrations', label: 'Migrations', icon: '🌍', color: Colors.info },
  { key: 'citizens', label: 'Citoyens', icon: '👤', color: Colors.admin },
];

export default function ReportsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/exports/stats');
      setStats(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.orange} size="large" /></View>;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} tintColor={Colors.orange} />}
    >
      <Text style={styles.title}>Rapports & Statistiques</Text>
      <View style={styles.grid}>
        {STAT_CONFIG.map(({ key, label, icon, color }) => (
          <Card key={key} style={styles.statCard} accent={color}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={[styles.statValue, { color }]}>{stats?.[key] ?? 0}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', alignItems: 'center', paddingVertical: 20 },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 },
});
