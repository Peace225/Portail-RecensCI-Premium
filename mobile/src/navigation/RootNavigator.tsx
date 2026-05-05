import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../theme/colors';
import { ChatFAB } from '../components/ChatFAB';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';

// Navigateurs par rôle
import CitizenNavigator from './CitizenNavigator';
import AgentNavigator from './AgentNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loading, isLoggedIn, role } = useAuth();
  const user = useSelector((state: RootState) => state.user);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  const getNavigator = () => {
    if (!isLoggedIn) return null;
    switch (role) {
      case 'CITIZEN': return <CitizenNavigator />;
      case 'AGENT': return <AgentNavigator />;
      case 'ENTITY_ADMIN':
      case 'ADMIN':
      case 'SUPER_ADMIN': return <AdminNavigator />;
      default: return <CitizenNavigator />;
    }
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="App" component={() => getNavigator()} />
          )}
        </Stack.Navigator>
        {/* Chatbot IA disponible sur toutes les pages connectées */}
        {isLoggedIn && <ChatFAB />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
});
