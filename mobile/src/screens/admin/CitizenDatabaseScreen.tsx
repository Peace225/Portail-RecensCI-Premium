import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput,
} from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const STATUS_COLORS: Record<string, string> = {
  VALIDE: Colors.success,
  EN_ATTENTE_VALIDATION: Colors.warning,
  ACTIVE: Colors.success,
  PENDING: Colors.warning,
  FLAGGED: Colors.error,
};

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
      setCitizens(Array.isArray(data) ? data : (data?.data || []));
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

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher par nom, NNI, ville..."
            placeholderTextColor={Colors.textMuted}
            returnKeyType="search"
            onSubmitEditing={() => fetchCitizens(search)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); fetchCitizens(''); }}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => fetchCitizens(search)}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Compteur */}
      {!loading && (
        <Text style={styles.countText}>
          {citizens.length} citoyen{citizens.length !== 1 ? 's' : ''} trouvé{citizens.length !== 1 ? 's' : ''}
        </Text>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.ciOrange} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {citizens.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="person-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Aucun citoyen trouvé</Text>
              <Text style={styles.emptyHint}>Essayez un autre terme de recherche</Text>
            </View>
          ) : (
            citizens.map((c: any) => (
              <TouchableOpacity key={c.id} style={styles.card} onPress={() => setSelected(c)} activeOpacity={0.8}>
                <View style={styles.cardRow}>
                  <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>
                      {(c.fullName || c.name || '?')[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{c.fullName || c.name}</Text>
                    <Text style={styles.cardNni}>{c.nni}</Text>
                    <Text style={styles.cardCity}>{c.city}</Text>
                  </View>
                  <Badge
                    label={c.status === 'EN_ATTENTE_VALIDATION' ? 'EN ATTENTE' : (c.status || 'VALIDE')}
                    color={STATUS_COLORS[c.status] || Colors.success}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Modal détail citoyen */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {(selected?.fullName || selected?.name || '?')[0]?.toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selected?.fullName || selected?.name}</Text>
                <Text style={styles.modalNni}>{selected?.nni}</Text>
              </View>
            </View>
            <View style={styles.modalInfoRow}>
              <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.modalCity}>{selected?.city || '—'}</Text>
            </View>
            <Badge
              label={selected?.status === 'EN_ATTENTE_VALIDATION' ? 'EN ATTENTE' : (selected?.status || 'VALIDE')}
              color={STATUS_COLORS[selected?.status] || Colors.success}
            />
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

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  searchInputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: 14,
    paddingHorizontal: 12, height: 46,
    borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: Colors.textPrimary, height: '100%',
  },
  searchBtn: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: Colors.ciOrange,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: {
    fontSize: 11, color: Colors.textMuted, fontWeight: '700',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  content: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 14, color: Colors.textMuted, fontWeight: '700' },
  emptyHint: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

  card: {
    backgroundColor: Colors.bgCard, borderRadius: 16,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: `${Colors.ciOrange}20`,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: Colors.ciOrange },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardNni: { fontSize: 11, color: Colors.ciOrange, fontFamily: 'monospace', marginTop: 2 },
  cardCity: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  modalAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: `${Colors.ciOrange}20`,
    alignItems: 'center', justifyContent: 'center',
  },
  modalAvatarText: { fontSize: 22, fontWeight: '900', color: Colors.ciOrange },
  modalTitle: { fontSize: 17, fontWeight: '900', color: Colors.textPrimary },
  modalNni: { fontSize: 12, color: Colors.ciOrange, fontFamily: 'monospace', marginTop: 2 },
  modalInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  modalCity: { fontSize: 13, color: Colors.textSecondary },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: { flex: 1 },
  closeBtn: { marginTop: 10 },
});
