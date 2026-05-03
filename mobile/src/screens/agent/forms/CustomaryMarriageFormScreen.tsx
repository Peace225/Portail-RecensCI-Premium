import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Colors } from '../../../theme/colors';

export default function CustomaryMarriageFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    spouse1Name: '', spouse1Village: '', spouse2Name: '', spouse2Village: '',
    marriageDate: '', ceremonyPlace: '', customaryChief: '', dotDescription: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.spouse1Name || !form.spouse2Name || !form.marriageDate || !form.ceremonyPlace) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/customary-marriage', form);
      Alert.alert('Succès', 'Mariage coutumier enregistré avec succès !', [
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
          <Text style={styles.title}>Mariage Coutumier</Text>
          <Text style={styles.subtitle}>Registre des unions traditionnelles</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨 Époux 1</Text>
          <Input label="Nom complet *" value={form.spouse1Name} onChangeText={set('spouse1Name')} placeholder="Nom et prénoms" />
          <Input label="Village d'origine" value={form.spouse1Village} onChangeText={set('spouse1Village')} placeholder="Ex: Tiébissou" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👩 Épouse 2</Text>
          <Input label="Nom complet *" value={form.spouse2Name} onChangeText={set('spouse2Name')} placeholder="Nom et prénoms" />
          <Input label="Village d'origine" value={form.spouse2Village} onChangeText={set('spouse2Village')} placeholder="Ex: Daoukro" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎋 Cérémonie</Text>
          <Input label="Date du mariage *" value={form.marriageDate} onChangeText={set('marriageDate')} placeholder="AAAA-MM-JJ" />
          <Input label="Lieu de la cérémonie *" value={form.ceremonyPlace} onChangeText={set('ceremonyPlace')} placeholder="Ex: Village de Tiébissou" />
          <Input label="Chef coutumier" value={form.customaryChief} onChangeText={set('customaryChief')} placeholder="Nom du chef" />
          <Input label="Description de la dot" value={form.dotDescription} onChangeText={set('dotDescription')} placeholder="Ex: 5 pagnes, 2 chèvres..." multiline numberOfLines={2} />
        </View>

        <Button title="Enregistrer le Mariage Coutumier" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  subtitle: { fontSize: 11, color: Colors.orange, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 16 },
  submitBtn: { marginTop: 8 },
});
