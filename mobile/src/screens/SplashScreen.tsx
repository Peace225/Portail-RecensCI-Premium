import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const TARGET_POPULATION = 29389142;

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [population, setPopulation] = useState(0);
  const [ready, setReady] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(-height * 0.3)).current;

  useEffect(() => {
    // Entrée
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // Scan line
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: height * 0.3,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse sur le dot live
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Compteur animé — monte de 0 à TARGET en 2.5s
    const duration = 2500;
    const steps = 80;
    const increment = TARGET_POPULATION / steps;
    const interval = duration / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current += increment;
      if (count >= steps) {
        clearInterval(timer);
        setPopulation(TARGET_POPULATION);
        setReady(true);
        // Après le compteur, incrément live toutes les 3s
        const liveTimer = setInterval(() => {
          setPopulation(p => p + Math.floor(Math.random() * 3) + 1);
        }, 3000);
        return () => clearInterval(liveTimer);
      } else {
        setPopulation(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#020617', '#0a0f1c', '#020617']}
      style={styles.container}
    >
      {/* Grille cyber */}
      <View style={styles.grid} pointerEvents="none">
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: (width / 8) * i }]} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: (height / 12) * i }]} />
        ))}
      </View>

      {/* Scan line */}
      <Animated.View
        style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]}
        pointerEvents="none"
      />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>R</Text>
          </View>
          <View>
            <Text style={styles.appName}>
              RECENS<Text style={styles.appNameAccent}>CI</Text>
            </Text>
            <Text style={styles.tagline}>Portail National d'État Civil</Text>
          </View>
        </View>

        {/* Ticker */}
        <View style={styles.ticker}>
          {['STATUT : OPÉRATIONNEL', 'IA : ACTIVE', 'SÉCURITÉ : NIVEAU 5', 'DATA : CHIFFRÉE'].map((t, i) => (
            <View key={i} style={styles.tickerItem}>
              <View style={styles.tickerDot} />
              <Text style={styles.tickerText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Compteur population */}
        <View style={styles.counterCard}>
          <View style={styles.counterHeader}>
            <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={styles.counterLabel}>Population estimée (Live)</Text>
          </View>
          <Text style={styles.counterValue}>
            {population.toLocaleString('fr-FR')}
          </Text>
          <Text style={styles.counterSub}>habitants • Côte d'Ivoire</Text>
        </View>

        {/* Stats rapides */}
        <View style={styles.statsRow}>
          {[
            { label: 'Communes', value: '14', icon: 'business-outline' },
            { label: 'Modules', value: '16', icon: 'grid-outline' },
            { label: 'Sécurité', value: 'AES-256', icon: 'lock-closed-outline' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={20} color={Colors.orange} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Bouton entrer */}
        {ready && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity style={styles.enterBtn} onPress={onEnter} activeOpacity={0.8}>
              <Ionicons name="flash-outline" size={18} color="#fff" />
              <Text style={styles.enterBtnText}>Accéder au Portail</Text>
              <Ionicons name="arrow-forward-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {!ready && (
          <View style={styles.loadingRow}>
            <View style={styles.loadingDot} />
            <Text style={styles.loadingText}>Synchronisation des données souveraines...</Text>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  grid: { position: 'absolute', inset: 0 },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(249,115,22,0.04)' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(249,115,22,0.04)' },

  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    backgroundColor: 'rgba(249,115,22,0.3)',
    shadowColor: Colors.orange, shadowOpacity: 0.8, shadowRadius: 10,
  },

  content: { width: '100%', paddingHorizontal: 24, alignItems: 'center', gap: 24 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logoBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: Colors.orange, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.orange, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  logoLetter: { fontSize: 28, fontWeight: '900', color: '#fff' },
  appName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  appNameAccent: { color: Colors.orange },
  tagline: { fontSize: 9, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 2, marginTop: 2 },

  ticker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tickerItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(249,115,22,0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)' },
  tickerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.orange },
  tickerText: { fontSize: 8, color: Colors.orange, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },

  counterCard: {
    width: '100%', backgroundColor: 'rgba(5,9,20,0.9)',
    borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: `${Colors.orange}30`,
    borderLeftWidth: 4, borderLeftColor: Colors.orange,
    alignItems: 'flex-start',
    shadowColor: Colors.orange, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  counterHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.orange },
  counterLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' },
  counterValue: { fontSize: 38, fontWeight: '900', color: '#fff', fontFamily: 'monospace', letterSpacing: -1 },
  counterSub: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  statCard: {
    flex: 1, backgroundColor: 'rgba(5,9,20,0.8)', borderRadius: 16,
    padding: 14, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: 14, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 9, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },

  enterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.orange, paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 20, shadowColor: Colors.orange, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  enterBtnText: { fontSize: 13, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5 },

  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.orange },
  loadingText: { fontSize: 10, color: Colors.textMuted, fontFamily: 'monospace' },
});
