import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../theme/colors';

const TYPES = ['Naissance', 'Mariage', 'Décès', 'Résidence', 'Nationalité'];

export default function CertificateRequestScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [form, setForm] = useState({ type: TYPES[0], purpose: '', citizenName: '', citizenNni: '' });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.purpose || !form.citizenName || !form.citizenNni) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/modules/certificates', form);
      Alert.alert('Succès', `Demande soumise. Référence: ${data.referenceNumber || data.id}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    if (!refNumber.trim()) return;
    setTrackLoading(true);
    try {
      const { data } = await api.get(`/modules/certificates/track/${refNumber.trim()}`);
      setTrackResult(data);
    } catch {
      Alert.alert('Introuvable', 'Aucune demande trouvée pour cette référence.');
      setTrackResult(null);
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Demande de Certificat</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de certificat</Text>
          <View style={styles.typeRow}>
            {TYPES.map(t => (
              <TouchableOpacity key={t} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]} onPress={() => set('type')(t)}>
                <Text style={[styles.typeBtnText, form.type === t && styles.typeBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Input label="Motif *" value={form.purpose} onChangeText={set('purpose')} placeholder="Ex: Inscription scolaire" />
          <Input label="Nom du citoyen *" value={form.citizenName} onChangeText={set('citizenName')} placeholder="Nom complet" />
          <Input label="NNI *" value={form.citizenNni} onChangeText={set('citizenNni')} placeholder="CI-XXXX-XXXX" />
          <Button title="Soumettre la demande" onPress={handleSubmit} loading={loading} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivre une demande</Text>
          <Input label="Numéro de référence" value={refNumber} onChangeText={setRefNumber} placeholder="Ex: CERT-2024-001" />
          <Button title="Rechercher" onPress={handleTrack} loading={trackLoading} variant="secondary" />
          {trackResult && (
            <Card style={styles.trackCard} accent={Colors.ciOrange}>
              <Text style={styles.trackLabel}>Statut</Text>
              <Text style={styles.trackValue}>{trackResult.status}</Text>
              <Text style={styles.trackLabel}>Type</Text>
              <Text style={styles.trackValue}>{trackResult.type}</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 20 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  typeBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  typeBtnText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700' },
  typeBtnTextActive: { color: '#fff' },
  trackCard: { marginTop: 12 },
  trackLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 },
  trackValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
});


