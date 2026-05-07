import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

/**
 * Bande tricolore CI (orange | blanc | vert) — 3px en haut de chaque header.
 * Utilisée comme `headerBackground` dans les navigateurs.
 */
export function FlagStripe() {
  return (
    <View style={styles.wrapper}>
      {/* Fond du header */}
      <View style={styles.bg} />
      {/* Bande tricolore en haut */}
      <View style={styles.stripe}>
        <View style={[styles.band, { backgroundColor: Colors.ciOrange }]} />
        <View style={[styles.band, { backgroundColor: Colors.ciWhite }]} />
        <View style={[styles.band, { backgroundColor: Colors.ciGreen }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.bgCard },
  stripe: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    flexDirection: 'row',
  },
  band: { flex: 1 },
});
