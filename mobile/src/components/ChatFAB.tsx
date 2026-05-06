import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { AIChatbot } from './AIChatbot';

export const ChatFAB: React.FC = () => {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // Position au-dessus de la tab bar (68px) + safe area bottom
  const bottomOffset = 68 + insets.bottom + 12;

  return (
    <View
      style={[styles.container, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <AIChatbot visible={open} onClose={() => setOpen(false)} />
      {!open && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    left: 16,
    alignItems: 'flex-end',
    zIndex: 999,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.ciGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.ciGreen,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.ciOrange,
  },
});


