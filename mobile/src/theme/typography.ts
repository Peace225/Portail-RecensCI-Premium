import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  body: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  small: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  label: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 },
  mono: { fontSize: 12, fontFamily: 'monospace', color: Colors.ciOrange },
});
