import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function CitizenFluxScreen() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      const { data } = await api.get('/citizens/pending');
      setCitizens(data || []);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les citoyens en attente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'investigate') => {
    setActionId(id);
    try {
      await api.patch(`/citizens/${id}/${action}`);
      setCitizens(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Action impossible.');
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.orange} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Flux Citoyens</Text>
      <Text style={styles.subtitle}>{citizens.length} en attente de validation</Text>
      {citizens.length === 0 ? (
        <View style={styles.empty}><Ionicons name="checkmark-circle-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} /><Text style={styles.emptyText}>Aucun citoyen en attente</Text></View>
      ) : (
        citizens.map((c: any) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{c.fullName || c.name}</Text>
              <Badge label="EN ATTENTE" color={Colors.warning} />
            </View>
            <Text style={styles.cardNni}>{c.nni}</Text>
            <Text style={styles.cardDate}>Soumis le {new Date(c.createdAt).toLocaleDateString('fr-FR')}</Text>
            <View style={styles.actions}>
              <Button
                title="Approuver"
                onPress={() => handleAction(c.id, 'approve')}
                loading={actionId === c.id}
                style={styles.actionBtn}
              />
              <Button
                title="Enquête"
                onPress={() => handleAction(c.id, 'investigate')}
                variant="danger"
                loading={actionId === c.id}
                style={styles.actionBtn}
              />
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
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 12, color: Colors.textMuted, marginBottom: 20 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  cardNni: { fontSize: 12, color: Colors.orange, fontFamily: 'monospace', marginBottom: 4 },
  cardDate: { fontSize: 11, color: Colors.textMuted, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, height: 42 },
});
