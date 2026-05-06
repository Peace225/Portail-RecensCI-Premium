import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const SEVERITY_COLORS: Record<string, string> = { LEGER: Colors.success, GRAVE: Colors.warning, FATAL: Colors.error };
const TYPE_ICONS: Record<string, string> = { ACCIDENT: 'car-outline', HOMICIDE: 'warning-outline', AGRESSION: 'alert-circle-outline', AUTRE: 'location-outline' };

export default function IncidentMapScreen() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data } = await api.get('/security/map');
        setIncidents(data || []);
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les incidents.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.ciOrange} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Carte des Incidents</Text>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={40} color={Colors.textMuted} style={{ marginBottom: 8 }} />
        <Text style={styles.mapText}>Carte interactive — bientôt disponible</Text>
      </View>
      <Text style={styles.sectionTitle}>Liste des incidents ({incidents.length})</Text>
      {incidents.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Aucun incident signalé</Text></View>
      ) : (
        incidents.map((inc: any) => (
          <View key={inc.id} style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name={(TYPE_ICONS[inc.type] || 'location-outline') as any} size={28} color={Colors.ciOrange} style={{ marginRight: 12 }} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardType}>{inc.type}</Text>
                <Text style={styles.cardLocation}>{inc.location}</Text>
              </View>
              <Badge label={inc.severity || 'N/A'} color={SEVERITY_COLORS[inc.severity] || Colors.textMuted} />
            </View>
            <View style={styles.cardFooter}>
              <Badge label={inc.status || 'OUVERT'} color={Colors.info} />
              <Text style={styles.cardDate}>{new Date(inc.createdAt).toLocaleDateString('fr-FR')}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 16 },
  mapPlaceholder: { backgroundColor: Colors.bgCard, borderRadius: 20, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  mapText: { fontSize: 12, color: Colors.textMuted },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  card: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardInfo: { flex: 1 },
  cardType: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  cardLocation: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
});


