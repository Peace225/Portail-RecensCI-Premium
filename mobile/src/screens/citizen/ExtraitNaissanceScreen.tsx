import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

const DELIVERY_MODES = ['Version numérique', 'Version papier'];
const DELIVERY_TYPES = ['Retrait physique', 'Livraison domicile'];

export default function ExtraitNaissanceScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    registreNumber: '',
    lastName: '',
    firstName: '',
    birthDate: '',
    commune: '',
    anneeRegistre: '',
    deliveryMode: 'Version numérique',
    deliveryType: 'Retrait physique',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.lastName.trim() || !form.firstName.trim() || !form.birthDate.trim() || !form.commune.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/modules/certificates', { ...form, type: 'EXTRAIT_NAISSANCE' });
      Alert.alert('Demande soumise', `Demande soumise. Référence: ${data.referenceNumber}`, [
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
          <Text style={styles.title}>Extrait de Naissance</Text>
          <Text style={styles.subtitle}>Demande de document officiel</Text>
        </View>

        <View style={styles.section}>
          <SectionHeader icon="document-outline" title="Informations du registre" />
          <Input
            label="Numéro de registre"
            value={form.registreNumber}
            onChangeText={set('registreNumber')}
            placeholder="Ex: 2024-001"
          />
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
            label="Date de naissance *"
            value={form.birthDate}
            onChangeText={set('birthDate')}
            placeholder="AAAA-MM-JJ"
          />
          <Input
            label="Commune d'origine *"
            value={form.commune}
            onChangeText={set('commune')}
            placeholder="Ex: Cocody"
          />
          <Input
            label="Année du registre"
            value={form.anneeRegistre}
            onChangeText={set('anneeRegistre')}
            placeholder="Ex: 2024"
          />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="cube-outline" title="Mode de livraison" />
          <View style={styles.optionRow}>
            {DELIVERY_MODES.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.optBtn, form.deliveryMode === m && styles.optBtnActive]}
                onPress={() => setForm(f => ({ ...f, deliveryMode: m }))}
              >
                <Text style={[styles.optBtnText, form.deliveryMode === m && styles.optBtnTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {form.deliveryMode === 'Version papier' && (
            <View style={styles.optionRow}>
              {DELIVERY_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.optBtn, form.deliveryType === t && styles.optBtnActive]}
                  onPress={() => setForm(f => ({ ...f, deliveryType: t }))}
                >
                  <Text style={[styles.optBtnText, form.deliveryType === t && styles.optBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
