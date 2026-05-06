import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import client from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS, FONT } from '../theme';

interface Stats {
  open_tasks: number; overdue_invoices: number;
  upcoming_renewals: number; low_stock_items: number; unread_alerts: number;
}

const METRICS = [
  { key: 'open_tasks',        label: 'Open Tasks',       color: COLORS.blue,   emoji: '✅' },
  { key: 'overdue_invoices',  label: 'Overdue Invoices', color: COLORS.red,    emoji: '🧾' },
  { key: 'upcoming_renewals', label: 'Due in 30 Days',   color: COLORS.yellow, emoji: '🔄' },
  { key: 'low_stock_items',   label: 'Low Stock',        color: COLORS.purple, emoji: '📦' },
];

export default function DashboardScreen() {
  const [stats, setStats]         = useState<Stats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout }          = useAuthStore();

  const load = useCallback(async () => {
    try {
      const { data } = await client.get('/dashboard');
      setStats(data);
    } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" backgroundColor={COLORS.blue} />
      <View style={styles.topbar}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.username}>{user?.username ?? '—'}</Text>
          {user?.org && <Text style={styles.org}>{user.org.name} · {user.org.plan}</Text>}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutTxt}>Log out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#fff" />}
      >
        <Text style={styles.section}>Overview</Text>
        <View style={styles.grid}>
          {METRICS.map((m) => (
            <View key={m.key} style={[styles.card, { borderLeftColor: m.color }]}>
              <Text style={styles.cardEmoji}>{m.emoji}</Text>
              <Text style={[styles.cardValue, { color: m.color }]}>
                {stats ? (stats as any)[m.key] : '—'}
              </Text>
              <Text style={styles.cardLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.blue },
  topbar:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingTop: 12 },
  welcome:    { color: 'rgba(255,255,255,0.75)', fontSize: FONT.sm },
  username:   { color: '#fff', fontSize: FONT.xl, fontWeight: '800' },
  org:        { color: 'rgba(255,255,255,0.65)', fontSize: FONT.sm, marginTop: 2, textTransform: 'capitalize' },
  logoutBtn:  { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  logoutTxt:  { color: '#fff', fontSize: FONT.sm, fontWeight: '600' },
  scroll:     { padding: 16, paddingTop: 8, backgroundColor: COLORS.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, flexGrow: 1 },
  section:    { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:       { backgroundColor: COLORS.card, borderRadius: 10, padding: 16, width: '47%', borderLeftWidth: 4, borderWidth: 1, borderColor: COLORS.line },
  cardEmoji:  { fontSize: 22, marginBottom: 8 },
  cardValue:  { fontSize: FONT.xxl, fontWeight: '800', marginBottom: 4 },
  cardLabel:  { fontSize: FONT.sm, color: COLORS.muted },
});
