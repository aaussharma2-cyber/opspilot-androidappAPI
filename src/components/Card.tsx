import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../theme';

interface Props { children: React.ReactNode; style?: ViewStyle; }

export default function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card, borderRadius: 10, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.line,
  },
});
