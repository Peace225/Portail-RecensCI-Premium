import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';

export default function AddressChangeScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: '', city: '' });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.address.trim() || !form.city.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner l\'adresse et la ville.');
      return;
    }
    setLoading(true);
    try {
      await api.patch(`/citizens/${user.id}/address`, form);
      Alert.alert('Mise à jour réussie', 'Votre adresse a été mise à jour avec succès.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Changement d'Adresse</Text>
          <Text style={styles.subtitle}>Mise à jour de résidence</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 Nouvelle adresse</Text>
          <Input
            label="Adresse *"
            value={form.address}
            onChangeText={set('address')}
            placeholder="Ex: Rue des Jardins, Quartier Plateau"
          />
          <Input
            label="Ville *"
            value={form.city}
            onChangeText={set('city')}
            placeholder="Ex: Abidjan"
          />
        </View>

        <Button title="Mettre à jour l'adresse" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  subtitle: { fontSize: 11, color: Colors.orange, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  submitBtn: { marginTop: 8 },
});
