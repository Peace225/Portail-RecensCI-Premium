import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const CATEGORIES = ['Particulier', 'Entreprise', 'Foncier', 'TVA'];
const MODES_PAIEMENT = ['Mobile Money', 'Carte bancaire', 'Wallet État'];

export default function ImpotsTaxesScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    numeroContribuable: '',
    categorie: 'Particulier',
    anneeFiscale: '',
    montantDu: '',
    penalites: '',
    modePaiement: 'Mobile Money',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.numeroContribuable.trim() || !form.anneeFiscale.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner le numéro contribuable et l\'année fiscale.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/impots', form);
      Alert.alert('Dossier consulté', 'Votre dossier fiscal a été récupéré avec succès.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la consultation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Impôts & Taxes</Text>
          <Text style={styles.subtitle}>Consultation et paiement</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title="Contribuable" />
          <Input
            label="Numéro contribuable *"
            value={form.numeroContribuable}
            onChangeText={set('numeroContribuable')}
            placeholder="Ex: CI-FISC-2024-001"
          />
          <View style={styles.optionRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.optBtn, form.categorie === c && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, categorie: c }))}
              >
                <Text style={[styles.optBtnText, form.categorie === c && styles.optBtnTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="calendar-outline" title="Période fiscale" />
          <Input
            label="Année fiscale *"
            value={form.anneeFiscale}
            onChangeText={set('anneeFiscale')}
            placeholder="Ex: 2024"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="cash-outline" title="Informations fiscales" />
          <View style={styles.fiscalCard}>
            <View style={styles.fiscalRow}>
              <Text style={styles.fiscalLabel}>Montant dû</Text>
              <Input
                label=""
                value={form.montantDu}
                onChangeText={set('montantDu')}
                placeholder="Ex: 150 000"
              />
            </View>
            <View style={styles.fiscalRow}>
              <Text style={styles.fiscalLabel}>Pénalités</Text>
              <Input
                label=""
                value={form.penalites}
                onChangeText={set('penalites')}
                placeholder="Ex: 0"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="wallet-outline" title="Mode de paiement" />
          <View style={styles.optionRow}>
            {MODES_PAIEMENT.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.optBtn, form.modePaiement === m && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, modePaiement: m }))}
              >
                <Text style={[styles.optBtnText, form.modePaiement === m && styles.optBtnTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.noteText}>Le paiement en ligne sera disponible prochainement</Text>
        </View>

        <Button title="Consulter mon dossier fiscal" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  fiscalCard: { backgroundColor: Colors.bg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.border },
  fiscalRow: { marginBottom: 4 },
  fiscalLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  submitBtn: { marginTop: 8 },
});
