import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

export default function BirthFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    babyFirstName: '', babyLastName: '', gender: 'MASCULIN',
    birthDate: '', birthTime: '', weight: '', height: '',
    hospitalName: '', cityOfBirth: '',
    motherFullName: '', motherNni: '', motherProfession: '',
    fatherFullName: '', fatherNni: '', fatherProfession: '',
    doctorName: '',
  });

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.babyFirstName || !form.babyLastName || !form.birthDate || !form.cityOfBirth || !form.motherFullName) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/birth', form);
      Alert.alert('Succès', 'Acte de naissance enregistré avec succès !', [
        { text: 'OK', onPress: () => navigation.goBack() }
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
          <Text style={styles.title}>Registre des Naissances</Text>
          <Text style={styles.subtitle}>Acte de naissance officiel</Text>
        </View>

        {/* Nouveau-né */}
        <View style={styles.section}>
          <SectionHeader icon="happy-outline" title="Identité du Nouveau-né" />
          <Input label="Prénom(s) *" value={form.babyFirstName} onChangeText={set('babyFirstName')} placeholder="Ex: Aya" />
          <Input label="Nom de famille *" value={form.babyLastName} onChangeText={set('babyLastName')} placeholder="Ex: Koné" />
          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Date de naissance *" value={form.birthDate} onChangeText={set('birthDate')} placeholder="AAAA-MM-JJ" />
            </View>
            <View style={styles.half}>
              <Input label="Heure" value={form.birthTime} onChangeText={set('birthTime')} placeholder="HH:MM" />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Poids" value={form.weight} onChangeText={set('weight')} placeholder="Ex: 3.2kg" />
            </View>
            <View style={styles.half}>
              <Input label="Taille" value={form.height} onChangeText={set('height')} placeholder="Ex: 50cm" />
            </View>
          </View>
          <Input label="Établissement de santé" value={form.hospitalName} onChangeText={set('hospitalName')} placeholder="Ex: CHU Cocody" />
          <Input label="Ville de naissance *" value={form.cityOfBirth} onChangeText={set('cityOfBirth')} placeholder="Ex: Abidjan" />
        </View>

        {/* Mère */}
        <View style={styles.section}>
          <SectionHeader icon="woman-outline" title="Identité de la Mère" />
          <Input label="Nom complet *" value={form.motherFullName} onChangeText={set('motherFullName')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.motherNni} onChangeText={set('motherNni')} placeholder="CI-XXXX-XXXX" />
          <Input label="Profession" value={form.motherProfession} onChangeText={set('motherProfession')} placeholder="Ex: Commerçante" />
        </View>

        {/* Père */}
        <View style={styles.section}>
          <SectionHeader icon="man-outline" title="Identité du Père" />
          <Input label="Nom complet" value={form.fatherFullName} onChangeText={set('fatherFullName')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.fatherNni} onChangeText={set('fatherNni')} placeholder="CI-XXXX-XXXX" />
          <Input label="Profession" value={form.fatherProfession} onChangeText={set('fatherProfession')} placeholder="Ex: Ingénieur" />
        </View>

        {/* Médecin */}
        <View style={styles.section}>
          <SectionHeader icon="medical-outline" title="Médecin / Sage-femme" />
          <Input label="Nom du médecin" value={form.doctorName} onChangeText={set('doctorName')} placeholder="Dr. Nom Prénom" />
        </View>

        <Button title="Enregistrer l'Acte de Naissance" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  submitBtn: { marginTop: 8 },
});


