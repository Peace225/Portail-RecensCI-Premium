import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
import CitizenDeclarationScreen from '../screens/citizen/CitizenDeclarationScreen';
import InternalMigrationScreen from '../screens/citizen/InternalMigrationScreen';
import SocialSecurityScreen from '../screens/citizen/SocialSecurityScreen';
import CensusDetailsScreen from '../screens/citizen/CensusDetailsScreen';
// Nouveaux modules
import ResidenceChangeScreen from '../screens/citizen/ResidenceChangeScreen';
import ExtraitNaissanceScreen from '../screens/citizen/ExtraitNaissanceScreen';
import CasierJudiciairScreen from '../screens/citizen/CasierJudiciairScreen';
import CNIPasseportScreen from '../screens/citizen/CNIPasseportScreen';
import ImpotsTaxesScreen from '../screens/citizen/ImpotsTaxesScreen';
import PorterPlainteScreen from '../screens/citizen/PorterPlainteScreen';
import BloquerCNIScreen from '../screens/citizen/BloquerCNIScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_CONFIG = [
  { name: 'Accueil', icon: 'home-outline', activeIcon: 'home' },
  { name: 'Demandes', icon: 'list-outline', activeIcon: 'list' },
  { name: 'Notifs', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'Profil', icon: 'person-outline', activeIcon: 'person' },
];

function CitizenTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = TAB_CONFIG.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.bgCard,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: Colors.ciOrange,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={(focused ? tab?.activeIcon : tab?.icon) as any || 'home-outline'}
              size={24}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen name="Accueil" component={CitizenHomeScreen} />
      <Tab.Screen name="Demandes" component={CitizenRequestsScreen} />
      <Tab.Screen name="Notifs" component={NotificationsScreen} />
      <Tab.Screen name="Profil" component={CitizenProfileScreen} />
    </Tab.Navigator>
  );
}

const HEADER_OPTS = {
  headerStyle: { backgroundColor: Colors.bgCard },
  headerTintColor: Colors.ciOrange,
  headerTitleStyle: { fontWeight: '800' as const, fontSize: 14, textTransform: 'uppercase' as const, letterSpacing: 1 },
};

export default function CitizenNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="CitizenTabs" component={CitizenTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CitizenProfile" component={CitizenProfileScreen} options={{ title: 'Mon Profil' }} />
      <Stack.Screen name="CitizenRequests" component={CitizenRequestsScreen} options={{ title: 'Mes Demandes' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="CertificateRequest" component={CertificateRequestScreen} options={{ title: 'Certificats' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Urgence' }} />
      {/* Déclarations état civil */}
      <Stack.Screen name="BirthDeclaration" component={BirthDeclarationScreen} options={{ title: 'Déclarer une Naissance' }} />
      <Stack.Screen name="DeathDeclaration" component={DeathDeclarationScreen} options={{ title: 'Déclarer un Décès' }} />
      <Stack.Screen name="CitizenDeclaration" component={CitizenDeclarationScreen} options={{ title: 'Mariage / Divorce' }} />
      <Stack.Screen name="AddressChange" component={AddressChangeScreen} options={{ title: 'Changement d\'Adresse' }} />
      <Stack.Screen name="InternalMigration" component={InternalMigrationScreen} options={{ title: 'Migration Interne' }} />
      {/* Services sociaux */}
      <Stack.Screen name="SocialSecurity" component={SocialSecurityScreen} options={{ title: 'Sécurité Sociale' }} />
      <Stack.Screen name="CensusDetails" component={CensusDetailsScreen} options={{ title: 'Recensement' }} />
      {/* Nouveaux modules */}
      <Stack.Screen name="ResidenceChange" component={ResidenceChangeScreen} options={{ title: 'Changement de Résidence' }} />
      <Stack.Screen name="ExtraitNaissance" component={ExtraitNaissanceScreen} options={{ title: 'Extrait de Naissance' }} />
      <Stack.Screen name="CasierJudiciaire" component={CasierJudiciairScreen} options={{ title: 'Casier Judiciaire' }} />
      <Stack.Screen name="CNIPasseport" component={CNIPasseportScreen} options={{ title: 'CNI / Passeport' }} />
      <Stack.Screen name="ImpotsTaxes" component={ImpotsTaxesScreen} options={{ title: 'Impôts & Taxes' }} />
      <Stack.Screen name="PorterPlainte" component={PorterPlainteScreen} options={{ title: 'Porter Plainte' }} />
      <Stack.Screen name="BloquerCNI" component={BloquerCNIScreen} options={{ title: 'Bloquer / Signaler CNI' }} />
    </Stack.Navigator>
  );
}


