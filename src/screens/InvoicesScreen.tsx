import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, FlatList, Modal, RefreshControl, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import client from '../api/client';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Invoice { id: number; reference: string; kind: string; party_name: string; amount: number; status: string; due_date: string | null; }

const STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue'];
const KINDS    = ['sales', 'purchase'];

export default function InvoicesScreen({ navigation }: any) {
  const [invoices, setInvoices]     = useState<Invoice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal]           = useState(false);
  const [reference, setReference]   = useState('');
  const [party, setParty]           = useState('');
  const [amount, setAmount]         = useState('');
  const [kind, setKind]             = useState('sales');
  const [status, setStatus]         = useState('Draft');
  const [dueDate, setDueDate]       = useState('');
  const [saving, setSaving]         = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/invoices'); setInvoices(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markPaid = async (id: number) => {
    try { await client.post(`/invoices/${id}/mark_paid`); load(); } catch {}
  };

  const save = async () => {
    if (!reference.trim() || !party.trim() || !amount) return;
    setSaving(true);
    try {
      await client.post('/invoices', { reference, party_name: party, amount: parseFloat(amount), kind, status, due_date: dueDate || null });
      setModal(false); setReference(''); setParty(''); setAmount(''); setDueDate('');
      load();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error ?? 'Could not create invoice.');
    }
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Invoices</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Renewals')}>
            <Text style={styles.linkBtnTxt}>Renewals →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
            <Text style={styles.fabTxt}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No invoices yet." emoji="🧾" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.ref}>{item.reference}</Text>
                <Text style={styles.party}>{item.party_name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={styles.amount}>${Number(item.amount).toLocaleString()}</Text>
                <Badge label={item.status} />
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.meta}>{item.kind} · {item.due_date ? `Due ${item.due_date}` : 'No due date'}</Text>
              {item.status !== 'Paid' && (
                <TouchableOpacity style={styles.paidBtn} onPress={() => markPaid(item.id)}>
                  <Text style={styles.paidTxt}>Mark Paid</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Invoice</Text>
            <TouchableOpacity onPress={() => setModal(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Reference *</Text>
            <TextInput style={styles.input} value={reference} onChangeText={setReference} placeholder="INV-001" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Party *</Text>
            <TextInput style={styles.input} value={party} onChangeText={setParty} placeholder="Customer / supplier name" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Amount *</Text>
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} placeholder="2026-06-30" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Type</Text>
            <View style={styles.pills}>
              {KINDS.map((k) => (
                <TouchableOpacity key={k} style={[styles.pill, kind === k && styles.pillActive]} onPress={() => setKind(k)}>
                  <Text style={[styles.pillTxt, kind === k && styles.pillTxtActive]}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pills}>
              {STATUSES.map((s) => (
                <TouchableOpacity key={s} style={[styles.pill, status === s && styles.pillActive]} onPress={() => setStatus(s)}>
                  <Text style={[styles.pillTxt, status === s && styles.pillTxtActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
              <Text style={styles.saveTxt}>{saving ? 'Saving…' : 'Create Invoice'}</Text>
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
  row:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ref:        { fontSize: FONT.md, fontWeight: '700', color: COLORS.text },
  party:      { fontSize: FONT.sm, color: COLORS.muted, marginTop: 2 },
  amount:     { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text },
  footer:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta:       { fontSize: FONT.sm, color: COLORS.muted, textTransform: 'capitalize' },
  paidBtn:    { backgroundColor: COLORS.green + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: COLORS.green },
  paidTxt:    { fontSize: FONT.sm, color: COLORS.green, fontWeight: '600' },
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
