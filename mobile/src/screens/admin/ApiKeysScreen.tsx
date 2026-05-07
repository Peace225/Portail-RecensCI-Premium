import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const STATUS_COLORS: Record<string, string> = { ACTIVE: Colors.success, REVOKED: Colors.error, EXPIRED: Colors.textMuted };

export default function ApiKeysScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  const fetchKeys = async () => {
    try {
      const { data } = await api.get('/admin/api-keys');
      setKeys(Array.isArray(data) ? data : (data?.data || []));
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les clés API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleRevoke = async (id: string) => {
    Alert.alert('Révoquer la clé', 'Cette action est irréversible. Confirmer ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Révoquer', style: 'destructive',
        onPress: async () => {
          setRevokeId(id);
          try {
            await api.patch(`/admin/api-keys/${id}/revoke`);
            fetchKeys();
          } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Impossible de révoquer.');
          } finally {
            setRevokeId(null);
          }
        },
      },
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.ciOrange} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Clés API</Text>
      {keys.length === 0 ? (
        <View style={styles.empty}><Ionicons name="key-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} /><Text style={styles.emptyText}>Aucune clé API</Text></View>
      ) : (
        keys.map((k: any) => (
          <View key={k.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{k.name}</Text>
                <Text style={styles.cardPrefix}>{k.keyPrefix}••••••••</Text>
                {k.organizationName && <Text style={styles.cardOrg}>{k.organizationName}</Text>}
              </View>
              <Badge label={k.status || 'ACTIVE'} color={STATUS_COLORS[k.status] || Colors.success} />
            </View>
            {isSuperAdmin && k.status !== 'REVOKED' && (
              <Button
                title="Révoquer"
                onPress={() => handleRevoke(k.id)}
                variant="danger"
                loading={revokeId === k.id}
                style={styles.revokeBtn}
              />
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
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardInfo: { flex: 1, marginRight: 12 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardPrefix: { fontSize: 12, color: Colors.ciOrange, fontFamily: 'monospace', marginTop: 2 },
  cardOrg: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  revokeBtn: { height: 40, marginTop: 4 },
});


