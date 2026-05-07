import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Image,
  KeyboardAvoidingView, Platform, TouchableOpacity,
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface HouseholdMember {
  id: string;
  fullName: string;
  birthDate: string;
  gender: 'MASCULIN' | 'FEMININ';
  relation: string;
  nni: string;
  photoUri?: string;
}

const RELATIONS = ['Chef de ménage', 'Conjoint(e)', 'Enfant', 'Parent', 'Frère/Sœur', 'Autre'];
const HOUSING_TYPES = ['Appartement', 'Villa', 'Maison', 'Studio', 'Chambre', 'Autre'];
const OWNERSHIP = ['Propriétaire', 'Locataire', 'Hébergé gratuitement'];

// ─── Composant membre ─────────────────────────────────────────────────────────

function MemberCard({
  member, index, onChange, onRemove, onPhotoChange,
}: {
  member: HouseholdMember;
  index: number;
  onChange: (id: string, key: keyof HouseholdMember, val: string) => void;
  onRemove: (id: string) => void;
  onPhotoChange: (id: string, uri: string | undefined) => void;
}) {

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],   // carré — portrait d'identité
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      onPhotoChange(member.id, result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la caméra.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      onPhotoChange(member.id, result.assets[0].uri);
    }
  };

  return (
    <View style={memberStyles.card}>
      {/* En-tête carte */}
      <View style={memberStyles.cardHeader}>
        <View style={memberStyles.badge}>
          <Ionicons name="person-outline" size={14} color={Colors.ciOrange} />
          <Text style={memberStyles.badgeText}>
            {index === 0 ? 'Chef de ménage' : `Membre ${index + 1}`}
          </Text>
        </View>
        {index > 0 && (
          <TouchableOpacity onPress={() => onRemove(member.id)} style={memberStyles.removeBtn}>
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Photo + infos côte à côte */}
      <View style={memberStyles.photoRow}>
        {/* Zone photo */}
        <View style={memberStyles.photoZone}>
          {member.photoUri ? (
            <View style={memberStyles.photoWrapper}>
              <Image source={{ uri: member.photoUri }} style={memberStyles.photo} />
              <TouchableOpacity
                style={memberStyles.photoRemove}
                onPress={() => onPhotoChange(member.id, undefined)}
              >
                <Ionicons name="close-circle" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={memberStyles.photoPlaceholder}>
              <Ionicons name="person-outline" size={32} color={Colors.textMuted} />
              <Text style={memberStyles.photoPlaceholderText}>Photo</Text>
            </View>
          )}
          {/* Boutons photo */}
          <View style={memberStyles.photoBtns}>
            <TouchableOpacity style={memberStyles.photoBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={16} color={Colors.ciOrange} />
            </TouchableOpacity>
            <TouchableOpacity style={memberStyles.photoBtn} onPress={pickPhoto}>
              <Ionicons name="image-outline" size={16} color={Colors.ciGreen} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Champs nom + NNI */}
        <View style={memberStyles.infoFields}>
          <Input
            label="Nom complet *"
            value={member.fullName}
            onChangeText={v => onChange(member.id, 'fullName', v)}
            placeholder="Nom et prénoms"
          />
          <Input
            label="NNI"
            value={member.nni}
            onChangeText={v => onChange(member.id, 'nni', v)}
            placeholder="CI-XXXX-XXXX"
          />
        </View>
      </View>

      {/* Date de naissance */}
      <Input
        label="Date de naissance"
        value={member.birthDate}
        onChangeText={v => onChange(member.id, 'birthDate', v)}
        placeholder="AAAA-MM-JJ"
      />

      {/* Genre */}
      <Text style={memberStyles.fieldLabel}>Genre</Text>
      <View style={memberStyles.optRow}>
        {(['MASCULIN', 'FEMININ'] as const).map(g => (
          <TouchableOpacity
            key={g}
            style={[memberStyles.optBtn, member.gender === g && memberStyles.optBtnActive]}
            onPress={() => onChange(member.id, 'gender', g)}
          >
            <Text style={[memberStyles.optBtnText, member.gender === g && memberStyles.optBtnTextActive]}>
              {g === 'MASCULIN' ? 'Masculin' : 'Féminin'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lien de parenté */}
      <Text style={memberStyles.fieldLabel}>Lien de parenté</Text>
      <View style={memberStyles.optRow}>
        {RELATIONS.map(r => (
          <TouchableOpacity
            key={r}
            style={[memberStyles.optBtn, member.relation === r && memberStyles.optBtnActive]}
            onPress={() => onChange(member.id, 'relation', r)}
          >
            <Text style={[memberStyles.optBtnText, member.relation === r && memberStyles.optBtnTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const memberStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg, borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: `${Colors.ciOrange}25`,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${Colors.ciOrange}15`, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: `${Colors.ciOrange}30`,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: Colors.ciOrange, textTransform: 'uppercase' },
  removeBtn: { padding: 6, backgroundColor: 'rgba(220,38,38,0.1)', borderRadius: 8 },

  // Photo layout
  photoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  photoZone: { alignItems: 'center', gap: 8 },
  photoWrapper: { position: 'relative' },
  photo: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 2, borderColor: Colors.ciOrange,
  },
  photoRemove: { position: 'absolute', top: -8, right: -8 },
  photoPlaceholder: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  photoPlaceholderText: { fontSize: 9, color: Colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  photoBtns: { flexDirection: 'row', gap: 6 },
  photoBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  infoFields: { flex: 1 },

  fieldLabel: {
    fontSize: 10, fontWeight: '800', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, marginTop: 4,
  },
  optRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  optBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },
});

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function CensusDetailsScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  const [residence, setResidence] = useState({
    address: '', city: '', commune: '', quartier: '',
    phone: '', housingType: 'Appartement', ownership: 'Locataire',
  });
  const setRes = (key: string) => (val: string) => setResidence(r => ({ ...r, [key]: val }));

  const [members, setMembers] = useState<HouseholdMember[]>([
    {
      id: '1',
      fullName: user.name || '',
      birthDate: '',
      gender: 'MASCULIN',
      relation: 'Chef de ménage',
      nni: user.nni || '',
      photoUri: undefined,
    },
  ]);

  const addMember = () => {
    setMembers(m => [
      ...m,
      {
        id: Date.now().toString(),
        fullName: '', birthDate: '', gender: 'MASCULIN',
        relation: 'Enfant', nni: '', photoUri: undefined,
      },
    ]);
  };

  const updateMember = (id: string, key: keyof HouseholdMember, val: string) => {
    setMembers(m => m.map(mb => mb.id === id ? { ...mb, [key]: val } : mb));
  };

  const updateMemberPhoto = (id: string, uri: string | undefined) => {
    setMembers(m => m.map(mb => mb.id === id ? { ...mb, photoUri: uri } : mb));
  };

  const removeMember = (id: string) => {
    setMembers(m => m.filter(mb => mb.id !== id));
  };

  const photosCount = members.filter(m => m.photoUri).length;

  const handleSubmit = async () => {
    if (!residence.city.trim()) {
      Alert.alert('Champs requis', 'La ville de résidence est obligatoire.');
      return;
    }
    if (members.some(m => !m.fullName.trim())) {
      Alert.alert('Champs requis', 'Le nom complet de chaque membre est obligatoire.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/modules/census', {
        citizenId: user.id,
        citizenNni: user.nni,
        residence,
        members: members.map(({ photoUri, ...m }) => ({
          ...m,
          hasPhoto: !!photoUri,
        })),
        householdSize: members.length,
        photosCount,
      });
      Alert.alert(
        'Recensement soumis',
        `Ménage de ${members.length} personne(s) enregistré avec succès.${photosCount > 0 ? `\n${photosCount} photo(s) jointe(s).` : ''}`,
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

        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.ciGreen} />
          <Text style={styles.infoText}>
            Recensez tous les membres vivant sous votre toit. Ajoutez une photo pour chaque membre afin de mettre un visage sur un nom.
          </Text>
        </View>

        {/* ── Résidence ── */}
        <View style={styles.section}>
          <SectionHeader icon="home-outline" title="Résidence" />
          <Input label="Adresse *" value={residence.address} onChangeText={setRes('address')} placeholder="Rue, numéro..." />
          <Input label="Quartier" value={residence.quartier} onChangeText={setRes('quartier')} placeholder="Ex: Deux Plateaux" />
          <Input label="Commune *" value={residence.commune} onChangeText={setRes('commune')} placeholder="Ex: Cocody" />
          <Input label="Ville *" value={residence.city} onChangeText={setRes('city')} placeholder="Ex: Abidjan" />
          <Input label="Téléphone" value={residence.phone} onChangeText={setRes('phone')} placeholder="+225 07 00 00 00 00" keyboardType="phone-pad" />
        </View>

        {/* ── Logement ── */}
        <View style={styles.section}>
          <SectionHeader icon="business-outline" title="Type de logement" />
          <View style={styles.optionRow}>
            {HOUSING_TYPES.map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.optBtn, residence.housingType === h && styles.optBtnActive]}
                onPress={() => setResidence(r => ({ ...r, housingType: h }))}
              >
                <Text style={[styles.optBtnText, residence.housingType === h && styles.optBtnTextActive]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.fieldLabel}>Statut d'occupation</Text>
          <View style={styles.optionRow}>
            {OWNERSHIP.map(o => (
              <TouchableOpacity
                key={o}
                style={[styles.optBtn, residence.ownership === o && styles.optBtnActive]}
                onPress={() => setResidence(r => ({ ...r, ownership: o }))}
              >
                <Text style={[styles.optBtnText, residence.ownership === o && styles.optBtnTextActive]}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Membres du ménage ── */}
        <View style={styles.section}>
          <SectionHeader icon="people-outline" title={`Membres du ménage (${members.length})`} />

          {/* Barre de progression photos */}
          <View style={styles.photoProgress}>
            <Ionicons name="camera-outline" size={14} color={photosCount === members.length ? Colors.ciGreen : Colors.textMuted} />
            <Text style={[styles.photoProgressText, photosCount === members.length && { color: Colors.ciGreen }]}>
              {photosCount}/{members.length} photo{members.length > 1 ? 's' : ''} ajoutée{members.length > 1 ? 's' : ''}
            </Text>
            {photosCount === members.length && members.length > 0 && (
              <Ionicons name="checkmark-circle" size={14} color={Colors.ciGreen} />
            )}
          </View>

          <Text style={styles.memberNote}>
            Incluez toutes les personnes vivant habituellement sous votre toit. La photo permet d'identifier chaque membre.
          </Text>

          {members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              onChange={updateMember}
              onRemove={removeMember}
              onPhotoChange={updateMemberPhoto}
            />
          ))}

          <TouchableOpacity style={styles.addMemberBtn} onPress={addMember}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.ciGreen} />
            <Text style={styles.addMemberText}>Ajouter un membre</Text>
          </TouchableOpacity>
        </View>

        {/* ── Résumé ── */}
        <View style={styles.summaryCard}>
          <Ionicons name="stats-chart-outline" size={18} color={Colors.ciOrange} />
          <Text style={styles.summaryText}>
            Ménage de <Text style={styles.summaryBold}>{members.length} personne(s)</Text> à{' '}
            <Text style={styles.summaryBold}>{residence.commune || '—'}</Text>
            {photosCount > 0 && (
              <Text style={{ color: Colors.ciGreen }}> · {photosCount} photo(s)</Text>
            )}
          </Text>
        </View>

        <Button
          title={`Soumettre le recensement (${members.length} membre${members.length > 1 ? 's' : ''})`}
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
    backgroundColor: `${Colors.ciGreen}12`, borderRadius: 16,
    padding: 14, marginBottom: 20,
    borderWidth: 1, borderColor: `${Colors.ciGreen}30`,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  section: {
    backgroundColor: Colors.bgCard, borderRadius: 20,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },

  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  optBtnActive: { backgroundColor: Colors.ciOrange, borderColor: Colors.ciOrange },
  optBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  optBtnTextActive: { color: '#fff' },

  fieldLabel: {
    fontSize: 10, fontWeight: '800', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8,
  },

  photoProgress: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bg, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12,
  },
  photoProgressText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },

  memberNote: { fontSize: 12, color: Colors.textMuted, marginBottom: 14, lineHeight: 18 },

  addMemberBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 14,
    borderWidth: 1, borderColor: `${Colors.ciGreen}40`,
    borderStyle: 'dashed', backgroundColor: `${Colors.ciGreen}08`,
    marginTop: 4,
  },
  addMemberText: { fontSize: 13, fontWeight: '700', color: Colors.ciGreen },

  summaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: `${Colors.ciOrange}10`, borderRadius: 14,
    padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: `${Colors.ciOrange}25`,
  },
  summaryText: { fontSize: 13, color: Colors.textSecondary },
  summaryBold: { fontWeight: '800', color: Colors.ciOrange },

  submitBtn: { marginTop: 4 },
});
