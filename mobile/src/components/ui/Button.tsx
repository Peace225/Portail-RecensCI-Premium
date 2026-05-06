import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, loading, disabled, variant = 'primary', style,
}) => {
  const variantStyle = {
    primary: styles.primary,
    secondary: styles.secondary,
    danger: styles.danger,
    ghost: styles.ghost,
  }[variant];

  const textStyle = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    danger: styles.textDanger,
    ghost: styles.textGhost,
  }[variant];

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : Colors.ciOrange} size="small" />
        : <Text style={[styles.text, textStyle]}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: { backgroundColor: Colors.ciOrange },
  secondary: { backgroundColor: 'rgba(249,115,22,0.1)', borderWidth: 1, borderColor: Colors.ciOrange },
  danger: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: Colors.error },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  disabled: { opacity: 0.5 },
  text: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
  textPrimary: { color: '#fff' },
  textSecondary: { color: Colors.ciOrange },
  textDanger: { color: Colors.error },
  textGhost: { color: Colors.textSecondary },
});


