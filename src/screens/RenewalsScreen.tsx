import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../api/client';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Renewal { id: number; title: string; provider: string; renew_on: string | null; cost: number | null; auto_renew: boolean; }

export default function RenewalsScreen({ navigation }: any) {
  const [renewals, setRenewals]     = useState<Renewal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/renewals'); setRenewals(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Renewals</Text>
        <Text style={styles.navLink} onPress={() => navigation.navigate('Sales')}>Sales →</Text>
      </View>
      <FlatList
        data={renewals}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No renewals yet." emoji="🔄" />}
        renderItem={({ item }) => {
          const soon = item.renew_on && item.renew_on <= today;
          return (
            <View style={[styles.card, soon && styles.cardSoon]}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.title}</Text>
                {item.auto_renew && <Text style={styles.auto}>AUTO</Text>}
              </View>
              {item.provider ? <Text style={styles.meta}>{item.provider}</Text> : null}
              <View style={styles.footer}>
                {item.renew_on && <Text style={[styles.date, soon && styles.dateSoon]}>🗓 {item.renew_on}</Text>}
                {item.cost != null && <Text style={styles.cost}>${Number(item.cost).toLocaleString()}/yr</Text>}
              </View>
            </View>
          );
        }}
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
  cardSoon:  { borderLeftWidth: 4, borderLeftColor: COLORS.yellow },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title:     { flex: 1, fontSize: FONT.md, fontWeight: '700', color: COLORS.text },
  auto:      { fontSize: 10, fontWeight: '800', color: COLORS.blue, backgroundColor: COLORS.blue + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  meta:      { fontSize: FONT.sm, color: COLORS.muted, marginBottom: 8 },
  footer:    { flexDirection: 'row', justifyContent: 'space-between' },
  date:      { fontSize: FONT.sm, color: COLORS.muted },
  dateSoon:  { color: COLORS.red, fontWeight: '600' },
  cost:      { fontSize: FONT.sm, fontWeight: '600', color: COLORS.green },
});
