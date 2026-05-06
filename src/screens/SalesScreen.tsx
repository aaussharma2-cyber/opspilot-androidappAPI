import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import client from '../api/client';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Sale { id: number; order_ref: string; customer_name: string; order_date: string | null; channel: string; revenue: number; cost: number; }

export default function SalesScreen() {
  const [sales, setSales]           = useState<Sale[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/sales'); setSales(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalRevenue = sales.reduce((s, i) => s + Number(i.revenue), 0);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Sales</Text>
          {sales.length > 0 && <Text style={styles.total}>Total: ${totalRevenue.toLocaleString()}</Text>}
        </View>
      </View>
      <FlatList
        data={sales}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No sales yet." emoji="💰" />}
        renderItem={({ item }) => {
          const margin = item.revenue ? Math.round(((item.revenue - item.cost) / item.revenue) * 100) : 0;
          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.ref}>{item.order_ref}</Text>
                  <Text style={styles.customer}>{item.customer_name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.revenue}>${Number(item.revenue).toLocaleString()}</Text>
                  <Text style={styles.margin}>{margin}% margin</Text>
                </View>
              </View>
              <Text style={styles.meta}>{[item.channel, item.order_date].filter(Boolean).join(' · ')}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: COLORS.bg },
  headerRow: { padding: 16, paddingBottom: 8 },
  heading:   { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text },
  total:     { fontSize: FONT.sm, color: COLORS.green, fontWeight: '600', marginTop: 2 },
  list:      { padding: 12, paddingTop: 4, flexGrow: 1 },
  card:      { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  row:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  ref:       { fontSize: FONT.md, fontWeight: '700', color: COLORS.text },
  customer:  { fontSize: FONT.sm, color: COLORS.muted, marginTop: 2 },
  revenue:   { fontSize: FONT.lg, fontWeight: '800', color: COLORS.green },
  margin:    { fontSize: FONT.sm, color: COLORS.muted },
  meta:      { fontSize: FONT.sm, color: COLORS.muted },
});
