import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const CATEGORIES = ['Technique', 'Administratif', 'Autre'];
const PRIORITIES = ['BASSE', 'NORMALE', 'HAUTE', 'URGENTE'];
const PRIORITY_COLORS: Record<string, string> = { BASSE: Colors.info, NORMALE: Colors.success, HAUTE: Colors.warning, URGENTE: Colors.error };

export default function SupportScreen() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: '', category: CATEGORIES[0], description: '', priority: 'NORMALE' });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/modules/support');
      setTickets(data || []);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async () => {
    if (!form.subject || !form.description) {
      Alert.alert('Champs requis', 'Sujet et description sont obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/modules/support', form);
      setModalVisible(false);
      setForm({ subject: '', category: CATEGORIES[0], description: '', priority: 'NORMALE' });
      fetchTickets();
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.ciOrange} size="large" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Support</Text>
          <Button title="+ Ticket" onPress={() => setModalVisible(true)} style={styles.newBtn} />
        </View>
        {tickets.length === 0 ? (
          <View style={styles.empty}><Ionicons name="chatbubble-outline" size={48} color={Colors.textMuted} style={{ marginBottom: 12 }} /><Text style={styles.emptyText}>Aucun ticket</Text></View>
        ) : (
          tickets.map((t: any) => (
            <View key={t.id} style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{t.subject}</Text>
                <Badge label={t.priority || 'NORMALE'} color={PRIORITY_COLORS[t.priority] || Colors.info} />
              </View>
              <Text style={styles.cardDesc} numberOfLines={2}>{t.description}</Text>
              <Badge label={t.status || 'OUVERT'} color={Colors.textSecondary} />
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nouveau Ticket</Text>
            <Input label="Sujet *" value={form.subject} onChangeText={set('subject')} placeholder="Décrivez brièvement le problème" />
            <Text style={styles.pickerLabel}>Catégorie</Text>
            <View style={styles.optionRow}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.optBtn, form.category === c && styles.optBtnActive]} onPress={() => set('category')(c)}>
                  <Text style={[styles.optBtnText, form.category === c && styles.optBtnTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Description *" value={form.description} onChangeText={set('description')} placeholder="Détails..." multiline numberOfLines={3} />
            <Text style={styles.pickerLabel}>Priorité</Text>
            <View style={styles.optionRow}>
              {PRIORITIES.map(p => (
                <TouchableOpacity key={p} style={[styles.optBtn, form.priority === p && styles.optBtnActive]} onPress={() => set('priority')(p)}>
                  <Text style={[styles.optBtnText, form.priority === p && styles.optBtnTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} variant="ghost" style={styles.modalBtn} />
              <Button title="Envoyer" onPress={handleSubmit} loading={submitting} style={styles.modalBtn} />
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
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary, marginBottom: 20 },
  pickerLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700' },
  optBtnTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: { flex: 1 },
});


