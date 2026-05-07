import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
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
}

const RELATIONS = ['Chef de ménage', 'Conjoint(e)', 'Enfant', 'Parent', 'Frère/Sœur', 'Autre'];
const HOUSING_TYPES = ['Appartement', 'Villa', 'Maison', 'Studio', 'Chambre', 'Autre'];
const OWNERSHIP = ['Propriétaire', 'Locataire', 'Hébergé gratuitement'];

// ─── Composant membre ─────────────────────────────────────────────────────────

function MemberCard({
  member, index, onChange, onRemove,
}: {
  member: HouseholdMember;
  index: number;
  onChange: (id: string, key: keyof HouseholdMember, val: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <View style={memberStyles.card}>
      <View style={memberStyles.cardHeader}>
        <View style={memberStyles.badge}>
          <Ionicons name="person-outline" size={14} color={Colors.ciOrange} />
          <Text style={memberStyles.badgeText}>Membre {index + 1}</Text>
        </View>
        {index > 0 && (
          <TouchableOpacity onPress={() => onRemove(member.id)} style={memberStyles.removeBtn}>
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <Input
        label="Nom complet *"
        value={member.fullName}
        onChangeText={v => onChange(member.id, 'fullName', v)}
        placeholder="Nom et prénoms"
      />
      <Input
        label="Date de naissance"
        value={member.birthDate}
        onChangeText={v => onChange(member.id, 'birthDate', v)}
        placeholder="AAAA-MM-JJ"
      />
      <Input
        label="NNI"
        value={member.nni}
        onChangeText={v => onChange(member.id, 'nni', v)}
        placeholder="CI-XXXX-XXXX"
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${Colors.ciOrange}15`, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: `${Colors.ciOrange}30`,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: Colors.ciOrange, textTransform: 'uppercase' },
  removeBtn: { padding: 6, backgroundColor: 'rgba(220,38,38,0.1)', borderRadius: 8 },
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

  // Résidence
  const [residence, setResidence] = useState({
    address: '', city: '', commune: '', quartier: '',
    phone: '', housingType: 'Appartement', ownership: 'Locataire',
  });
  const setRes = (key: string) => (val: string) => setResidence(r => ({ ...r, [key]: val }));

  // Membres du ménage — chef de ménage pré-rempli avec le citoyen connecté
  const [members, setMembers] = useState<HouseholdMember[]>([
    {
      id: '1',
      fullName: user.name || '',
      birthDate: '',
      gender: 'MASCULIN',
      relation: 'Chef de ménage',
      nni: user.nni || '',
    },
  ]);

  const addMember = () => {
    setMembers(m => [
      ...m,
      {
        id: Date.now().toString(),
        fullName: '', birthDate: '', gender: 'MASCULIN',
        relation: 'Enfant', nni: '',
      },
    ]);
  };

  const updateMember = (id: string, key: keyof HouseholdMember, val: string) => {
    setMembers(m => m.map(mb => mb.id === id ? { ...mb, [key]: val } : mb));
  };

  const removeMember = (id: string) => {
    setMembers(m => m.filter(mb => mb.id !== id));
  };

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
        members,
        householdSize: members.length,
      });
      Alert.alert(
        'Recensement soumis',
        `Votre ménage de ${members.length} personne(s) a été enregistré avec succès.`,
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
          <Ionicons name="information-circle-outline" size={20} color={Colors.ciGreen} />
          <Text style={styles.infoText}>
            Recensez tous les membres vivant sous votre toit. Ces données alimentent le registre national de population.
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
          <Text style={styles.memberNote}>
            Incluez toutes les personnes vivant habituellement sous votre toit.
          </Text>

          {members.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              index={index}
              onChange={updateMember}
              onRemove={removeMember}
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
