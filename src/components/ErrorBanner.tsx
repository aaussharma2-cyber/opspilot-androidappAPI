import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT } from '../theme';

interface Props {
  message: string | null;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  if (!message) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.btn}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.red}44`,
    backgroundColor: `${COLORS.red}10`,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: { flex: 1, color: COLORS.red, fontSize: FONT.sm, lineHeight: 18, fontWeight: '600' },
  btn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: COLORS.red },
  btnText: { color: '#fff', fontSize: FONT.sm, fontWeight: '800' },
});
