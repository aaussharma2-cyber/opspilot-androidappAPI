import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import client from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS, FONT } from '../theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Required', 'Please enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.post('/auth/login', { username: username.trim(), password });
      await login(data.token, data.user);
    } catch (err: any) {
      Alert.alert('Login failed', err.response?.data?.error ?? 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" backgroundColor={COLORS.blue} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>⚡</Text>
          <Text style={styles.appName}>OpsPilot</Text>
          <Text style={styles.tagline}>Operations — simplified</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername}
            autoCapitalize="none" autoCorrect={false} returnKeyType="next"
            placeholder="Enter username" placeholderTextColor={COLORS.muted} />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword}
            secureTextEntry returnKeyType="done" onSubmitEditing={handleLogin}
            placeholder="Enter password" placeholderTextColor={COLORS.muted} />
          <TouchableOpacity style={[styles.btn, loading && styles.btnOff]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Sign in</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: COLORS.blue },
  scroll:  { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header:  { alignItems: 'center', marginBottom: 36 },
  logo:    { fontSize: 60 },
  appName: { fontSize: 32, fontWeight: '800', color: '#fff', marginTop: 8 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  form:    { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  label:   { fontSize: FONT.sm, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 14 },
  input:   { borderWidth: 1, borderColor: COLORS.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: FONT.md, color: COLORS.text, backgroundColor: COLORS.bg },
  btn:     { backgroundColor: COLORS.blue, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 22 },
  btnOff:  { opacity: 0.6 },
  btnTxt:  { color: '#fff', fontWeight: '700', fontSize: FONT.lg },
});
