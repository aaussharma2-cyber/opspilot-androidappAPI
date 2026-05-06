import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../api/client';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Alert { id: number; severity: string; title: string; detail: string; is_read: boolean; created_at: string; }

export default function NotificationsScreen() {
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/notifications'); setAlerts(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: number) => {
    try { await client.post(`/notifications/${id}/read`); load(); } catch {}
  };

  const readAll = async () => {
    try { await client.post('/notifications/read_all'); load(); } catch {}
  };

  const unread = alerts.filter((a) => !a.is_read).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Alerts {unread > 0 ? `(${unread})` : ''}</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={readAll}>
            <Text style={styles.readAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={alerts}
        keyExtractor={(a) => String(a.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No alerts." emoji="🔔" />}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, !item.is_read && styles.cardUnread]} onPress={() => !item.is_read && markRead(item.id)} activeOpacity={0.8}>
            <View style={styles.row}>
              <Badge label={item.severity} />
              {!item.is_read && <View style={styles.dot} />}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            {item.detail ? <Text style={styles.detail} numberOfLines={3}>{item.detail}</Text> : null}
            <Text style={styles.time}>{item.created_at?.slice(0, 10)}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: COLORS.bg },
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  heading:     { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text },
  readAll:     { fontSize: FONT.sm, color: COLORS.blue, fontWeight: '600' },
  list:        { padding: 12, paddingTop: 4, flexGrow: 1 },
  card:        { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  cardUnread:  { borderLeftWidth: 4, borderLeftColor: COLORS.blue },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.blue },
  title:       { fontSize: FONT.md, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  detail:      { fontSize: FONT.sm, color: COLORS.muted, lineHeight: 18, marginBottom: 6 },
  time:        { fontSize: 11, color: COLORS.muted },
});
