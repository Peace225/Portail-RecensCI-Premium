import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const MOTIFS = ['Perte', 'Vol', 'Destruction'];
const ACTIONS = ['Suspension temporaire', 'Blocage définitif', 'Renouvellement immédiat'];

export default function BloquerCNIScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    documentNumber: '',
    incidentDate: '',
    incidentLocation: '',
    motif: 'Perte',
    action: 'Suspension temporaire',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.documentNumber.trim() || !form.incidentDate.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner le numéro du document et la date d\'incident.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/bloquer-cni', form);
      Alert.alert('Document signalé', 'Votre document a été signalé avec succès dans le système national.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du signalement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={36} color={Colors.ciOrange} style={{ marginBottom: 8 }} />
          <Text style={styles.warningText}>Cette action bloquera immédiatement votre document dans le système national</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Bloquer / Signaler CNI</Text>
          <Text style={styles.subtitle}>Signalement de document perdu ou volé</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="card-outline" title="Document concerné" />
          <Input
            label="Numéro du document *"
            value={form.documentNumber}
            onChangeText={set('documentNumber')}
            placeholder="Ex: CI-2024-XXXXXX"
          />
          <Input
            label="Date d'incident *"
            value={form.incidentDate}
            onChangeText={set('incidentDate')}
            placeholder="AAAA-MM-JJ"
          />
          <Input
            label="Lieu de l'incident"
            value={form.incidentLocation}
            onChangeText={set('incidentLocation')}
            placeholder="Ex: Marché Adjamé"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="help-circle-outline" title="Motif" />
          <View style={styles.optionRow}>
            {MOTIFS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.optBtn, form.motif === m && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, motif: m }))}
              >
                <Text style={[styles.optBtnText, form.motif === m && styles.optBtnTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="settings-outline" title="Action demandée" />
          <View style={styles.optionRow}>
            {ACTIONS.map(a => (
              <TouchableOpacity
                key={a}
                style={[styles.optBtn, form.action === a && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, action: a }))}
              >
                <Text style={[styles.optBtnText, form.action === a && styles.optBtnTextActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {form.action === 'Blocage définitif' && (
            <Text style={styles.dangerText}>Attention: action irréversible</Text>
          )}
        </View>

        <Button title="Signaler le document" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  warningBanner: {
    backgroundColor: `${Colors.ciOrange}18`,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${Colors.ciOrange}40`,
  },
  warningText: { fontSize: 13, fontWeight: '700', color: Colors.ciOrange, textAlign: 'center', lineHeight: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: 11, color: Colors.ciOrange, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },
  noteText: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4 },
  dangerText: { fontSize: 12, fontWeight: '700', color: Colors.error, marginTop: 4 },
  submitBtn: { marginTop: 8 },
});
