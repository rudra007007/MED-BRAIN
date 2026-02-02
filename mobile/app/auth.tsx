import React, { useState } from 'react';
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

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      setLoading(false);
      // Navigate back to home after sign in
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🛡️</Text>
            </View>
            <Text style={styles.logoLabel}>Health Intelligence</Text>
          </View>

          <Text style={styles.title}>Your Health Intelligence, Secured.</Text>
          <Text style={styles.subtitle}>Access personalized insights and community trends.</Text>
        </View>

        <View style={styles.authSection}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonIcon}>🍎</Text>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonIcon}>G</Text>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity disabled={loading}>
                  <Text style={styles.forgotButton}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.signInButton, loading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#101f22" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')} disabled={loading}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.privacyContainer}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View>
            <Text style={styles.privacyTitle}>Privacy Commitment</Text>
            <Text style={styles.privacyText}>
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
    backgroundColor: '#101f22'
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
    backgroundColor: 'rgba(19, 200, 236, 0.1)',
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
    color: '#FFFFFF'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40
  },
  subtitle: {
    fontSize: 14,
    color: '#9db4b9',
    textAlign: 'center',
    lineHeight: 20
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
    backgroundColor: '#1a2b2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12
  },
  socialButtonIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: '600'
  },
  socialButtonText: {
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  dividerText: {
    color: '#9db4b9',
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
    color: '#9db4b9',
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
    backgroundColor: 'rgba(26, 43, 46, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
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
    color: '#e2e8f0',
    fontWeight: '500'
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#13c8ec'
  },
  privacyContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#FFFFFF',
    marginBottom: 4
  },
  privacyText: {
    fontSize: 12,
    color: '#9db4b9',
    lineHeight: 18
  },
  learnMoreLink: {
    color: 'rgba(19, 200, 236, 0.8)',
    textDecorationLine: 'underline'
  }
});
