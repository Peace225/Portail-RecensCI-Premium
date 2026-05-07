import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const GENDERS = ['MASCULIN', 'FEMININ'];

export default function BirthDeclarationScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const [form, setForm] = useState({
    babyFirstName: '', babyLastName: '', gender: 'MASCULIN',
    birthDate: '', birthTime: '', cityOfBirth: '',
    motherFullName: '', motherNni: '',
  });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  // Pré-remplir depuis le profil citoyen connecté (mère = utilisatrice)
  useEffect(() => {
    if (user.name) {
      setForm(f => ({
        ...f,
        motherFullName: user.name,
        motherNni: user.nni || '',
      }));
    }
  }, [user]);

  // ── Gestion photos ────────────────────────────────────────────────────────
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la galerie pour ajouter des photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos(p => [...p, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la caméra.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos(p => [...p, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(p => p.filter((_, i) => i !== index));
  };

  // ── Soumission ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.babyFirstName || !form.babyLastName || !form.birthDate || !form.cityOfBirth || !form.motherFullName) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    try {
      await api.post('/events/birth', { ...form, photoCount: photos.length });
      Alert.alert(
        'Déclaration envoyée',
        'Votre déclaration de naissance a été soumise avec succès. Un agent la traitera sous 48h.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Bannière info */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.ciGreen} />
          <Text style={styles.infoText}>
            Pré-rempli depuis votre profil. Vérifiez et complétez les informations.
          </Text>
        </View>

        {/* ── Nouveau-né ── */}
        <View style={styles.section}>
          <SectionHeader icon="happy-outline" title="Nouveau-né" />
          <Input label="Prénom(s) *" value={form.babyFirstName} onChangeText={set('babyFirstName')} placeholder="Ex: Aya" />
          <Input label="Nom de famille *" value={form.babyLastName} onChangeText={set('babyLastName')} placeholder="Ex: Koné" />

          <Text style={styles.fieldLabel}>Genre *</Text>
          <View style={styles.optionRow}>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.optBtn, form.gender === g && styles.optBtnActive]}
                onPress={() => set('gender')(g)}
              >
                <Text style={[styles.optBtnText, form.gender === g && styles.optBtnTextActive]}>
                  {g === 'MASCULIN' ? 'Masculin' : 'Féminin'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                label="Date de naissance *"
                value={form.birthDate}
                onChangeText={set('birthDate')}
                placeholder="AAAA-MM-JJ"
              />
            </View>
            <View style={styles.half}>
              <Input
                label="Heure de naissance"
                value={form.birthTime}
                onChangeText={set('birthTime')}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          <Input
            label="Ville de naissance *"
            value={form.cityOfBirth}
            onChangeText={set('cityOfBirth')}
            placeholder="Ex: Abidjan"
          />
        </View>

        {/* ── Mère (pré-rempli) ── */}
        <View style={styles.section}>
          <SectionHeader icon="woman-outline" title="Mère" />
          {user.name ? (
            <View style={styles.prefilledBadge}>
              <Ionicons name="checkmark-circle-outline" size={14} color={Colors.ciGreen} />
              <Text style={styles.prefilledText}>Pré-rempli depuis votre profil</Text>
            </View>
          ) : null}
          <Input
            label="Nom complet de la mère *"
            value={form.motherFullName}
            onChangeText={set('motherFullName')}
            placeholder="Nom et prénoms"
          />
          <Input
            label="NNI de la mère"
            value={form.motherNni}
            onChangeText={set('motherNni')}
            placeholder="CI-XXXX-XXXX"
          />
        </View>

        {/* ── Justificatifs / Photos ── */}
        <View style={styles.section}>
          <SectionHeader icon="camera-outline" title="Justificatifs & Photos" />
          <Text style={styles.photoHint}>
            Ajoutez des photos du carnet de maternité, du bracelet d'hôpital ou de tout document justificatif.
          </Text>

          {/* Grille photos */}
          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map((uri, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                  <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(index)}>
                    <Ionicons name="close-circle" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Boutons ajout photo */}
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={20} color={Colors.ciOrange} />
              <Text style={styles.photoBtnText}>Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
              <Ionicons name="image-outline" size={20} color={Colors.ciGreen} />
              <Text style={[styles.photoBtnText, { color: Colors.ciGreen }]}>Galerie</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <Text style={styles.photoCount}>
              {photos.length} photo{photos.length > 1 ? 's' : ''} ajoutée{photos.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* ── Livraison La Poste ── */}
        <View style={styles.section}>
          <SectionHeader icon="mail-outline" title="Livraison de l'acte" />
          <View style={styles.posteCard}>
            <View style={styles.posteHeader}>
              <Ionicons name="bicycle-outline" size={22} color={Colors.ciOrange} />
              <View style={{ flex: 1 }}>
                <Text style={styles.posteTitle}>Livraison à domicile — La Poste CI</Text>
                <Text style={styles.posteSub}>Recevez votre acte de naissance chez vous sous 5-7 jours ouvrés</Text>
              </View>
            </View>
            <Text style={styles.posteNote}>
              En partenariat avec La Poste de Côte d'Ivoire. Frais de livraison : 1 500 FCFA.
              Vous recevrez un code de suivi par SMS.
            </Text>
          </View>
          <Text style={styles.posteAlt}>
            Ou retrait gratuit à la mairie de votre commune sous 3 jours ouvrés.
          </Text>
        </View>

        <Button
          title="Soumettre la déclaration"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 80 },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: `${Colors.ciGreen}12`, borderRadius: 14,
    padding: 12, marginBottom: 20,
    borderWidth: 1, borderColor: `${Colors.ciGreen}30`,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  section: {
    backgroundColor: Colors.bgCard, borderRadius: 20,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },

  fieldLabel: {
    fontSize: 10, fontWeight: '800', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5,
    marginBottom: 8, marginLeft: 4,
  },
  optionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  optBtn: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
  },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },

  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },

  prefilledBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${Colors.ciGreen}12`, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, marginBottom: 12,
    alignSelf: 'flex-start',
  },
  prefilledText: { fontSize: 11, color: Colors.ciGreen, fontWeight: '700' },

  // Photos
  photoHint: { fontSize: 12, color: Colors.textMuted, marginBottom: 14, lineHeight: 18 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  photoItem: { position: 'relative' },
  photoThumb: { width: 80, height: 80, borderRadius: 12, backgroundColor: Colors.bg },
  photoRemove: { position: 'absolute', top: -6, right: -6 },
  photoActions: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  photoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14,
    borderWidth: 1, borderColor: `${Colors.ciOrange}40`,
    backgroundColor: `${Colors.ciOrange}08`,
  },
  photoBtnText: { fontSize: 12, fontWeight: '700', color: Colors.ciOrange },
  photoCount: { fontSize: 11, color: Colors.ciGreen, fontWeight: '700', textAlign: 'center', marginTop: 4 },

  // La Poste
  posteCard: {
    backgroundColor: Colors.bg, borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: `${Colors.ciOrange}30`,
  },
  posteHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  posteTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  posteSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  posteNote: { fontSize: 11, color: Colors.textSecondary, lineHeight: 17 },
  posteAlt: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },

  submitBtn: { marginTop: 8 },
});
