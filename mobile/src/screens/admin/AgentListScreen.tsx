import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const ROLE_COLORS: Record<string, string> = {
  AGENT: Colors.agent,
  ENTITY_ADMIN: Colors.mairie,
  ADMIN: Colors.admin,
  SUPER_ADMIN: '#dc2626',
};

export default function AgentListScreen() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await api.get('/agents');
        setAgents(Array.isArray(data) ? data : (data?.data || []));
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les agents.');
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.ciOrange} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Agents ({agents.length})</Text>
      {agents.length === 0 ? (
        <View style={styles.empty}><Ionicons name="people-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} /><Text style={styles.emptyText}>Aucun agent</Text></View>
      ) : (
        agents.map((a: any) => (
          <View key={a.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{a.fullName || a.name}</Text>
                <Text style={styles.cardEmail}>{a.email}</Text>
                {a.institution && <Text style={styles.cardInstitution}>{a.institution?.name || a.institutionName}</Text>}
              </View>
              <Badge label={a.role} color={ROLE_COLORS[a.role] || Colors.textMuted} />
            </View>
          </View>
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
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardInfo: { flex: 1, marginRight: 12 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardEmail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardInstitution: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
});


