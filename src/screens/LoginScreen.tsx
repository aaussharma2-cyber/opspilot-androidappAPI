import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Linking, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import client, { describeApiError } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS, FONT, SHADOW } from '../theme';
import { cleanBaseUrl, webUrl } from '../../config';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      Alert.alert('Login failed', describeApiError(err, 'Check your credentials and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" backgroundColor={COLORS.ink} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logoMark}><Text style={styles.logoText}>O</Text></View>
          <Text style={styles.appName}>OpsPilot</Text>
          <Text style={styles.tagline}>Compact control room for operations, finance and fulfilment.</Text>
          <Text style={styles.server}>{cleanBaseUrl()}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign in</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            placeholder="Enter username"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            placeholder="Enter password"
            placeholderTextColor={COLORS.muted}
          />
          <TouchableOpacity style={[styles.btn, loading && styles.btnOff]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTxt}>Sign in</Text>}
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <TouchableOpacity onPress={() => Linking.openURL(webUrl('forgot-password'))}>
              <Text style={styles.link}>Forgot password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(webUrl('signup'))}>
              <Text style={styles.link}>Create workspace</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.ink },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  hero: { alignItems: 'center', marginBottom: 28 },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
    marginBottom: 14,
  },
  logoText: { color: '#fff', fontSize: 36, fontWeight: '900' },
  appName: { fontSize: 34, fontWeight: '900', color: '#fff' },
  tagline: { fontSize: FONT.md, color: 'rgba(255,255,255,0.75)', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  server: { color: COLORS.teal, fontSize: FONT.xs, marginTop: 12, fontWeight: '800' },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 22, ...SHADOW },
  formTitle: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '900', marginBottom: 4 },
  label: { fontSize: FONT.sm, fontWeight: '800', color: COLORS.text, marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: FONT.md,
    color: COLORS.text,
    backgroundColor: COLORS.bg,
  },
  btn: { backgroundColor: COLORS.blue, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 22 },
  btnOff: { opacity: 0.65 },
  btnTxt: { color: '#fff', fontWeight: '900', fontSize: FONT.lg },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  link: { color: COLORS.blue, fontWeight: '800', fontSize: FONT.sm },
});
