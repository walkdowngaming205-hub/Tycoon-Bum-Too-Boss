import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING } from '@/src/constants/theme';

interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>🚨</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.msg}>{this.state.error?.message ?? 'Unknown error'}</Text>
          <Pressable onPress={() => this.setState({ hasError: false })} style={styles.btn}>
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  emoji: { fontSize: 64, marginBottom: SPACING.md },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.white, marginBottom: SPACING.sm },
  msg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md },
  btn: { backgroundColor: COLORS.gold, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
