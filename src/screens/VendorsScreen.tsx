import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import client from '../api/client';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Vendor { id: number; name: string; category: string; email: string; contract_end: string | null; rating: number | null; }

export default function VendorsScreen() {
  const [vendors, setVendors]       = useState<Vendor[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/vendors'); setVendors(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={vendors}
        keyExtractor={(v) => String(v.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No vendors yet." emoji="🏢" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.row}>
              {item.category ? <Text style={styles.tag}>{item.category}</Text> : null}
              {item.rating   ? <Text style={styles.tag}>★ {item.rating}</Text> : null}
            </View>
            {item.email       ? <Text style={styles.meta}>{item.email}</Text>                     : null}
            {item.contract_end ? <Text style={styles.meta}>Contract ends {item.contract_end}</Text> : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 12, flexGrow: 1 },
  card: { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  name: { fontSize: FONT.md, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  row:  { flexDirection: 'row', gap: 8, marginBottom: 4 },
  tag:  { fontSize: FONT.sm, color: COLORS.blue, backgroundColor: COLORS.blue + '15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  meta: { fontSize: FONT.sm, color: COLORS.muted, marginTop: 2 },
});
