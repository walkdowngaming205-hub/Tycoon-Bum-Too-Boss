import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { getErrorMessage } from '@/src/api/customFetch';
import GoldButton from '@/src/components/GoldButton';
import { COLORS, SPACING, RADIUS } from '@/src/constants/theme';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signup(email.trim(), password, playerName.trim());
    } catch (e) {
      setError(getErrorMessage(e, 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>💰 BUM TO BOSS</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Player Name"
            placeholderTextColor={COLORS.textMuted}
            value={playerName}
            onChangeText={setPlayerName}
            accessibilityLabel="Player Name"
          />
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
            placeholder="Password (min 6 chars)"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Password"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <GoldButton title="Start Your Empire" onPress={handleSignup} loading={loading} disabled={!email || !password || !playerName} />
        </View>
        <Link href="/auth/login" style={styles.link}>
          Already have an account? <Text style={styles.linkBold}>Login</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.gold, marginBottom: SPACING.xl },
  card: { width: '100%', maxWidth: 400, backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.cardBorder },
  input: { backgroundColor: COLORS.bgDeep, color: COLORS.white, borderRadius: RADIUS.sm, padding: 14, fontSize: 16, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder },
  error: { color: COLORS.red, fontSize: 14, marginBottom: SPACING.sm, textAlign: 'center' },
  link: { color: COLORS.textSecondary, marginTop: SPACING.lg, fontSize: 14 },
  linkBold: { color: COLORS.gold, fontWeight: '700' },
});
