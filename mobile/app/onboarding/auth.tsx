import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Apple } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/store/auth.store';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Zustand store
  const { login, isLoading, error, isAuthenticated, clearError, checkAuth } = useAuthStore();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'backgroundCard');
  const borderColor = useThemeColor({}, 'border');
  const inputBg = useThemeColor({}, 'backgroundAccent');
  const logoBg = 'rgba(19, 200, 236, 0.1)';

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Navigate if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleSignIn = async () => {
    if (!email || !password) return;

    try {
      await login(email, password);
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: logoBg }]}>
              <Text style={styles.logoText}>🛡️</Text>
            </View>
            <Text style={[styles.logoLabel, { color: textColor }]}>Health Intelligence</Text>
          </View>

          <Text style={[styles.title, { color: textColor }]}>Your Health Intelligence, Secured.</Text>
          <Text style={[styles.subtitle, { color: subTextColor }]}>Access personalized insights and community trends.</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.authSection}>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: cardColor, borderColor }]}>
            <Apple size={20} color={textColor} style={{ marginRight: 12 }} />
            <Text style={[styles.socialButtonText, { color: textColor }]}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, { backgroundColor: cardColor, borderColor }]}>
            <Text style={[styles.socialButtonIcon, { color: textColor }]}>G</Text>
            <Text style={[styles.socialButtonText, { color: textColor }]}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
            <Text style={[styles.dividerText, { color: subTextColor }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: subTextColor }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                placeholder="name@example.com"
                placeholderTextColor={subTextColor}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelContainer}>
                <Text style={[styles.inputLabel, { color: subTextColor }]}>Password</Text>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.forgotButton}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                placeholder="••••••••"
                placeholderTextColor={subTextColor}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError();
                }}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#101f22" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: subTextColor }]}>{'Don\'t have an account? '}</Text>
              <TouchableOpacity onPress={() => router.push('/onboarding/signup')} disabled={isLoading}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.privacyContainer, { backgroundColor: cardColor, borderColor }]}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.privacyTitle, { color: textColor }]}>Privacy Commitment</Text>
            <Text style={[styles.privacyText, { color: subTextColor }]}>
              Your health data is end-to-end encrypted and fully anonymized. We never sell your personal information to third parties.{' '}
              <Text style={styles.learnMoreLink}>Learn more</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  logoText: {
    fontSize: 32
  },
  logoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14
  },
  authSection: {
    marginBottom: 40
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12
  },
  socialButtonIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: '600'
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 16,
    textTransform: 'uppercase'
  },
  formSection: {
    gap: 16
  },
  inputGroup: {
    gap: 8
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  passwordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter'
  },
  forgotButton: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(19, 200, 236, 0.8)'
  },
  signInButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#13c8ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  signInButtonDisabled: {
    opacity: 0.7
  },
  signInButtonText: {
    color: '#101f22',
    fontSize: 16,
    fontWeight: '700'
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '500'
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#13c8ec'
  },
  privacyContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 16,
    marginTop: 40,
    marginBottom: 40
  },
  privacyIcon: {
    fontSize: 24,
    marginTop: 2
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18
  },
  learnMoreLink: {
    color: 'rgba(19, 200, 236, 0.8)',
    textDecorationLine: 'underline'
  }
});
