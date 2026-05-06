import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

export default function MaternalDeathFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    motherName: '', motherNni: '', deathDate: '',
    deathPlace: '', cause: '', gestationalAge: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.motherName || !form.deathDate || !form.deathPlace) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/birth', { ...form, type: 'MATERNAL_DEATH' });
      Alert.alert('Succès', 'Décès maternel enregistré avec succès !', [
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
          <Text style={styles.title}>Décès Maternel</Text>
          <Text style={styles.subtitle}>Registre sanitaire</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="woman-outline" title="Identité de la Mère" />
          <Input label="Nom complet *" value={form.motherName} onChangeText={set('motherName')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.motherNni} onChangeText={set('motherNni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="medical-outline" title="Détails du Décès" />
          <Input label="Date du décès *" value={form.deathDate} onChangeText={set('deathDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Lieu du décès *" value={form.deathPlace} onChangeText={set('deathPlace')} placeholder="Ex: Maternité CHU" />
          <Input label="Cause" value={form.cause} onChangeText={set('cause')} placeholder="Ex: Hémorragie post-partum" />
          <Input label="Âge gestationnel (semaines)" value={form.gestationalAge} onChangeText={set('gestationalAge')} placeholder="Ex: 38" keyboardType="numeric" />
        </View>

        <Button title="Enregistrer le Décès Maternel" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  submitBtn: { marginTop: 8 },
});


