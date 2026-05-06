import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme';

interface Props { message: string; emoji?: string; }

export default function EmptyState({ message, emoji = '📭' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emoji: { fontSize: 40, marginBottom: 12 },
  msg:   { fontSize: 15, color: COLORS.muted, textAlign: 'center' },
});
