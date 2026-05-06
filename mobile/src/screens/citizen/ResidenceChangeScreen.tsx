import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const MOTIFS = ['Mutation professionnelle', 'Achat logement', 'Location', 'Regroupement familial'];
const JUSTIFICATIFS = ['Contrat bail', 'Facture', 'Attestation résidence'];

export default function ResidenceChangeScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    citizenNni: '',
    oldAddress: '',
    oldCity: '',
    newAddress: '',
    newCity: '',
    motif: 'Mutation professionnelle',
    effectDate: '',
    moveDate: '',
    justificatifs: [] as string[],
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const toggleJustificatif = (item: string) => {
    setForm(f => ({
      ...f,
      justificatifs: f.justificatifs.includes(item)
        ? f.justificatifs.filter(j => j !== item)
        : [...f.justificatifs, item],
    }));
  };

  const handleSubmit = async () => {
    if (!form.oldAddress.trim() || !form.oldCity.trim() || !form.newAddress.trim() || !form.newCity.trim() || !form.effectDate.trim() || !form.moveDate.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/residence-change', form);
      Alert.alert('Déclaration soumise', 'Votre déclaration de déménagement a été soumise avec succès.', [
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
          <Text style={styles.title}>Changement de Résidence</Text>
          <Text style={styles.subtitle}>Déclaration de déménagement</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title="Identifiant citoyen" />
          <Input
            label="NNI citoyen"
            value={form.citizenNni}
            onChangeText={set('citizenNni')}
            placeholder="CI-XXXX-XXXX"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="home-outline" title="Ancienne résidence" />
          <Input
            label="Adresse complète *"
            value={form.oldAddress}
            onChangeText={set('oldAddress')}
            placeholder="Ex: Rue des Jardins, Quartier Plateau"
          />
          <Input
            label="Ville *"
            value={form.oldCity}
            onChangeText={set('oldCity')}
            placeholder="Ex: Abidjan"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="location-outline" title="Nouvelle résidence" />
          <Input
            label="Adresse complète *"
            value={form.newAddress}
            onChangeText={set('newAddress')}
            placeholder="Ex: Rue des Fleurs, Cocody"
          />
          <Input
            label="Ville *"
            value={form.newCity}
            onChangeText={set('newCity')}
            placeholder="Ex: Abidjan"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="document-text-outline" title="Motif du déménagement" />
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
          <Input
            label="Date d'effet *"
            value={form.effectDate}
            onChangeText={set('effectDate')}
            placeholder="AAAA-MM-JJ"
          />
          <Input
            label="Date de déménagement *"
            value={form.moveDate}
            onChangeText={set('moveDate')}
            placeholder="AAAA-MM-JJ"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="attach-outline" title="Justificatifs" />
          <View style={styles.optionRow}>
            {JUSTIFICATIFS.map(j => (
              <TouchableOpacity
                key={j}
                style={[styles.optBtn, form.justificatifs.includes(j) && styles.optBtnActive]}
                onPress={() => toggleJustificatif(j)}
              >
                <Text style={[styles.optBtnText, form.justificatifs.includes(j) && styles.optBtnTextActive]}>{j}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.noteText}>Les justificatifs seront à fournir en mairie</Text>
        </View>

        <Button title="Soumettre la déclaration" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  submitBtn: { marginTop: 8 },
});
