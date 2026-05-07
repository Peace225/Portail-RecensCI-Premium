import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function MairieSettingsScreen() {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [autoValidate, setAutoValidate] = useState(false);

  const INFOS = [
    { label: 'Nom', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Rôle', value: user.role === 'ENTITY_ADMIN' ? 'Administrateur Mairie' : user.role },
    { label: 'Structure', value: user.structureId || 'Mairie de Cocody' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Profil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon Profil</Text>
        {INFOS.map(({ label, value }) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || '—'}</Text>
          </View>
        ))}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {[
          { label: 'Notifications Email', icon: 'mail-outline', value: notifEmail, set: setNotifEmail },
          { label: 'Notifications SMS', icon: 'chatbubble-outline', value: notifSms, set: setNotifSms },
          { label: 'Notifications Push', icon: 'notifications-outline', value: notifPush, set: setNotifPush },
        ].map(({ label, icon, value, set }) => (
          <View key={label} style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Ionicons name={icon as any} size={18} color={Colors.ciOrange} />
              <Text style={styles.toggleLabel}>{label}</Text>
            </View>
            <Switch
              value={value}
              onValueChange={set}
              trackColor={{ false: Colors.border, true: `${Colors.ciOrange}60` }}
              thumbColor={value ? Colors.ciOrange : Colors.textMuted}
            />
          </View>
        ))}
      </View>

      {/* Paramètres mairie */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres Mairie</Text>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.ciGreen} />
            <View>
              <Text style={styles.toggleLabel}>Validation automatique</Text>
              <Text style={styles.toggleSub}>Valider les actes sans vérification manuelle</Text>
            </View>
          </View>
          <Switch
            value={autoValidate}
            onValueChange={setAutoValidate}
            trackColor={{ false: Colors.border, true: `${Colors.ciGreen}60` }}
            thumbColor={autoValidate ? Colors.ciGreen : Colors.textMuted}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => Alert.alert('Mot de passe', 'Un email de réinitialisation a été envoyé.')}
        >
          <Ionicons name="lock-closed-outline" size={18} color={Colors.ciOrange} />
          <Text style={styles.actionLabel}>Changer le mot de passe</Text>
          <Ionicons name="chevron-forward-outline" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionRow, styles.logoutRow]}
          onPress={() => Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnecter', style: 'destructive', onPress: logout },
          ])}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={[styles.actionLabel, { color: Colors.error }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>RecensCI v1.0.0 — Portail National d'État Civil</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  section: {
    backgroundColor: Colors.bgCard, borderRadius: 20,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 10, fontWeight: '800', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 12, color: Colors.textMuted },
  infoValue: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  toggleSub: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  actionLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  logoutRow: { borderBottomWidth: 0 },
  version: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 8 },
});
