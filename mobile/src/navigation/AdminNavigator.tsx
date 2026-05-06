import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import SupportScreen from '../screens/shared/SupportScreen';
import CitizenDatabaseScreen from '../screens/admin/CitizenDatabaseScreen';
import AgentListScreen from '../screens/admin/AgentListScreen';
import CitizenFluxScreen from '../screens/admin/CitizenFluxScreen';
import CitizenValidationScreen from '../screens/admin/CitizenValidationScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import AuditLogsScreen from '../screens/admin/AuditLogsScreen';
import ApiKeysScreen from '../screens/admin/ApiKeysScreen';
import HealthAlertsScreen from '../screens/shared/HealthAlertsScreen';
import IncidentMapScreen from '../screens/shared/IncidentMapScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.bgCard, borderTopColor: Colors.border, height: 64, paddingBottom: 8 },
        tabBarActiveTintColor: Colors.ciOrange,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
        tabBarIcon: ({ color }) => {
          const name = route.name === 'Dashboard' ? 'grid-outline' : route.name === 'Notifs' ? 'notifications-outline' : 'chatbubble-outline';
          return <Ionicons name={name as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminHomeScreen} />
      <Tab.Screen name="Notifs" component={NotificationsScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
}

const HEADER_OPTS = {
  headerStyle: { backgroundColor: Colors.bgCard },
  headerTintColor: Colors.ciOrange,
  headerTitleStyle: { fontWeight: '800' as const, fontSize: 14, textTransform: 'uppercase' as const, letterSpacing: 1 },
};

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CitizenDatabase" component={CitizenDatabaseScreen} options={{ title: 'Base Citoyens' }} />
      <Stack.Screen name="AgentList" component={AgentListScreen} options={{ title: 'Agents' }} />
      <Stack.Screen name="CitizenFlux" component={CitizenFluxScreen} options={{ title: 'Flux Citoyens' }} />
      <Stack.Screen name="CitizenValidation" component={CitizenValidationScreen} options={{ title: 'Validation' }} />
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Rapports' }} />
      <Stack.Screen name="AuditLogs" component={AuditLogsScreen} options={{ title: 'Journal d\'Audit' }} />
      <Stack.Screen name="ApiKeys" component={ApiKeysScreen} options={{ title: 'Clés API' }} />
      <Stack.Screen name="HealthAlerts" component={HealthAlertsScreen} options={{ title: 'Alertes Sanitaires' }} />
      <Stack.Screen name="IncidentMap" component={IncidentMapScreen} options={{ title: 'Carte Incidents' }} />
    </Stack.Navigator>
  );
}


