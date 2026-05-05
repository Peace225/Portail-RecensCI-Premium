import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { AIChatbot } from './AIChatbot';

export const ChatFAB: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <AIChatbot visible={open} onClose={() => setOpen(false)} />
      {!open && (
        <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 16, right: 16, left: 16,
    alignItems: 'flex-end', zIndex: 999,
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.orange,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.orange, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
  },
});
