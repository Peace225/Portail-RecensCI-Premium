import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Colors } from '../../theme/colors';

const SEVERITY_COLORS: Record<string, string> = { LOW: Colors.success, MEDIUM: Colors.warning, HIGH: Colors.error, CRITICAL: '#dc2626' };
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function HealthAlertsScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', region: '', severity: 'MEDIUM', description: '' });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));
  const canCreate = user.role && ['AGENT', 'ENTITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(user.role);

  const fetchAlerts = async () => {
    try {
      const { data } = await api.get('/modules/health-alerts');
      setAlerts(data || []);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les alertes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.region) {
      Alert.alert('Champs requis', 'Titre et région sont obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/modules/health-alerts', form);
      setModalVisible(false);
      setForm({ title: '', region: '', severity: 'MEDIUM', description: '' });
      fetchAlerts();
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.orange} size="large" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Alertes Sanitaires</Text>
          {canCreate && <Button title="+ Alerte" onPress={() => setModalVisible(true)} style={styles.newBtn} />}
        </View>
        {alerts.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyIcon}>⚕️</Text><Text style={styles.emptyText}>Aucune alerte</Text></View>
        ) : (
          alerts.map((a: any) => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <Badge label={a.severity} color={SEVERITY_COLORS[a.severity] || Colors.warning} />
              </View>
              <Text style={styles.cardRegion}>📍 {a.region}</Text>
              <Badge label={a.status || 'ACTIVE'} color={Colors.info} />
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nouvelle Alerte Sanitaire</Text>
            <Input label="Titre *" value={form.title} onChangeText={set('title')} placeholder="Ex: Épidémie de paludisme" />
            <Input label="Région *" value={form.region} onChangeText={set('region')} placeholder="Ex: Abidjan" />
            <Input label="Description" value={form.description} onChangeText={set('description')} placeholder="Détails..." multiline numberOfLines={3} />
            <Text style={styles.pickerLabel}>Sévérité</Text>
            <View style={styles.optionRow}>
              {SEVERITIES.map(s => (
                <TouchableOpacity key={s} style={[styles.optBtn, form.severity === s && { backgroundColor: SEVERITY_COLORS[s], borderColor: SEVERITY_COLORS[s] }]} onPress={() => set('severity')(s)}>
                  <Text style={[styles.optBtnText, form.severity === s && styles.optBtnTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} variant="ghost" style={styles.modalBtn} />
              <Button title="Créer" onPress={handleCreate} loading={submitting} style={styles.modalBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  newBtn: { height: 40, paddingHorizontal: 16 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  cardRegion: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary, marginBottom: 20 },
  pickerLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  optBtnText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700' },
  optBtnTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: { flex: 1 },
});
