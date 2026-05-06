import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = '#f97316', bg }) => (
  <View style={[styles.badge, { backgroundColor: bg || `${color}20`, borderColor: `${color}40` }]}>
    <Text style={[styles.text, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
});


