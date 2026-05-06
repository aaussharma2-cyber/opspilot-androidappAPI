import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, Modal, RefreshControl, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import client from '../api/client';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Task { id: number; title: string; status: string; priority: string; due_date: string | null; owner: string; }

const STATUSES  = ['Backlog', 'In Progress', 'Blocked', 'Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function TasksScreen({ navigation }: any) {
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal]         = useState(false);
  const [title, setTitle]         = useState('');
  const [status, setStatus]       = useState('Backlog');
  const [priority, setPriority]   = useState('Medium');
  const [owner, setOwner]         = useState('');
  const [saving, setSaving]       = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/tasks'); setTasks(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await client.post('/tasks', { title, status, priority, owner });
      setModal(false); setTitle(''); setOwner('');
      load();
    } catch {}
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Tasks</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Sprints')}>
            <Text style={styles.linkBtnTxt}>Sprints →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
            <Text style={styles.fabTxt}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No tasks yet. Tap + New to create one." emoji="✅" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.taskTitle} numberOfLines={2}>{item.title}</Text>
              <Badge label={item.status} />
            </View>
            <View style={styles.cardMeta}>
              <Badge label={item.priority} />
              {item.owner ? <Text style={styles.meta}> · {item.owner}</Text> : null}
              {item.due_date ? <Text style={styles.meta}> · Due {item.due_date}</Text> : null}
            </View>
          </View>
        )}
      />

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={() => setModal(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Task title" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Owner</Text>
            <TextInput style={styles.input} value={owner} onChangeText={setOwner} placeholder="Assigned to" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Status</Text>
            <View style={styles.pills}>
              {STATUSES.map((s) => (
                <TouchableOpacity key={s} style={[styles.pill, status === s && styles.pillActive]} onPress={() => setStatus(s)}>
                  <Text style={[styles.pillTxt, status === s && styles.pillTxtActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pills}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity key={p} style={[styles.pill, priority === p && styles.pillActive]} onPress={() => setPriority(p)}>
                  <Text style={[styles.pillTxt, priority === p && styles.pillTxtActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
              <Text style={styles.saveTxt}>{saving ? 'Saving…' : 'Create Task'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.bg },
  headerRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  heading:    { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text },
  headerBtns: { flexDirection: 'row', gap: 8 },
  linkBtn:    { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line },
  linkBtnTxt: { color: COLORS.blue, fontSize: FONT.sm, fontWeight: '600' },
  fab:        { backgroundColor: COLORS.blue, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  fabTxt:     { color: '#fff', fontWeight: '700', fontSize: FONT.sm },
  list:       { padding: 12, paddingTop: 4, flexGrow: 1 },
  card:       { backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.line },
  cardRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  taskTitle:  { flex: 1, fontSize: FONT.md, fontWeight: '600', color: COLORS.text },
  cardMeta:   { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  meta:       { fontSize: FONT.sm, color: COLORS.muted },
  modal:      { flex: 1, backgroundColor: COLORS.bg },
  modalHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.line, backgroundColor: COLORS.card },
  modalTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text },
  cancel:     { fontSize: FONT.md, color: COLORS.blue },
  modalBody:  { padding: 16 },
  label:      { fontSize: FONT.sm, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 14 },
  input:      { borderWidth: 1, borderColor: COLORS.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: FONT.md, color: COLORS.text, backgroundColor: COLORS.card },
  pills:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill:       { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.card },
  pillActive: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  pillTxt:    { fontSize: FONT.sm, color: COLORS.text, fontWeight: '500' },
  pillTxtActive: { color: '#fff', fontWeight: '700' },
  saveBtn:    { backgroundColor: COLORS.blue, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24, marginBottom: 32 },
  saveTxt:    { color: '#fff', fontWeight: '700', fontSize: FONT.lg },
});
