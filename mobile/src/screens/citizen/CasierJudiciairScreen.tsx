import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const OBJETS = ['Emploi', 'Concours', 'Visa', 'Voyage', 'Marché public'];
const URGENCES = ['Standard', 'Prioritaire'];

export default function CasierJudiciairScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    nationalNumber: '',
    profession: '',
    address: '',
    objet: 'Emploi',
    urgence: 'Standard',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.lastName.trim() || !form.firstName.trim() || !form.nationalNumber.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/casier-judiciaire', form);
      Alert.alert('Demande soumise', 'Votre demande de casier judiciaire a été soumise avec succès.', [
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
          <Text style={styles.title}>Casier Judiciaire</Text>
          <Text style={styles.subtitle}>Demande de bulletin n°3</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title="Identité complète" />
          <Input
            label="Nom *"
            value={form.lastName}
            onChangeText={set('lastName')}
            placeholder="Ex: Koné"
          />
          <Input
            label="Prénoms *"
            value={form.firstName}
            onChangeText={set('firstName')}
            placeholder="Ex: Aya Marie"
          />
          <Input
            label="Numéro national *"
            value={form.nationalNumber}
            onChangeText={set('nationalNumber')}
            placeholder="CI-XXXX-XXXX"
          />
          <Input
            label="Profession"
            value={form.profession}
            onChangeText={set('profession')}
            placeholder="Ex: Ingénieur"
          />
          <Input
            label="Adresse"
            value={form.address}
            onChangeText={set('address')}
            placeholder="Ex: Rue des Jardins, Cocody"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="briefcase-outline" title="Objet de la demande" />
          <View style={styles.optionRow}>
            {OBJETS.map(o => (
              <TouchableOpacity
                key={o}
                style={[styles.optBtn, form.objet === o && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, objet: o }))}
              >
                <Text style={[styles.optBtnText, form.objet === o && styles.optBtnTextActive]}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="flash-outline" title="Urgence" />
          <View style={styles.optionRow}>
            {URGENCES.map(u => (
              <TouchableOpacity
                key={u}
                style={[styles.optBtn, form.urgence === u && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, urgence: u }))}
              >
                <Text style={[styles.optBtnText, form.urgence === u && styles.optBtnTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.noteText}>Prioritaire: traitement sous 24h — frais supplémentaires</Text>
        </View>

        <Button title="Soumettre la demande" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },
  noteText: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4 },
  submitBtn: { marginTop: 8 },
});
