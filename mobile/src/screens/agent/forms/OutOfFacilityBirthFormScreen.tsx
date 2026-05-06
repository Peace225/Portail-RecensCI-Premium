import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

const GENDERS = ['MASCULIN', 'FEMININ'];
const CIRCUMSTANCES = ['DOMICILE', 'ROUTE', 'CHAMP', 'AUTRE'];

export default function OutOfFacilityBirthFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    babyFirstName: '', babyLastName: '', gender: 'MASCULIN',
    birthDate: '', birthPlace: '', birthCircumstance: 'DOMICILE',
    motherFullName: '', declarantName: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.babyFirstName || !form.babyLastName || !form.birthDate || !form.birthPlace || !form.motherFullName) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/out-of-facility-birth', form);
      Alert.alert('Succès', 'Naissance hors établissement enregistrée !', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Naissance Hors Établissement</Text>
          <Text style={styles.subtitle}>Naissance non médicalisée</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="happy-outline" title="Nouveau-né" />
          <Input label="Prénom(s) *" value={form.babyFirstName} onChangeText={set('babyFirstName')} placeholder="Ex: Aya" />
          <Input label="Nom de famille *" value={form.babyLastName} onChangeText={set('babyLastName')} placeholder="Ex: Koné" />
          <Text style={styles.fieldLabel}>Genre *</Text>
          <View style={styles.optionRow}>
            {GENDERS.map(g => (
              <TouchableOpacity key={g} style={[styles.optBtn, form.gender === g && styles.optBtnActive]} onPress={() => set('gender')(g)}>
                <Text style={[styles.optBtnText, form.gender === g && styles.optBtnTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Input label="Date de naissance *" value={form.birthDate} onChangeText={set('birthDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Lieu de naissance *" value={form.birthPlace} onChangeText={set('birthPlace')} placeholder="Ex: Village de Tiébissou" />
          <Text style={styles.fieldLabel}>Circonstance</Text>
          <View style={styles.optionRow}>
            {CIRCUMSTANCES.map(c => (
              <TouchableOpacity key={c} style={[styles.optBtn, form.birthCircumstance === c && styles.optBtnActive]} onPress={() => set('birthCircumstance')(c)}>
                <Text style={[styles.optBtnText, form.birthCircumstance === c && styles.optBtnTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="woman-outline" title="Mère & Déclarant" />
          <Input label="Nom complet de la mère *" value={form.motherFullName} onChangeText={set('motherFullName')} placeholder="Nom et prénoms" />
          <Input label="Nom du déclarant" value={form.declarantName} onChangeText={set('declarantName')} placeholder="Nom complet" />
        </View>

        <Button title="Enregistrer la Naissance" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 11, color: Colors.ciOrange, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },
  submitBtn: { marginTop: 8 },
});


