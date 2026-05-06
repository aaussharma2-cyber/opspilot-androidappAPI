import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT, SHADOW } from '../theme';

interface Props {
  title: string;
  subtitle: string;
  accent?: string;
  icon?: string;
  onPress: () => void;
}

export default function ModuleCard({ title, subtitle, accent = COLORS.blue, icon = '•', onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.card, { borderLeftColor: accent }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
        <Text style={[styles.icon, { color: accent }]}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 10,
    ...SHADOW,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18, fontWeight: '900' },
  title: { color: COLORS.text, fontSize: FONT.md, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: FONT.sm, lineHeight: 17, marginTop: 2 },
  arrow: { color: COLORS.muted, fontSize: 28, fontWeight: '300' },
});
