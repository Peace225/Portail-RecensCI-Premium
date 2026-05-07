import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../theme/colors';
import { ChatFAB } from '../components/ChatFAB';
import SplashScreen from '../screens/SplashScreen';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';

// Navigateurs par rôle
import CitizenNavigator from './CitizenNavigator';
import AgentNavigator from './AgentNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator();

// Composant stable défini HORS de RootNavigator — évite toute violation des Rules of Hooks
function RoleNavigator({ role }: { role: string | null }) {
  switch (role) {
    case 'CITIZEN':     return <CitizenNavigator />;
    case 'AGENT':       return <AgentNavigator />;
    case 'ENTITY_ADMIN':
    case 'ADMIN':
    case 'SUPER_ADMIN': return <AdminNavigator />;
    default:            return <CitizenNavigator />;
  }
}

// Écran de chargement inline (pas de NavigationContainer nécessaire)
function LoadingScreen() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={Colors.ciOrange} />
    </View>
  );
}

export default function RootNavigator() {
  // ── Tous les hooks AVANT tout return conditionnel ──
  const { loading, isLoggedIn, role } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  // Splash — avant NavigationContainer, c'est intentionnel
  if (!splashDone) {
    return <SplashScreen onEnter={() => setSplashDone(true)} />;
  }

  // Auth en cours de vérification
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <View style={styles.root}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="App">
              {() => <RoleNavigator role={role} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
        {isLoggedIn && <ChatFAB />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
