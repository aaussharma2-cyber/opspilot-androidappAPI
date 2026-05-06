import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import client from '../api/client';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface InventoryItem { id: number; name: string; sku: string; qty_on_hand: number; reorder_level: number; unit_cost: number | null; }

export default function InventoryScreen() {
  const [items, setItems]           = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/inventory'); setItems(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No inventory items yet." emoji="📦" />}
        renderItem={({ item }) => {
          const low = item.qty_on_hand <= item.reorder_level;
          return (
            <View style={[styles.card, low && styles.cardLow]}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={[styles.qty, low && styles.qtyLow]}>{item.qty_on_hand} in stock</Text>
              </View>
              <Text style={styles.sku}>{item.sku}</Text>
              {low && <Text style={styles.alert}>⚠ Below reorder level ({item.reorder_level})</Text>}
              {item.unit_cost != null && <Text style={styles.cost}>Unit cost ${Number(item.unit_cost).toFixed(2)}</Text>}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: COLORS.bg },
  list:    { padding: 12, flexGrow: 1 },
  card:    { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  cardLow: { borderLeftWidth: 4, borderLeftColor: COLORS.red },
  row:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name:    { flex: 1, fontSize: FONT.md, fontWeight: '700', color: COLORS.text },
  qty:     { fontSize: FONT.md, fontWeight: '700', color: COLORS.green },
  qtyLow:  { color: COLORS.red },
  sku:     { fontSize: FONT.sm, color: COLORS.muted, marginBottom: 4 },
  alert:   { fontSize: FONT.sm, color: COLORS.red, fontWeight: '600', marginBottom: 4 },
  cost:    { fontSize: FONT.sm, color: COLORS.muted },
});
