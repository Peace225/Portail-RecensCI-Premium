import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Colors } from '../../../theme/colors';

export default function DeathFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    deceasedLastName: '', deceasedFirstName: '', deceasedNni: '',
    deathDate: '', deathPlace: '', cause: '',
    declarantName: '', declarantNni: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.deceasedLastName || !form.deceasedFirstName || !form.deathDate || !form.deathPlace || !form.declarantName) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/death', form);
      Alert.alert('Succès', 'Acte de décès enregistré avec succès !', [
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
          <Text style={styles.title}>Registre des Décès</Text>
          <Text style={styles.subtitle}>Acte de décès officiel</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕊️ Identité du Défunt</Text>
          <Input label="Nom *" value={form.deceasedLastName} onChangeText={set('deceasedLastName')} placeholder="Nom de famille" />
          <Input label="Prénom(s) *" value={form.deceasedFirstName} onChangeText={set('deceasedFirstName')} placeholder="Prénom(s)" />
          <Input label="NNI" value={form.deceasedNni} onChangeText={set('deceasedNni')} placeholder="CI-XXXX-XXXX" />
          <Input label="Date du décès *" value={form.deathDate} onChangeText={set('deathDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Lieu du décès *" value={form.deathPlace} onChangeText={set('deathPlace')} placeholder="Ex: CHU Cocody" />
          <Input label="Cause du décès" value={form.cause} onChangeText={set('cause')} placeholder="Ex: Maladie cardiaque" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Déclarant</Text>
          <Input label="Nom du déclarant *" value={form.declarantName} onChangeText={set('declarantName')} placeholder="Nom complet" />
          <Input label="NNI du déclarant" value={form.declarantNni} onChangeText={set('declarantNni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <Button title="Enregistrer l'Acte de Décès" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  subtitle: { fontSize: 11, color: Colors.orange, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 16 },
  submitBtn: { marginTop: 8 },
});
