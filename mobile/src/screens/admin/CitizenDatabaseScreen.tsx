import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const STATUS_COLORS: Record<string, string> = { ACTIVE: Colors.success, PENDING: Colors.warning, FLAGGED: Colors.error };

export default function CitizenDatabaseScreen() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCitizens = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/citizens${q ? `?search=${encodeURIComponent(q)}` : ''}`);
      setCitizens(data || []);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les citoyens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCitizens(); }, []);

  const handleAction = async (action: 'approve' | 'investigate') => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await api.patch(`/citizens/${selected.id}/${action}`);
      setSelected(null);
      fetchCitizens(search);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Action impossible.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Input label="" value={search} onChangeText={setSearch} placeholder="Rechercher par nom, NNI..." style={styles.searchInput} />
        <Button title="Chercher" onPress={() => fetchCitizens(search)} style={styles.searchBtn} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={Colors.orange} size="large" /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {citizens.length === 0 ? (
            <View style={styles.empty}><Ionicons name="person-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} /><Text style={styles.emptyText}>Aucun citoyen trouvé</Text></View>
          ) : (
            citizens.map((c: any) => (
              <TouchableOpacity key={c.id} style={styles.card} onPress={() => setSelected(c)} activeOpacity={0.8}>
                <View style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{c.fullName || c.name}</Text>
                    <Text style={styles.cardNni}>{c.nni}</Text>
                    <Text style={styles.cardCity}>{c.city}</Text>
                  </View>
                  <Badge label={c.status || 'ACTIVE'} color={STATUS_COLORS[c.status] || Colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{selected?.fullName || selected?.name}</Text>
            <Text style={styles.modalNni}>NNI: {selected?.nni}</Text>
            <Text style={styles.modalCity}>Ville: {selected?.city}</Text>
            <Badge label={selected?.status || 'ACTIVE'} color={STATUS_COLORS[selected?.status] || Colors.textMuted} />
            <View style={styles.modalActions}>
              <Button title="Valider" onPress={() => handleAction('approve')} loading={actionLoading} style={styles.modalBtn} />
              <Button title="Enquête" onPress={() => handleAction('investigate')} variant="danger" loading={actionLoading} style={styles.modalBtn} />
            </View>
            <Button title="Fermer" onPress={() => setSelected(null)} variant="ghost" style={styles.closeBtn} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  searchBar: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 8, alignItems: 'flex-end' },
  searchInput: { flex: 1 },
  searchBtn: { width: 52, height: 52, paddingHorizontal: 0 },
  content: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, marginRight: 12 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardNni: { fontSize: 11, color: Colors.orange, fontFamily: 'monospace', marginTop: 2 },
  cardCity: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  modalNni: { fontSize: 13, color: Colors.orange, marginBottom: 4 },
  modalCity: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: { flex: 1 },
  closeBtn: { marginTop: 10 },
});
