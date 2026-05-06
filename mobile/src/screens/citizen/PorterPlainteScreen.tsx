import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const INFRACTION_TYPES = ['Vol', 'Escroquerie', 'Violence', 'Cybercriminalité', 'Harcèlement', 'Autre'];
const PREUVES = ['Photos', 'Vidéos', 'Documents', 'Témoins'];

export default function PorterPlainteScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plaintiffName: '',
    plaintiffNni: '',
    plaintiffPhone: '',
    infractionType: 'Vol',
    factDate: '',
    factTime: '',
    factLocation: '',
    description: '',
    preuves: [] as string[],
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const togglePreuve = (item: string) => {
    setForm(f => ({
      ...f,
      preuves: f.preuves.includes(item)
        ? f.preuves.filter(p => p !== item)
        : [...f.preuves, item],
    }));
  };

  const handleSubmit = async () => {
    if (!form.plaintiffName.trim() || !form.plaintiffPhone.trim() || !form.factDate.trim() || !form.factLocation.trim() || !form.description.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/security/complaints', form);
      Alert.alert('Plainte déposée', 'Votre plainte a été transmise aux autorités compétentes.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors du dépôt de la plainte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.warningBanner}>
          <Ionicons name="shield-outline" size={36} color={Colors.error} style={{ marginBottom: 8 }} />
          <Text style={styles.warningText}>Ce formulaire est transmis directement aux autorités compétentes</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Porter Plainte</Text>
          <Text style={styles.subtitle}>Signalement officiel</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title="Identité du plaignant" />
          <Input
            label="Nom complet *"
            value={form.plaintiffName}
            onChangeText={set('plaintiffName')}
            placeholder="Ex: Koné Aya Marie"
          />
          <Input
            label="NNI"
            value={form.plaintiffNni}
            onChangeText={set('plaintiffNni')}
            placeholder="CI-XXXX-XXXX"
          />
          <Input
            label="Téléphone *"
            value={form.plaintiffPhone}
            onChangeText={set('plaintiffPhone')}
            placeholder="Ex: +225 07 00 00 00 00"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="alert-circle-outline" title="Type d'infraction" />
          <View style={styles.optionRow}>
            {INFRACTION_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.optBtn, form.infractionType === t && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, infractionType: t }))}
              >
                <Text style={[styles.optBtnText, form.infractionType === t && styles.optBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="time-outline" title="Circonstances" />
          <Input
            label="Date des faits *"
            value={form.factDate}
            onChangeText={set('factDate')}
            placeholder="AAAA-MM-JJ"
          />
          <Input
            label="Heure"
            value={form.factTime}
            onChangeText={set('factTime')}
            placeholder="HH:MM"
          />
          <Input
            label="Lieu *"
            value={form.factLocation}
            onChangeText={set('factLocation')}
            placeholder="Ex: Marché Adjamé, Abidjan"
          />
          <Input
            label="Description détaillée *"
            value={form.description}
            onChangeText={set('description')}
            placeholder="Décrivez les faits en détail..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="images-outline" title="Preuves disponibles" />
          <View style={styles.optionRow}>
            {PREUVES.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.optBtn, form.preuves.includes(p) && styles.optBtnActive]}
                onPress={() => togglePreuve(p)}
              >
                <Text style={[styles.optBtnText, form.preuves.includes(p) && styles.optBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.noteText}>Les preuves physiques seront collectées lors de votre audition</Text>
        </View>

        <Button
          title="Déposer la plainte"
          onPress={handleSubmit}
          loading={loading}
          style={[styles.submitBtn, { backgroundColor: Colors.error }]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  warningBanner: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  warningText: { fontSize: 13, fontWeight: '700', color: Colors.error, textAlign: 'center', lineHeight: 20 },
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
