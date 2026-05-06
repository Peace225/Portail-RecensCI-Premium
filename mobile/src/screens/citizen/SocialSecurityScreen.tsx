import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function SocialSecurityScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.id) {
      api.get(`/citizens/${user.id}/social-benefits`)
        .then(({ data }) => setData(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user.id]);

  if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.ciGreen} size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Vos droits et prestations sociales enregistrés dans le système national.</Text>

      <Card style={styles.card} accent={Colors.ciGreen}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark-outline" size={24} color={Colors.ciGreen} />
          <Text style={styles.cardTitle}>Couverture Maladie</Text>
        </View>
        <Badge
          label={data?.healthCoverage?.status || 'NON INSCRIT'}
          color={data?.healthCoverage?.status === 'INSCRIT' ? Colors.ciGreen : Colors.textMuted}
        />
      </Card>

      <Card style={styles.card} accent={Colors.ciOrange}>
        <View style={styles.cardHeader}>
          <Ionicons name="cash-outline" size={24} color={Colors.ciOrange} />
          <Text style={styles.cardTitle}>Pension / Retraite</Text>
        </View>
        <Badge
          label={data?.pension?.status || 'NON ÉLIGIBLE'}
          color={data?.pension?.status === 'ELIGIBLE' ? Colors.ciOrange : Colors.textMuted}
        />
        {data?.pension?.amount > 0 && (
          <Text style={styles.amount}>{data.pension.amount.toLocaleString('fr-FR')} FCFA / mois</Text>
        )}
      </Card>

      <Card style={styles.card} accent={Colors.ciGreen}>
        <View style={styles.cardHeader}>
          <Ionicons name="school-outline" size={24} color={Colors.ciGreen} />
          <Text style={styles.cardTitle}>Bourse / Aide Scolaire</Text>
        </View>
        <Badge
          label={data?.scholarship?.status || 'NON ÉLIGIBLE'}
          color={data?.scholarship?.status === 'ELIGIBLE' ? Colors.ciGreen : Colors.textMuted}
        />
      </Card>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.ciOrange} />
        <Text style={styles.infoText}>
          Pour toute réclamation ou mise à jour de vos droits, contactez le service social de votre mairie ou utilisez le support.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' },
  intro: { fontSize: 13, color: Colors.textMuted, marginBottom: 20, lineHeight: 20 },
  card: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  amount: { fontSize: 18, fontWeight: '900', color: Colors.ciOrange, marginTop: 8 },
  infoBox: {
    flexDirection: 'row', gap: 10, backgroundColor: `${Colors.ciOrange}10`,
    borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${Colors.ciOrange}20`, marginTop: 8,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
});


