import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../theme/colors';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez renseigner votre email et mot de passe.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('recensci_token', data.access_token);
      dispatch(login({
        id: data.user.id,
        name: data.user.name || email.split('@')[0],
        email,
        role: data.user.role,
        nni: null,
        institutionId: data.user.institutionId || null,
      }));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Email ou mot de passe incorrect.';
      Alert.alert('Erreur de connexion', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#020617', '#0f172a', '#020617']} style={styles.gradient}>
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

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Terminal d'Accès</Text>
            <Text style={styles.cardSubtitle}>Identification Sécurisée</Text>

            <View style={styles.form}>
              <Input
                label="Email / Matricule"
                placeholder="nom@exemple.ci"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  <Text style={styles.showHide}>{showPassword ? 'Cacher' : 'Voir'}</Text>
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            <Button
              title="Ouvrir la Session"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />

            <View style={styles.securityBadge}>
              <Text style={styles.securityText}>Connexion Sécurisée AES-256</Text>
            </View>
          </View>

          {/* Comptes test */}
          <View style={styles.testAccounts}>
            <Text style={styles.testTitle}>Comptes de test</Text>
            {[
              { role: 'Super Admin', email: 'superadmin@recensci.ci' },
              { role: 'Mairie', email: 'maire@recensci.ci' },
              { role: 'Agent', email: 'agent@recensci.ci' },
              { role: 'Citoyen', email: 'citoyen@recensci.ci' },
            ].map(acc => (
              <Text key={acc.email} style={styles.testItem} onPress={() => { setEmail(acc.email); setPassword('password123'); }}>
                {acc.role} — {acc.email}
              </Text>
            ))}
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
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: Colors.orange, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, shadowColor: Colors.orange, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  appName: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  appNameAccent: { color: Colors.orange },
  tagline: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
  card: {
    backgroundColor: 'rgba(5,9,20,0.9)', borderRadius: 28,
    padding: 28, borderWidth: 1, borderColor: Colors.border,
    borderTopWidth: 3, borderTopColor: Colors.orange,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 4 },
  cardSubtitle: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 28 },
  form: { marginBottom: 8 },
  loginBtn: { marginTop: 8 },
  showHide: { fontSize: 11, color: Colors.orange, fontWeight: '700' },
  securityBadge: { alignItems: 'center', marginTop: 16 },
  securityText: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  testAccounts: { marginTop: 32, padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  testTitle: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: '800' },
  testItem: { fontSize: 12, color: Colors.orange, marginBottom: 6, fontWeight: '600' },
});
