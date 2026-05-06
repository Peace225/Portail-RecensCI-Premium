import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';

export default function InternalMigrationScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    originCity: '', destinationCity: '', migrationDate: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.originCity || !form.destinationCity || !form.migrationDate) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/migration', {
        citizenName: user.name,
        citizenNni: user.nni,
        originCity: form.originCity,
        destinationCity: form.destinationCity,
        migrationDate: form.migrationDate,
        migrationType: 'INTERNE',
      });
      Alert.alert('Succès', 'Changement de résidence enregistré.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Déclarez votre déplacement à l'intérieur du pays</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre déplacement</Text>
          <Input label="Ville d'origine *" value={form.originCity} onChangeText={set('originCity')} placeholder="Ex: Bouaké" />
          <Input label="Ville de destination *" value={form.destinationCity} onChangeText={set('destinationCity')} placeholder="Ex: Abidjan" />
          <Input label="Date de migration *" value={form.migrationDate} onChangeText={set('migrationDate')} placeholder="AAAA-MM-JJ" />
        </View>
        <Button title="Enregistrer le déplacement" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 20, lineHeight: 20 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 16 },
});


