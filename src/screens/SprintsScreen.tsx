import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../api/client';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Sprint { id: number; name: string; status: string; start_date: string | null; end_date: string | null; goal: string; }

export default function SprintsScreen() {
  const [sprints, setSprints]       = useState<Sprint[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/sprints'); setSprints(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={sprints}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No sprints yet." emoji="🏃" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Badge label={item.status} />
            </View>
            {item.goal ? <Text style={styles.goal} numberOfLines={2}>{item.goal}</Text> : null}
            {(item.start_date || item.end_date) && (
              <Text style={styles.dates}>
                {item.start_date ?? '?'} → {item.end_date ?? '?'}
              </Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: COLORS.bg },
  list:  { padding: 12, flexGrow: 1 },
  card:  { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  name:  { flex: 1, fontSize: FONT.md, fontWeight: '700', color: COLORS.text, marginRight: 8 },
  goal:  { fontSize: FONT.sm, color: COLORS.muted, marginBottom: 6 },
  dates: { fontSize: FONT.sm, color: COLORS.blue },
});
