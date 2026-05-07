import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const REGISTRES = [
  {
    id: '1', title: 'Registre des Naissances', icon: 'happy-outline', color: Colors.ciGreen,
    total: 4821, pending: 12, year: 2026,
  },
  {
    id: '2', title: 'Registre des Décès', icon: 'leaf-outline', color: '#64748b',
    total: 1203, pending: 5, year: 2026,
  },
  {
    id: '3', title: 'Registre des Mariages', icon: 'heart-outline', color: '#ec4899',
    total: 892, pending: 8, year: 2026,
  },
  {
    id: '4', title: 'Registre des Divorces', icon: 'scale-outline', color: '#f59e0b',
    total: 134, pending: 2, year: 2026,
  },
  {
    id: '5', title: 'Mariages Coutumiers', icon: 'library-outline', color: '#d97706',
    total: 67, pending: 3, year: 2026,
  },
  {
    id: '6', title: 'Naissances Hors Établissement', icon: 'home-outline', color: '#0ea5e9',
    total: 43, pending: 1, year: 2026,
  },
];

export default function MairieRegistresScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        Registres officiels — Année {new Date().getFullYear()}
      </Text>

      {REGISTRES.map((reg) => (
        <View key={reg.id} style={[styles.card, { borderLeftColor: reg.color, borderLeftWidth: 4 }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${reg.color}15` }]}>
              <Ionicons name={reg.icon as any} size={20} color={reg.color} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{reg.title}</Text>
              <Text style={styles.cardYear}>Année {reg.year}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: reg.color }]}>{reg.total.toLocaleString('fr-FR')}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: reg.pending > 0 ? Colors.warning : Colors.ciGreen }]}>
                {reg.pending}
              </Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.ciGreen }]}>
                {reg.total - reg.pending}
              </Text>
              <Text style={styles.statLabel}>Validés</Text>
            </View>
          </View>

          {reg.pending > 0 && (
            <View style={styles.pendingBanner}>
              <Ionicons name="time-outline" size={13} color={Colors.warning} />
              <Text style={styles.pendingText}>{reg.pending} acte{reg.pending > 1 ? 's' : ''} en attente de validation</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  subtitle: { fontSize: 12, color: Colors.textMuted, marginBottom: 20 },
  card: {
    backgroundColor: Colors.bgCard, borderRadius: 18,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardYear: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, borderRadius: 12, padding: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 9, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  pendingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, backgroundColor: `${Colors.warning}10`,
    borderRadius: 8, padding: 8,
  },
  pendingText: { fontSize: 11, color: Colors.warning, fontWeight: '700' },
});
