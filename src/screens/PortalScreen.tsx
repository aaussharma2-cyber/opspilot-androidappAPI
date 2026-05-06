import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { webUrl } from '../../config';
import { COLORS, FONT } from '../theme';

export default function PortalScreen({ route, navigation }: any) {
  const path = route?.params?.path ?? '';
  const title = route?.params?.title ?? 'Workspace';
  const startUrl = useMemo(() => webUrl(path), [path]);
  const webRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => (canGoBack ? webRef.current?.goBack() : navigation.goBack())}
          style={styles.iconBtn}
        >
          <Text style={styles.iconText}>{canGoBack ? '‹' : '×'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.url} numberOfLines={1}>{startUrl}</Text>
        </View>
        <TouchableOpacity onPress={() => webRef.current?.reload()} style={styles.smallBtn}>
          <Text style={styles.smallTxt}>Reload</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.blue} />
        </View>
      )}

      <WebView
        ref={webRef}
        source={{ uri: startUrl }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsBackForwardNavigationGestures
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
        onShouldStartLoadWithRequest={(request) => {
          const isOpsPilot = request.url.startsWith(webUrl());
          if (!isOpsPilot) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        renderError={() => (
          <View style={styles.error}>
            <Text style={styles.errorTitle}>Could not load OpsPilot</Text>
            <Text style={styles.errorText}>Check your connection or backend URL, then reload.</Text>
            <TouchableOpacity onPress={() => webRef.current?.reload()} style={styles.retry}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  bar: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: COLORS.card,
  },
  iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
  iconText: { color: COLORS.text, fontSize: 26, lineHeight: 28, fontWeight: '500' },
  title: { color: COLORS.text, fontSize: FONT.md, fontWeight: '900' },
  url: { color: COLORS.muted, fontSize: FONT.xs, marginTop: 1 },
  smallBtn: { backgroundColor: `${COLORS.blue}12`, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  smallTxt: { color: COLORS.blue, fontSize: FONT.sm, fontWeight: '800' },
  loading: { position: 'absolute', top: 70, left: 0, right: 0, zIndex: 2, alignItems: 'center' },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorTitle: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '900', marginBottom: 6 },
  errorText: { color: COLORS.muted, textAlign: 'center', marginBottom: 18 },
  retry: { backgroundColor: COLORS.blue, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '900' },
});
