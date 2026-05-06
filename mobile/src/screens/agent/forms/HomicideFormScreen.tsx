import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

export default function HomicideFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    victimName: '', victimNni: '', location: '',
    incidentDate: '', description: '', judicialFollowup: false,
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.victimName || !form.location || !form.incidentDate || !form.description) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/security/incidents', { ...form, type: 'HOMICIDE', severity: 'FATAL' });
      Alert.alert('Succès', 'Incident enregistré avec succès !', [
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
          <Text style={styles.title}>Rapport d'Homicide</Text>
          <Text style={styles.subtitle}>Incident de sécurité — FATAL</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title="Victime" />
          <Input label="Nom complet *" value={form.victimName} onChangeText={set('victimName')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.victimNni} onChangeText={set('victimNni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="alert-circle-outline" title="Détails de l'Incident" />
          <Input label="Lieu *" value={form.location} onChangeText={set('location')} placeholder="Ex: Quartier Yopougon" />
          <Input label="Date *" value={form.incidentDate} onChangeText={set('incidentDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Description *" value={form.description} onChangeText={set('description')} placeholder="Circonstances de l'incident..." multiline numberOfLines={3} />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="scale-outline" title="Suivi Judiciaire" />
          <TouchableOpacity
            style={[styles.toggleBtn, form.judicialFollowup && styles.toggleBtnActive]}
            onPress={() => setForm(f => ({ ...f, judicialFollowup: !f.judicialFollowup }))}
          >
            <View style={[styles.toggleDot, form.judicialFollowup && styles.toggleDotActive]} />
            <Text style={[styles.toggleText, form.judicialFollowup && styles.toggleTextActive]}>
              {form.judicialFollowup ? 'Suivi judiciaire activé' : 'Pas de suivi judiciaire'}
            </Text>
          </TouchableOpacity>
        </View>

        <Button title="Enregistrer l'Incident" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  subtitle: { fontSize: 11, color: Colors.error, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  toggleBtnActive: { borderColor: Colors.success, backgroundColor: `${Colors.success}10` },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.textMuted },
  toggleDotActive: { backgroundColor: Colors.success },
  toggleText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  toggleTextActive: { color: Colors.success },
  submitBtn: { marginTop: 8 },
});


