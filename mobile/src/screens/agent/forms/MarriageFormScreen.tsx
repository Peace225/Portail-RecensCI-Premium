import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Colors } from '../../../theme/colors';

export default function MarriageFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    spouse1Name: '', spouse1Nni: '', spouse2Name: '', spouse2Nni: '',
    marriageDate: '', marriagePlace: '', witness1Name: '', witness2Name: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.spouse1Name || !form.spouse2Name || !form.marriageDate || !form.marriagePlace) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/marriage', form);
      Alert.alert('Succès', 'Acte de mariage enregistré avec succès !', [
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
          <Text style={styles.title}>Registre des Mariages</Text>
          <Text style={styles.subtitle}>Acte de mariage officiel</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💍 Époux 1</Text>
          <Input label="Nom complet *" value={form.spouse1Name} onChangeText={set('spouse1Name')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.spouse1Nni} onChangeText={set('spouse1Nni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💍 Époux 2</Text>
          <Input label="Nom complet *" value={form.spouse2Name} onChangeText={set('spouse2Name')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.spouse2Nni} onChangeText={set('spouse2Nni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Détails du Mariage</Text>
          <Input label="Date du mariage *" value={form.marriageDate} onChangeText={set('marriageDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Lieu du mariage *" value={form.marriagePlace} onChangeText={set('marriagePlace')} placeholder="Ex: Mairie d'Abidjan" />
          <Input label="Témoin 1" value={form.witness1Name} onChangeText={set('witness1Name')} placeholder="Nom complet" />
          <Input label="Témoin 2" value={form.witness2Name} onChangeText={set('witness2Name')} placeholder="Nom complet" />
        </View>

        <Button title="Enregistrer l'Acte de Mariage" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
