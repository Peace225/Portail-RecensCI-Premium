import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { Colors } from '../../../theme/colors';

const SEVERITIES = ['LEGER', 'GRAVE', 'FATAL'];
const SEVERITY_COLORS: Record<string, string> = { LEGER: Colors.success, GRAVE: Colors.warning, FATAL: Colors.error };

export default function AccidentFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    location: '', accidentDate: '', vehicleCount: '', injuredCount: '',
    description: '', severity: 'LEGER',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.location || !form.accidentDate || !form.description) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/security/incidents', { ...form, type: 'ACCIDENT' });
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
          <Text style={styles.title}>Rapport d'Accident</Text>
          <Text style={styles.subtitle}>Incident de sécurité</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="car-outline" title="Détails de l'Accident" />
          <Input label="Lieu *" value={form.location} onChangeText={set('location')} placeholder="Ex: Carrefour Marcory" />
          <Input label="Date *" value={form.accidentDate} onChangeText={set('accidentDate')} placeholder="AAAA-MM-JJ" />
          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Nb. véhicules" value={form.vehicleCount} onChangeText={set('vehicleCount')} placeholder="Ex: 2" keyboardType="numeric" />
            </View>
            <View style={styles.half}>
              <Input label="Nb. blessés" value={form.injuredCount} onChangeText={set('injuredCount')} placeholder="Ex: 3" keyboardType="numeric" />
            </View>
          </View>
          <Input label="Description *" value={form.description} onChangeText={set('description')} placeholder="Décrivez l'accident..." multiline numberOfLines={3} />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="warning-outline" title="Gravité" />
          <View style={styles.optionRow}>
            {SEVERITIES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.optBtn, form.severity === s && { backgroundColor: SEVERITY_COLORS[s], borderColor: SEVERITY_COLORS[s] }]}
                onPress={() => set('severity')(s)}
              >
                <Text style={[styles.optBtnText, form.severity === s && styles.optBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button title="Enregistrer l'Accident" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  optionRow: { flexDirection: 'row', gap: 10 },
  optBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  optBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },
  submitBtn: { marginTop: 8 },
});


