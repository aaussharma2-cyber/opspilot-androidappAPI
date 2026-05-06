import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import ModuleCard from '../components/ModuleCard';
import { COLORS, FONT } from '../theme';

export default function MoreScreen({ navigation }: any) {
  const openPortal = (title: string, path = '') => navigation.navigate('Portal', { title, path });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>OpsPilot Mobile</Text>
          <Text style={styles.title}>Every module, compact.</Text>
          <Text style={styles.copy}>
            Native quick views for daily work, plus the full web workspace for reports, settings, Shopify, billing, and admin.
          </Text>
        </View>

        <Text style={styles.section}>Native modules</Text>
        <ModuleCard title="Assets" subtitle="Track equipment, software, expiry and ownership." icon="A" accent={COLORS.purple} onPress={() => navigation.navigate('Assets')} />
        <ModuleCard title="Inventory" subtitle="Stock levels, reorder warnings, warehouses and costs." icon="I" accent={COLORS.teal} onPress={() => navigation.navigate('Inventory')} />
        <ModuleCard title="Alerts" subtitle="Workflow notifications, reminders and low-stock warnings." icon="!" accent={COLORS.yellow} onPress={() => navigation.navigate('Notifications')} />

        <Text style={styles.section}>Full workspace</Text>
        <ModuleCard title="Full OpsPilot" subtitle="Open the complete responsive web app inside Android." icon="O" onPress={() => openPortal('Full Workspace')} />
        <ModuleCard title="Reports" subtitle="Saved reports, charts, exports and analytics." icon="R" accent={COLORS.green} onPress={() => openPortal('Reports', 'reports')} />
        <ModuleCard title="Settings" subtitle="Themes, users, workflows, fields, branding and email." icon="S" accent={COLORS.blueDark} onPress={() => openPortal('Settings', 'settings')} />
        <ModuleCard title="Shopify" subtitle="Store credentials, sync customers, orders and invoices." icon="$" accent={COLORS.teal} onPress={() => openPortal('Shopify', 'settings/integrations/shopify')} />
        <ModuleCard title="Billing" subtitle="Plan limits, Pro payment link and donation options." icon="B" accent={COLORS.green} onPress={() => openPortal('Billing', 'settings/billing')} />
        <ModuleCard title="Platform Admin" subtitle="Owner-only org and user management cockpit." icon="*" accent={COLORS.red} onPress={() => openPortal('Platform Admin', 'platform/admin')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 14, paddingBottom: 28 },
  hero: {
    backgroundColor: COLORS.ink,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  kicker: { color: COLORS.teal, fontSize: FONT.xs, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { color: '#fff', fontSize: FONT.xxl, fontWeight: '900', marginTop: 4 },
  copy: { color: 'rgba(255,255,255,0.76)', fontSize: FONT.sm, lineHeight: 19, marginTop: 8 },
  section: { color: COLORS.muted, fontSize: FONT.xs, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8, marginTop: 6 },
});
