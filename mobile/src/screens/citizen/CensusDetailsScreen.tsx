import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Colors } from '../../theme/colors';

export default function CensusDetailsScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: '', city: '', phone: '',
    householdSize: '', housingType: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.city) {
      Alert.alert('Champs requis', 'La ville est obligatoire.');
      return;
    }
    setLoading(true);
    try {
      if (user.id) {
        await api.patch(`/citizens/${user.id}/address`, {
          address: form.address,
          city: form.city,
        });
      }
      Alert.alert('Succès', 'Informations de recensement mises à jour.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Mettez à jour vos informations de résidence pour le recensement national.</Text>

        <View style={styles.section}>
          <SectionHeader icon="home-outline" title="Résidence" />
          <Input label="Adresse" value={form.address} onChangeText={set('address')} placeholder="Rue, quartier..." />
          <Input label="Ville *" value={form.city} onChangeText={set('city')} placeholder="Ex: Abidjan - Cocody" />
          <Input label="Téléphone" value={form.phone} onChangeText={set('phone')} placeholder="+225 07 00 00 00 00" keyboardType="phone-pad" />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="people-outline" title="Ménage" />
          <Input label="Nombre de personnes" value={form.householdSize} onChangeText={set('householdSize')} placeholder="Ex: 4" keyboardType="numeric" />
          <Input label="Type de logement" value={form.housingType} onChangeText={set('housingType')} placeholder="Ex: Appartement, Villa..." />
        </View>

        <Button title="Mettre à jour le recensement" onPress={handleSubmit} loading={loading} />
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
});


