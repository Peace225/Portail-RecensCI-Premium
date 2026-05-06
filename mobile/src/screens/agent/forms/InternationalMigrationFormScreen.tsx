import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

export default function InternationalMigrationFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    citizenName: '', citizenNni: '', originCountry: '',
    destinationCountry: '', migrationDate: '', travelDocument: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.citizenName || !form.originCountry || !form.destinationCountry || !form.migrationDate) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/migration', { ...form, migrationType: 'INTERNATIONAL' });
      Alert.alert('Succès', 'Migration internationale enregistrée avec succès !', [
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
          <Text style={styles.title}>Migration Internationale</Text>
          <Text style={styles.subtitle}>Déplacement transfrontalier</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title="Citoyen" />
          <Input label="Nom complet *" value={form.citizenName} onChangeText={set('citizenName')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.citizenNni} onChangeText={set('citizenNni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="globe-outline" title="Déplacement" />
          <Input label="Pays d'origine *" value={form.originCountry} onChangeText={set('originCountry')} placeholder="Ex: Côte d'Ivoire" />
          <Input label="Pays de destination *" value={form.destinationCountry} onChangeText={set('destinationCountry')} placeholder="Ex: France" />
          <Input label="Date de migration *" value={form.migrationDate} onChangeText={set('migrationDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Document de voyage" value={form.travelDocument} onChangeText={set('travelDocument')} placeholder="Ex: Passeport NAB123456" />
        </View>

        <Button title="Enregistrer la Migration" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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


