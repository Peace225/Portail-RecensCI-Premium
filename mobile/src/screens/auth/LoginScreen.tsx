import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

// MODE DÉMO // Chaque profil simule un rôle sans appel API
const DEMO_PROFILES = [
  {
    label: 'Super Admin',
    color: '#a855f7',
    icon: 'shield-checkmark-outline' as const,
    user: {
      id: 'demo-superadmin',
      name: 'Super Administrateur',
      email: 'superadmin@recensci.ci',
      role: 'SUPER_ADMIN' as const,
      nni: null,
      photoUrl: null,
      structureId: null,
    },
  },
  {
    label: 'Admin Mairie',
    color: '#f59e0b',
    icon: 'business-outline' as const,
    user: {
      id: 'demo-maire',
      name: 'Maire de Cocody',
      email: 'maire@recensci.ci',
      role: 'ENTITY_ADMIN' as const,
      nni: null,
      photoUrl: null,
      structureId: 'inst-cocody',
    },
  },
  {
    label: 'Agent Terrain',
    color: '#f97316',
    icon: 'person-outline' as const,
    user: {
      id: 'demo-agent',
      name: 'Agent Koné',
      email: 'agent@recensci.ci',
      role: 'AGENT' as const,
      nni: null,
      photoUrl: null,
      structureId: 'inst-cocody',
    },
  },
  {
    label: 'Citoyen',
    color: '#10b981',
    icon: 'people-outline' as const,
    user: {
      id: 'demo-citoyen',
      name: 'Kouassi Jean',
      email: 'citoyen@recensci.ci',
      role: 'CITIZEN' as const,
      nni: 'CI-0001-2024',
      photoUrl: null,
      structureId: null,
    },
  },
];

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<string | null>(null);

  // Connexion démo instantanée — pas d'appel API
  const handleDemoLogin = async (profile: typeof DEMO_PROFILES[0]) => {
    setLoading(profile.label);
    // Stocker un token fictif pour que useAuth ne redirige pas vers login
    await SecureStore.setItemAsync('recensci_token', `demo_token_${profile.user.role}`);
    dispatch(login(profile.user));
    setLoading(null);
  };

  return (
    <LinearGradient colors={['#0A0F0D', '#0F1A12', '#0A0F0D']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>R</Text>
            </View>
            <Text style={styles.appName}>
              RECENS<Text style={styles.appNameAccent}>CI</Text>
            </Text>
            <Text style={styles.tagline}>Portail National d'État Civil</Text>
          </View>

          {/* Badge démo */}
          <View style={styles.demoBadge}>
            <Ionicons name="flash-outline" size={14} color={Colors.ciOrange} />
            <Text style={styles.demoBadgeText}>MODE DÉMONSTRATION — Accès direct par rôle</Text>
          </View>

          {/* Boutons de démo */}
          <View style={styles.demoGrid}>
            {DEMO_PROFILES.map((profile) => (
              <TouchableOpacity
                key={profile.label}
                style={[styles.demoCard, { borderColor: `${profile.color}40` }]}
                onPress={() => handleDemoLogin(profile)}
                activeOpacity={0.8}
                disabled={loading !== null}
              >
                <View style={[styles.demoIconBox, { backgroundColor: `${profile.color}15` }]}>
                  <Ionicons name={profile.icon} size={28} color={profile.color} />
                </View>
                <Text style={[styles.demoLabel, { color: profile.color }]}>{profile.label}</Text>
                {loading === profile.label && (
                  <Text style={styles.demoLoading}>...</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Séparateur */}
          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou connexion manuelle</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Comptes de test */}
          <View style={styles.testAccounts}>
            <Text style={styles.testTitle}>Comptes de test (mot de passe : password123)</Text>
            {DEMO_PROFILES.map(p => (
              <Text key={p.user.email} style={[styles.testItem, { color: p.color }]}>
                {p.label} — {p.user.email}
              </Text>
            ))}
          </View>

          {/* Info sécurité */}
          <View style={styles.securityBadge}>
            <Ionicons name="lock-closed-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.securityText}>Connexion Sécurisée AES-256</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },

  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: Colors.ciOrange, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, shadowColor: Colors.ciOrange, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  appName: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  appNameAccent: { color: Colors.ciOrange },
  tagline: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },

  demoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: `${Colors.ciOrange}15`, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: `${Colors.ciOrange}30`,
    alignSelf: 'center', marginBottom: 24,
  },
  demoBadgeText: { fontSize: 10, color: Colors.ciOrange, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },

  demoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    justifyContent: 'center', marginBottom: 28,
  },
  demoCard: {
    width: '45%', backgroundColor: Colors.bgCard,
    borderRadius: 20, padding: 20, alignItems: 'center',
    borderWidth: 1, gap: 10,
  },
  demoIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  demoLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },
  demoLoading: { fontSize: 18, color: Colors.textMuted },

  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  separatorLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  separatorText: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },

  testAccounts: {
    backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 20,
  },
  testTitle: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, fontWeight: '800' },
  testItem: { fontSize: 11, marginBottom: 5, fontWeight: '600' },

  securityBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  securityText: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
});


