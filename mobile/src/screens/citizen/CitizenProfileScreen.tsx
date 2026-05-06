import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Colors } from '../../theme/colors';

export default function CitizenProfileScreen() {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();

  const fields = [
    { label: 'Nom complet', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'NNI', value: user.nni || 'Non renseigné' },
    { label: 'Structure', value: user.structureId || 'Non renseigné' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Badge label="Citoyen" color={Colors.ciOrange} />
      </View>

      <Card style={styles.infoCard} accent={Colors.ciOrange}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        {fields.map(f => (
          <View key={f.label} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{f.label}</Text>
            <Text style={styles.fieldValue}>{f.value}</Text>
          </View>
        ))}
      </Card>

      <Button title="Se déconnecter" onPress={logout} variant="danger" style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  avatarSection: { alignItems: 'center', marginBottom: 28, marginTop: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: `${Colors.ciOrange}20`, borderWidth: 2, borderColor: Colors.ciOrange, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '900', color: Colors.ciOrange },
  name: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  infoCard: { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
  fieldRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  fieldLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  fieldValue: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  logoutBtn: { marginTop: 8 },
});


