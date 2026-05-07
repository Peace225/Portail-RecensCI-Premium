import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function AuditLogsScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/admin/audit');
        setLogs(Array.isArray(data) ? data : (data?.data || []));
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les logs d\'audit.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.ciOrange} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Journal d'Audit</Text>
      {logs.length === 0 ? (
        <View style={styles.empty}><Ionicons name="document-text-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} /><Text style={styles.emptyText}>Aucun log disponible</Text></View>
      ) : (
        logs.map((log: any, index: number) => (
          <View key={log.id || index} style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardAction}>{log.action}</Text>
              <Text style={styles.cardDate}>{new Date(log.createdAt).toLocaleDateString('fr-FR')}</Text>
            </View>
            <Text style={styles.cardResource}>Ressource: {log.resource}</Text>
            <Text style={styles.cardUser}>{log.userEmail}</Text>
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
  card: { backgroundColor: Colors.bgCard, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardAction: { fontSize: 13, fontWeight: '800', color: Colors.ciOrange, flex: 1 },
  cardDate: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  cardResource: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  cardUser: { fontSize: 11, color: Colors.textMuted },
});


