import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const DOCUMENT_TYPES = ['CNI', 'Passeport'];
const MOTIFS = ['Première demande', 'Expiration', 'Perte', 'Vol', 'Détérioration'];

const REQUIRED_DOCS = [
  'Extrait de naissance',
  'Ancienne pièce (si renouvellement)',
  'Justificatif de domicile',
];

export default function CNIPasseportScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    documentType: 'CNI',
    motif: 'Première demande',
    commune: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.commune.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner la commune de retrait.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/cni-passeport', form);
      Alert.alert('Demande soumise', 'Votre demande a été soumise avec succès.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>CNI / Passeport</Text>
          <Text style={styles.subtitle}>Demande ou renouvellement</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="card-outline" title="Type de document" />
          <View style={styles.optionRow}>
            {DOCUMENT_TYPES.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.optBtn, form.documentType === d && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, documentType: d }))}
              >
                <Text style={[styles.optBtnText, form.documentType === d && styles.optBtnTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="refresh-outline" title="Nature de la demande" />
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
          <SectionHeader icon="folder-outline" title="Documents requis" />
          {REQUIRED_DOCS.map(doc => (
            <View key={doc} style={styles.docItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.ciGreen} style={{ marginRight: 10 }} />
              <Text style={styles.docText}>{doc}</Text>
            </View>
          ))}
          <Text style={styles.noteText}>Présentez ces documents lors du dépôt de dossier</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="location-outline" title="Commune de retrait" />
          <Input
            label="Commune *"
            value={form.commune}
            onChangeText={set('commune')}
            placeholder="Ex: Cocody, Plateau, Yopougon..."
          />
        </View>

        <Button title="Soumettre la demande" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
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
  docItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  docText: { fontSize: 13, color: Colors.textPrimary, flex: 1 },
  submitBtn: { marginTop: 8 },
});
