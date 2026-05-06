import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STATUS_COLOR, COLORS } from '../theme';

interface Props { label: string; }

export default function Badge({ label }: Props) {
  const color = STATUS_COLOR[label] ?? COLORS.muted;
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, alignSelf: 'flex-start' },
  text:  { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
