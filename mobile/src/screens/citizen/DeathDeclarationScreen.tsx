import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';

export default function DeathDeclarationScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    deceasedName: '', deathDate: '', deathPlace: '', cause: '', declarantName: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.deceasedName || !form.deathDate || !form.deathPlace || !form.declarantName) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/death', form);
      Alert.alert('Déclaration envoyée', 'Votre déclaration de décès a été soumise avec succès.', [
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
          <Text style={styles.title}>Déclaration de Décès</Text>
          <Text style={styles.subtitle}>Déclaration citoyenne</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Défunt</Text>
          <Input label="Nom complet du défunt *" value={form.deceasedName} onChangeText={set('deceasedName')} placeholder="Nom et prénoms" />
          <Input label="Date du décès *" value={form.deathDate} onChangeText={set('deathDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Lieu du décès *" value={form.deathPlace} onChangeText={set('deathPlace')} placeholder="Ex: CHU Cocody, Abidjan" />
          <Input label="Cause du décès" value={form.cause} onChangeText={set('cause')} placeholder="Ex: Maladie, Accident..." />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Déclarant</Text>
          <Input label="Nom du déclarant *" value={form.declarantName} onChangeText={set('declarantName')} placeholder="Votre nom complet" />
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
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  submitBtn: { marginTop: 8 },
});


