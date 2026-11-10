import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { getErrorMessage } from '@/src/api/customFetch';
import GoldButton from '@/src/components/GoldButton';
import { COLORS, SPACING, RADIUS } from '@/src/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(getErrorMessage(e, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.emoji}>💰</Text>
        <Text style={styles.title}>BUM TO BOSS</Text>
        <Text style={styles.subtitle}>Build Your Empire</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Password"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <GoldButton title="Login" onPress={handleLogin} loading={loading} disabled={!email || !password} />
        </View>

        <Link href="/auth/signup" style={styles.link}>
          Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  emoji: { fontSize: 64, marginBottom: SPACING.sm },
  title: { fontSize: 36, fontWeight: '900', color: COLORS.gold, marginBottom: SPACING.xs },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  card: { width: '100%', maxWidth: 400, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.cardBorder },
  input: { backgroundColor: COLORS.bgDeep, color: COLORS.white, borderRadius: RADIUS.sm, padding: 14, fontSize: 16, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder },
  error: { color: COLORS.red, fontSize: 14, marginBottom: SPACING.sm, textAlign: 'center' },
  link: { color: COLORS.textSecondary, marginTop: SPACING.lg, fontSize: 14 },
  linkBold: { color: COLORS.gold, fontWeight: '700' },
});
