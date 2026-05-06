import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import client, { describeApiError } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import ErrorBanner from '../components/ErrorBanner';
import ModuleCard from '../components/ModuleCard';
import { COLORS, FONT, SHADOW } from '../theme';

interface Stats {
  open_tasks: number;
  overdue_invoices: number;
  upcoming_renewals: number;
  low_stock_items: number;
  unread_alerts: number;
}

const METRICS = [
  { key: 'open_tasks', label: 'Open tasks', color: COLORS.blue, hint: 'Work queue' },
  { key: 'overdue_invoices', label: 'Overdue invoices', color: COLORS.red, hint: 'Needs payment' },
  { key: 'upcoming_renewals', label: 'Renewals due', color: COLORS.yellow, hint: 'Next 30 days' },
  { key: 'low_stock_items', label: 'Low stock', color: COLORS.purple, hint: 'Below reorder' },
];

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuthStore();

  const openPortal = (title: string, path = '') => {
    navigation.navigate('More', { screen: 'Portal', params: { title, path } });
  };

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data } = await client.get('/dashboard');
      setStats(data);
    } catch (err: any) {
      setError(describeApiError(err, 'Could not load your dashboard.'));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isPlatformOnly = !user?.org;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" backgroundColor={COLORS.ink} />
      <View style={styles.topbar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>OpsPilot</Text>
          <Text style={styles.username}>{user?.username ?? 'Welcome'}</Text>
          <Text style={styles.org}>{user?.org ? `${user.org.name} · ${user.org.plan}` : 'Platform owner mode'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutTxt}>Log out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
      >
        {isPlatformOnly ? (
          <View style={styles.ownerPanel}>
            <Text style={styles.ownerTitle}>Owner cockpit</Text>
            <Text style={styles.ownerCopy}>
              Super admins manage organisations and users in the full web workspace. Native module data stays tenant-scoped.
            </Text>
            <TouchableOpacity style={styles.portalBtn} onPress={() => openPortal('Platform Admin', 'platform/admin')}>
              <Text style={styles.portalTxt}>Open platform admin</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ErrorBanner message={error} onRetry={load} />
            <Text style={styles.section}>Today</Text>
            <View style={styles.grid}>
              {METRICS.map((m) => (
                <View key={m.key} style={[styles.metricCard, { borderTopColor: m.color }]}>
                  <Text style={[styles.metricValue, { color: m.color }]}>{stats ? (stats as any)[m.key] : '-'}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                  <Text style={styles.metricHint}>{m.hint}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.section}>Fast paths</Text>
            <ModuleCard title="Full workspace" subtitle="Reports, settings, Shopify, billing and advanced actions." icon="O" onPress={() => openPortal('Full Workspace')} />
            <ModuleCard title="Billing" subtitle="Plan limits, Pro upgrade link and donation option." icon="$" accent={COLORS.green} onPress={() => openPortal('Billing', 'settings/billing')} />
            <ModuleCard title="Shopify" subtitle="Sync customers, orders, invoices and store credentials." icon="S" accent={COLORS.teal} onPress={() => openPortal('Shopify', 'settings/integrations/shopify')} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.ink },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingTop: 14 },
  kicker: { color: COLORS.teal, fontSize: FONT.xs, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  username: { color: '#fff', fontSize: FONT.xxl, fontWeight: '900', marginTop: 2 },
  org: { color: 'rgba(255,255,255,0.68)', fontSize: FONT.sm, marginTop: 3, textTransform: 'capitalize' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  logoutTxt: { color: '#fff', fontSize: FONT.sm, fontWeight: '800' },
  scroll: { padding: 14, paddingTop: 10, backgroundColor: COLORS.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, flexGrow: 1 },
  section: { fontSize: FONT.sm, fontWeight: '900', color: COLORS.muted, marginBottom: 10, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  metricCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    width: '48%',
    borderWidth: 1,
    borderTopWidth: 4,
    borderColor: COLORS.line,
    ...SHADOW,
  },
  metricValue: { fontSize: FONT.xxl, fontWeight: '900', marginBottom: 2 },
  metricLabel: { fontSize: FONT.sm, color: COLORS.text, fontWeight: '800' },
  metricHint: { fontSize: FONT.xs, color: COLORS.muted, marginTop: 2 },
  ownerPanel: { backgroundColor: COLORS.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: COLORS.line, ...SHADOW },
  ownerTitle: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '900', marginBottom: 6 },
  ownerCopy: { color: COLORS.muted, fontSize: FONT.md, lineHeight: 21, marginBottom: 16 },
  portalBtn: { backgroundColor: COLORS.blue, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  portalTxt: { color: '#fff', fontWeight: '900', fontSize: FONT.md },
});
