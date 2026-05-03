import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import AgentHomeScreen from '../screens/agent/AgentHomeScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import SupportScreen from '../screens/shared/SupportScreen';
import CertificateRequestScreen from '../screens/shared/CertificateRequestScreen';
import HealthAlertsScreen from '../screens/shared/HealthAlertsScreen';

// Formulaires
import BirthFormScreen from '../screens/agent/forms/BirthFormScreen';
import DeathFormScreen from '../screens/agent/forms/DeathFormScreen';
import MarriageFormScreen from '../screens/agent/forms/MarriageFormScreen';
import DivorceFormScreen from '../screens/agent/forms/DivorceFormScreen';
import AccidentFormScreen from '../screens/agent/forms/AccidentFormScreen';
import HomicideFormScreen from '../screens/agent/forms/HomicideFormScreen';
import MaternalDeathFormScreen from '../screens/agent/forms/MaternalDeathFormScreen';
import InternalMigrationFormScreen from '../screens/agent/forms/InternalMigrationFormScreen';
import InternationalMigrationFormScreen from '../screens/agent/forms/InternationalMigrationFormScreen';
import CustomaryMarriageFormScreen from '../screens/agent/forms/CustomaryMarriageFormScreen';
import OutOfFacilityBirthFormScreen from '../screens/agent/forms/OutOfFacilityBirthFormScreen';
import IncidentMapScreen from '../screens/shared/IncidentMapScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AgentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.bgCard, borderTopColor: Colors.border, height: 64 },
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
        tabBarIcon: ({ color }) => {
          const name = route.name === 'Tableau de Bord' ? 'stats-chart-outline' : route.name === 'Notifs' ? 'notifications-outline' : 'chatbubble-outline';
          return <Ionicons name={name as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tableau de Bord" component={AgentHomeScreen} />
      <Tab.Screen name="Notifs" component={NotificationsScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
}

const HEADER_OPTS = {
  headerStyle: { backgroundColor: Colors.bgCard },
  headerTintColor: Colors.orange,
  headerTitleStyle: { fontWeight: '800' as const, fontSize: 14, textTransform: 'uppercase' as const, letterSpacing: 1 },
};

export default function AgentNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="AgentTabs" component={AgentTabs} options={{ headerShown: false }} />
      {/* Formulaires état civil */}
      <Stack.Screen name="BirthForm" component={BirthFormScreen} options={{ title: 'Acte de Naissance' }} />
      <Stack.Screen name="DeathForm" component={DeathFormScreen} options={{ title: 'Acte de Décès' }} />
      <Stack.Screen name="MarriageForm" component={MarriageFormScreen} options={{ title: 'Acte de Mariage' }} />
      <Stack.Screen name="DivorceForm" component={DivorceFormScreen} options={{ title: 'Acte de Divorce' }} />
      <Stack.Screen name="CustomaryMarriage" component={CustomaryMarriageFormScreen} options={{ title: 'Mariage Coutumier' }} />
      <Stack.Screen name="OutOfFacilityBirth" component={OutOfFacilityBirthFormScreen} options={{ title: 'Naissance Hors Établissement' }} />
      {/* Sécurité */}
      <Stack.Screen name="AccidentForm" component={AccidentFormScreen} options={{ title: 'Accident Routier' }} />
      <Stack.Screen name="HomicideForm" component={HomicideFormScreen} options={{ title: 'Homicide / Enquête' }} />
      <Stack.Screen name="MaternalDeath" component={MaternalDeathFormScreen} options={{ title: 'Mort Maternelle' }} />
      {/* Migrations */}
      <Stack.Screen name="InternalMigration" component={InternalMigrationFormScreen} options={{ title: 'Migration Interne' }} />
      <Stack.Screen name="InternationalMigration" component={InternationalMigrationFormScreen} options={{ title: 'Flux International' }} />
      {/* Outils */}
      <Stack.Screen name="IncidentMap" component={IncidentMapScreen} options={{ title: 'Carte des Incidents' }} />
      <Stack.Screen name="HealthAlerts" component={HealthAlertsScreen} options={{ title: 'Alertes Sanitaires' }} />
      <Stack.Screen name="CertificateRequest" component={CertificateRequestScreen} options={{ title: 'Certificats' }} />
    </Stack.Navigator>
  );
}
