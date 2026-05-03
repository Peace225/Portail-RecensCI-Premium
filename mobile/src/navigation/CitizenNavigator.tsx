import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../theme/colors';

import CitizenHomeScreen from '../screens/citizen/CitizenHomeScreen';
import CitizenProfileScreen from '../screens/citizen/CitizenProfileScreen';
import CitizenRequestsScreen from '../screens/citizen/CitizenRequestsScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import CertificateRequestScreen from '../screens/shared/CertificateRequestScreen';
import SupportScreen from '../screens/shared/SupportScreen';
import EmergencyScreen from '../screens/citizen/EmergencyScreen';
import BirthDeclarationScreen from '../screens/citizen/BirthDeclarationScreen';
import DeathDeclarationScreen from '../screens/citizen/DeathDeclarationScreen';
import AddressChangeScreen from '../screens/citizen/AddressChangeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Accueil: '🏠', Profil: '👤', Demandes: '📋', Notifs: '🔔',
};

function CitizenTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.bgCard, borderTopColor: Colors.border, height: 64 },
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 22 }}>{TAB_ICONS[route.name] || '•'}</Text>
        ),
      })}
    >
      <Tab.Screen name="Accueil" component={CitizenHomeScreen} />
      <Tab.Screen name="Demandes" component={CitizenRequestsScreen} />
      <Tab.Screen name="Notifs" component={NotificationsScreen} />
      <Tab.Screen name="Profil" component={CitizenProfileScreen} />
    </Tab.Navigator>
  );
}

export default function CitizenNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bgCard },
        headerTintColor: Colors.orange,
        headerTitleStyle: { fontWeight: '800', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
        headerBackTitle: 'Retour',
      }}
    >
      <Stack.Screen name="CitizenTabs" component={CitizenTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CitizenProfile" component={CitizenProfileScreen} options={{ title: 'Mon Profil' }} />
      <Stack.Screen name="CitizenRequests" component={CitizenRequestsScreen} options={{ title: 'Mes Demandes' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="CertificateRequest" component={CertificateRequestScreen} options={{ title: 'Certificats' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Urgence' }} />
      <Stack.Screen name="BirthDeclaration" component={BirthDeclarationScreen} options={{ title: 'Déclarer une Naissance' }} />
      <Stack.Screen name="DeathDeclaration" component={DeathDeclarationScreen} options={{ title: 'Déclarer un Décès' }} />
      <Stack.Screen name="AddressChange" component={AddressChangeScreen} options={{ title: 'Changement d\'Adresse' }} />
    </Stack.Navigator>
  );
}
