import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

export default function DivorceFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    spouse1Name: '', spouse2Name: '', divorceDate: '', courtName: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.spouse1Name || !form.spouse2Name || !form.divorceDate || !form.courtName) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/divorce', form);
      Alert.alert('Succès', 'Acte de divorce enregistré avec succès !', [
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
          <Text style={styles.title}>Registre des Divorces</Text>
          <Text style={styles.subtitle}>Acte de divorce officiel</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="people-outline" title="Parties" />
          <Input label="Nom de l'époux 1 *" value={form.spouse1Name} onChangeText={set('spouse1Name')} placeholder="Nom et prénoms" />
          <Input label="Nom de l'époux 2 *" value={form.spouse2Name} onChangeText={set('spouse2Name')} placeholder="Nom et prénoms" />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="document-text-outline" title="Détails du Divorce" />
          <Input label="Date du divorce *" value={form.divorceDate} onChangeText={set('divorceDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Tribunal *" value={form.courtName} onChangeText={set('courtName')} placeholder="Ex: Tribunal de Grande Instance d'Abidjan" />
        </View>

        <Button title="Enregistrer l'Acte de Divorce" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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


