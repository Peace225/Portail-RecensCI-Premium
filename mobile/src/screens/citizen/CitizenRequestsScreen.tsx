import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Colors } from '../../theme/colors';

const STATUS_COLORS: Record<string, string> = {
  PENDING: Colors.warning,
  APPROVED: Colors.success,
  REJECTED: Colors.error,
  IN_PROGRESS: Colors.info,
};

export default function CitizenRequestsScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get(`/citizens/${user.id}/requests`);
        setRequests(data || []);
      } catch {
        Alert.alert('Erreur', 'Impossible de charger vos demandes.');
      } finally {
        setLoading(false);
      }
    };
    if (user.id) fetchRequests();
  }, [user.id]);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.orange} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mes Demandes</Text>
      {requests.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Aucune demande en cours</Text>
        </View>
      ) : (
        requests.map((req: any) => (
          <View key={req.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardType}>{req.type || req.eventType || 'Demande'}</Text>
                <Text style={styles.cardDate}>{new Date(req.createdAt).toLocaleDateString('fr-FR')}</Text>
              </View>
              <Badge label={req.status || 'PENDING'} color={STATUS_COLORS[req.status] || Colors.textMuted} />
            </View>
            {req.referenceNumber && (
              <Text style={styles.cardRef}>Réf: {req.referenceNumber}</Text>
            )}
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
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, marginRight: 12 },
  cardType: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  cardRef: { fontSize: 11, color: Colors.orange, marginTop: 8, fontFamily: 'monospace' },
});
