import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, rightIcon, onRightIconPress, style, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.focused, error && styles.errorBorder]}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, style]}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity style={styles.iconRight} onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 10, fontWeight: '800', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgInput, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, height: 52,
  },
  focused: { borderColor: Colors.orange },
  errorBorder: { borderColor: Colors.error },
  iconLeft: { paddingLeft: 16, paddingRight: 8 },
  iconRight: { paddingRight: 16, paddingLeft: 8 },
  input: {
    flex: 1, color: Colors.textPrimary, fontSize: 14,
    fontWeight: '600', paddingHorizontal: 16,
  },
  inputWithIcon: { paddingLeft: 0 },
  error: { fontSize: 11, color: Colors.error, marginTop: 4, marginLeft: 4 },
});
