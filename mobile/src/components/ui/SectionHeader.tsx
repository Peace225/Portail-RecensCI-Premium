import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface SectionHeaderProps {
  icon: string;
  title: string;
  color?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon, title, color = Colors.ciOrange,
}) => (
  <View style={styles.container}>
    <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as any} size={16} color={color} />
    </View>
    <Text style={[styles.title, { color }]}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
