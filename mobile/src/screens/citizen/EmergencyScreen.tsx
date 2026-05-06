import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const TYPES = ['Agression', 'Accident', 'Incendie', 'Autre'];

export default function EmergencyScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type: TYPES[0], description: '' });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      Alert.alert('Champs requis', 'Veuillez décrire l\'urgence.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/security/emergency', form);
      Alert.alert(
        'Urgence signalée',
        'Votre signalement a été transmis aux autorités compétentes. Les secours ont été alertés.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible d\'envoyer le signalement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.alertBanner}>
          <Ionicons name="alert-circle-outline" size={40} color={Colors.error} style={{ marginBottom: 8 }} />
          <Text style={styles.alertTitle}>Signalement d'Urgence</Text>
          <Text style={styles.alertSubtitle}>Ce formulaire alerte immédiatement les autorités</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type d'urgence</Text>
          <View style={styles.typeGrid}>
            {TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}
                onPress={() => set('type')(t)}
              >
                <Text style={[styles.typeBtnText, form.type === t && styles.typeBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Input
            label="Description de l'urgence *"
            value={form.description}
            onChangeText={set('description')}
            placeholder="Décrivez la situation, votre localisation..."
            multiline
            numberOfLines={4}
          />
        </View>

        <Button title="Envoyer le signalement" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  alertBanner: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  alertTitle: { fontSize: 18, fontWeight: '900', color: Colors.error, marginBottom: 4 },
  alertSubtitle: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bg },
  typeBtnActive: { backgroundColor: Colors.error, borderColor: Colors.error },
  typeBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  typeBtnTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: Colors.error },
});


