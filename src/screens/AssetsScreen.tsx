import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import client from '../api/client';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Asset { id: number; name: string; category: string; serial_number: string; status: string; purchase_cost: number | null; }

export default function AssetsScreen({ navigation }: any) {
  const [assets, setAssets]         = useState<Asset[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/assets'); setAssets(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Assets</Text>
        <Text style={styles.navLink} onPress={() => navigation.navigate('Inventory')}>Inventory →</Text>
      </View>
      <FlatList
        data={assets}
        keyExtractor={(a) => String(a.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No assets yet." emoji="🖥" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Badge label={item.status} />
            </View>
            <Text style={styles.meta}>{[item.category, item.serial_number].filter(Boolean).join(' · ')}</Text>
            {item.purchase_cost != null && <Text style={styles.cost}>${Number(item.purchase_cost).toLocaleString()}</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: COLORS.bg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  heading:   { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text },
  navLink:   { fontSize: FONT.sm, color: COLORS.blue, fontWeight: '600' },
  list:      { padding: 12, paddingTop: 4, flexGrow: 1 },
  card:      { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  name:      { flex: 1, fontSize: FONT.md, fontWeight: '700', color: COLORS.text, marginRight: 8 },
  meta:      { fontSize: FONT.sm, color: COLORS.muted, marginBottom: 4 },
  cost:      { fontSize: FONT.sm, color: COLORS.green, fontWeight: '600' },
});
