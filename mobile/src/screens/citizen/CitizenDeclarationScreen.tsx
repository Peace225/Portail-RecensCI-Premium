import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '../../components/ui/SectionHeader';

type EventType = 'MARRIAGE' | 'DIVORCE';

export default function CitizenDeclarationScreen({ navigation }: any) {
  const [eventType, setEventType] = useState<EventType>('MARRIAGE');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    spouse1Name: '', spouse1Nni: '',
    spouse2Name: '', spouse2Nni: '',
    marriageDate: '', marriagePlace: '',
    divorceDate: '', courtName: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (eventType === 'MARRIAGE') {
        await api.post('/events/marriage', {
          spouse1Name: form.spouse1Name, spouse1Nni: form.spouse1Nni,
          spouse2Name: form.spouse2Name, spouse2Nni: form.spouse2Nni,
          marriageDate: form.marriageDate, marriagePlace: form.marriagePlace,
        });
        Alert.alert('Succès', 'Déclaration de mariage soumise.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        await api.post('/events/divorce', {
          spouse1Name: form.spouse1Name, spouse2Name: form.spouse2Name,
          divorceDate: form.divorceDate, courtName: form.courtName,
        });
        Alert.alert('Succès', 'Déclaration de divorce soumise.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Toggle */}
        <View style={styles.toggle}>
          {(['MARRIAGE', 'DIVORCE'] as EventType[]).map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.toggleBtn, eventType === type && styles.toggleBtnActive]}
              onPress={() => setEventType(type)}
            >
              <Ionicons
                name={type === 'MARRIAGE' ? 'heart-outline' : 'scale-outline'}
                size={16}
                color={eventType === type ? '#fff' : Colors.textMuted}
              />
              <Text style={[styles.toggleText, eventType === type && styles.toggleTextActive]}>
                {type === 'MARRIAGE' ? 'Mariage' : 'Divorce'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title={eventType === 'MARRIAGE' ? 'Époux 1' : 'Époux / Épouse 1'} />
          <Input label="Nom complet *" value={form.spouse1Name} onChangeText={set('spouse1Name')} placeholder="Nom et prénoms" />
          <Input label="NNI" value={form.spouse1Nni} onChangeText={set('spouse1Nni')} placeholder="CI-XXXX-XXXX" />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="person-outline" title={eventType === 'MARRIAGE' ? 'Époux 2' : 'Époux / Épouse 2'} />
          <Input label="Nom complet *" value={form.spouse2Name} onChangeText={set('spouse2Name')} placeholder="Nom et prénoms" />
          {eventType === 'MARRIAGE' && (
            <Input label="NNI" value={form.spouse2Nni} onChangeText={set('spouse2Nni')} placeholder="CI-XXXX-XXXX" />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader icon="document-text-outline" title="Détails" />
          {eventType === 'MARRIAGE' ? (
            <>
              <Input label="Date du mariage *" value={form.marriageDate} onChangeText={set('marriageDate')} placeholder="AAAA-MM-JJ" />
              <Input label="Lieu" value={form.marriagePlace} onChangeText={set('marriagePlace')} placeholder="Ex: Mairie de Cocody" />
            </>
          ) : (
            <>
              <Input label="Date du divorce *" value={form.divorceDate} onChangeText={set('divorceDate')} placeholder="AAAA-MM-JJ" />
              <Input label="Tribunal *" value={form.courtName} onChangeText={set('courtName')} placeholder="Ex: TPI Abidjan" />
            </>
          )}
        </View>

        <Button
          title={eventType === 'MARRIAGE' ? 'Soumettre la déclaration de mariage' : 'Soumettre la déclaration de divorce'}
          onPress={handleSubmit}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  toggle: { flexDirection: 'row', backgroundColor: Colors.bgCard, borderRadius: 16, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
  toggleBtnActive: { backgroundColor: Colors.ciOrange },
  toggleText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
  toggleTextActive: { color: '#fff' },
  section: { backgroundColor: Colors.bgCard, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
});


