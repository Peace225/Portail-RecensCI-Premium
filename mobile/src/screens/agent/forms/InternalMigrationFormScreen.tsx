import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Colors } from '../../../theme/colors';

export default function InternalMigrationFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    citizenName: '', citizenNni: '', originCity: '',
    destinationCity: '', migrationDate: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.citizenName || !form.originCity || !form.destinationCity || !form.migrationDate) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/migration', { ...form, migrationType: 'INTERNE' });
      Alert.alert('Succès', 'Migration interne enregistrée avec succès !', [
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
          <Text style={styles.title}>Migration Interne</Text>
          <Text style={styles.subtitle}>Déplacement national</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Citoyen</Text>
          <Input label="Nom complet *" value={form.citizenName} onChangeText={set('citizenName')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.citizenNni} onChangeText={set('citizenNni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Déplacement</Text>
          <Input label="Ville d'origine *" value={form.originCity} onChangeText={set('originCity')} placeholder="Ex: Bouaké" />
          <Input label="Ville de destination *" value={form.destinationCity} onChangeText={set('destinationCity')} placeholder="Ex: Abidjan" />
          <Input label="Date de migration *" value={form.migrationDate} onChangeText={set('migrationDate')} placeholder="AAAA-MM-JJ" />
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
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 16 },
  submitBtn: { marginTop: 8 },
});


