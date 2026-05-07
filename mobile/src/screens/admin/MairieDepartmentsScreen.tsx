import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const DEPARTMENTS = [
  { id: '1', name: 'État Civil', icon: 'document-text-outline', color: Colors.ciOrange, agents: 8, description: 'Naissances, mariages, décès, divorces' },
  { id: '2', name: 'Urbanisme', icon: 'business-outline', color: '#3b82f6', agents: 5, description: 'Permis de construire, plans d\'urbanisme' },
  { id: '3', name: 'Finances', icon: 'cash-outline', color: '#f59e0b', agents: 4, description: 'Budget, taxes locales, recouvrement' },
  { id: '4', name: 'Affaires Sociales', icon: 'heart-outline', color: Colors.ciGreen, agents: 6, description: 'Aide sociale, personnes vulnérables' },
  { id: '5', name: 'Hygiène & Santé', icon: 'medical-outline', color: '#ec4899', agents: 3, description: 'Contrôle sanitaire, épidémies' },
  { id: '6', name: 'Sécurité', icon: 'shield-outline', color: '#64748b', agents: 12, description: 'Police municipale, ordre public' },
  { id: '7', name: 'Environnement', icon: 'leaf-outline', color: '#16a34a', agents: 3, description: 'Espaces verts, gestion des déchets' },
  { id: '8', name: 'Communication', icon: 'megaphone-outline', color: '#8b5cf6', agents: 2, description: 'Relations publiques, presse' },
];

export default function MairieDepartmentsScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        {DEPARTMENTS.reduce((acc, d) => acc + d.agents, 0)} agents répartis en {DEPARTMENTS.length} directions
      </Text>

      {DEPARTMENTS.map((dept) => (
        <TouchableOpacity
          key={dept.id}
          style={[styles.card, { borderColor: `${dept.color}30` }]}
          onPress={() => setExpanded(expanded === dept.id ? null : dept.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${dept.color}15` }]}>
              <Ionicons name={dept.icon as any} size={22} color={dept.color} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{dept.name}</Text>
              <Text style={styles.cardAgents}>{dept.agents} agent{dept.agents > 1 ? 's' : ''}</Text>
            </View>
            <Ionicons
              name={expanded === dept.id ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={18}
              color={Colors.textMuted}
            />
          </View>

          {expanded === dept.id && (
            <View style={styles.cardBody}>
              <Text style={styles.cardDesc}>{dept.description}</Text>
              <View style={styles.statRow}>
                <View style={[styles.statBadge, { backgroundColor: `${dept.color}15` }]}>
                  <Text style={[styles.statBadgeText, { color: dept.color }]}>
                    {dept.agents} agent{dept.agents > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: `${Colors.ciGreen}15` }]}>
                  <Text style={[styles.statBadgeText, { color: Colors.ciGreen }]}>Actif</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
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
    padding: 16, marginBottom: 10,
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardAgents: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  cardBody: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 12 },
  statRow: { flexDirection: 'row', gap: 8 },
  statBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statBadgeText: { fontSize: 11, fontWeight: '700' },
});
