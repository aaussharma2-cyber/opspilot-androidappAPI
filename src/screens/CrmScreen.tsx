import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, Modal, RefreshControl, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import client from '../api/client';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { COLORS, FONT } from '../theme';

interface Contact { id: number; name: string; kind: string; stage: string; company: string; email: string; phone: string; }

const KINDS  = ['lead', 'customer', 'prospect'];
const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function CrmScreen({ navigation }: any) {
  const [contacts, setContacts]     = useState<Contact[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal]           = useState(false);
  const [name, setName]             = useState('');
  const [kind, setKind]             = useState('lead');
  const [stage, setStage]           = useState('New');
  const [company, setCompany]       = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [saving, setSaving]         = useState(false);

  const load = useCallback(async () => {
    try { const { data } = await client.get('/crm'); setContacts(data); } catch {}
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await client.post('/crm', { name, kind, stage, company, email, phone });
      setModal(false); setName(''); setCompany(''); setEmail(''); setPhone('');
      load();
    } catch {}
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>CRM</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Vendors')}>
            <Text style={styles.linkBtnTxt}>Vendors →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab} onPress={() => setModal(true)}>
            <Text style={styles.fabTxt}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.blue} />}
        ListEmptyComponent={<EmptyState message="No contacts yet." emoji="👥" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.cname}>{item.name}</Text>
              <Badge label={item.kind} />
            </View>
            <View style={styles.meta}>
              {item.company ? <Text style={styles.metaTxt}>{item.company}</Text> : null}
              {item.email   ? <Text style={styles.metaTxt}>{item.email}</Text>   : null}
            </View>
            <Badge label={item.stage} />
          </View>
        )}
      />

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Contact</Text>
            <TouchableOpacity onPress={() => setModal(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Name *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Company</Text>
            <TextInput style={styles.input} value={company} onChangeText={setCompany} placeholder="Company name" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="email@example.com" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+1 555 000 0000" placeholderTextColor={COLORS.muted} />
            <Text style={styles.label}>Type</Text>
            <View style={styles.pills}>
              {KINDS.map((k) => (
                <TouchableOpacity key={k} style={[styles.pill, kind === k && styles.pillActive]} onPress={() => setKind(k)}>
                  <Text style={[styles.pillTxt, kind === k && styles.pillTxtActive]}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Stage</Text>
            <View style={styles.pills}>
              {STAGES.map((s) => (
                <TouchableOpacity key={s} style={[styles.pill, stage === s && styles.pillActive]} onPress={() => setStage(s)}>
                  <Text style={[styles.pillTxt, stage === s && styles.pillTxtActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
              <Text style={styles.saveTxt}>{saving ? 'Saving…' : 'Create Contact'}</Text>
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
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cname:      { flex: 1, fontSize: FONT.md, fontWeight: '700', color: COLORS.text, marginRight: 8 },
  meta:       { marginBottom: 8 },
  metaTxt:    { fontSize: FONT.sm, color: COLORS.muted },
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
