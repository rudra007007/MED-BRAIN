import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Shield, Info } from 'lucide-react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 8) return 1;
    if (password.match(/[a-z]/) && password.match(/[0-9]/)) return 3;
    if (password.match(/[a-z]/) || password.match(/[0-9]/)) return 2;
    return 1;
  };

  const passwordStrength = getPasswordStrength();

  const handleContinue = async () => {
    if (!email || !password || password.length < 8 || !password.match(/[0-9]/)) {
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/personalize');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#13c8ec" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Health Intelligence</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>

        <View style={styles.headingSection}>
          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subheading}>Start your AI-powered health journey today.</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9db4b9"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a secure password"
                placeholderTextColor="#9db4b9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.visibilityButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <Eye size={20} color="#9db4b9" />
                ) : (
                  <EyeOff size={20} color="#9db4b9" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.strengthContainer}>
              <View style={[styles.strengthBar, passwordStrength >= 1 && styles.strengthBarActive]} />
              <View style={[styles.strengthBar, passwordStrength >= 2 && styles.strengthBarActive]} />
              <View style={[styles.strengthBar, passwordStrength >= 3 && styles.strengthBarActive]} />
              <View style={[styles.strengthBar, passwordStrength >= 4 && styles.strengthBarActive]} />
            </View>
            <Text style={styles.strengthText}>Must be at least 8 characters with a number.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.dataProtectionButton}>
          <Shield size={20} color="#13c8ec" />
          <Text style={styles.dataProtectionText}>How we protect your data</Text>
        </TouchableOpacity>

        <View style={styles.disclaimerBox}>
          <Info size={20} color="#13c8ec" style={{ marginTop: 2 }} />
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerLabel}>Medical Disclaimer:</Text>
            <Text style={styles.disclaimerText}> This is not a medical diagnosis tool. Our AI provides insights based on patterns and trends for informational purposes only.</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading || !email || !password || password.length < 8 || !password.match(/[0-9]/)}
        >
          {loading ? (
            <ActivityIndicator color="#101f22" size="small" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()} disabled={loading}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101f22'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center'
  },
  headerSpace: {
    width: 40
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  progressDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b4f54'
  },
  progressDotActive: {
    backgroundColor: '#13c8ec'
  },
  headingSection: {
    marginBottom: 24
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 32
  },
  subheading: {
    fontSize: 16,
    color: '#9db4b9',
    lineHeight: 22
  },
  formSection: {
    gap: 16,
    marginBottom: 24
  },
  formGroup: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF'
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1c2527',
    borderWidth: 1,
    borderColor: '#3b4f54',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter'
  },
  passwordContainer: {
    position: 'relative'
  },
  passwordInput: {
    height: 56,
    paddingHorizontal: 16,
    paddingRight: 48,
    borderRadius: 12,
    backgroundColor: '#1c2527',
    borderWidth: 1,
    borderColor: '#3b4f54',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter'
  },
  visibilityButton: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4
  },
  strengthContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b4f54'
  },
  strengthBarActive: {
    backgroundColor: '#13c8ec'
  },
  strengthText: {
    fontSize: 12,
    color: '#9db4b9',
    marginTop: 8
  },
  dataProtectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24
  },
  dataProtectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#13c8ec'
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(19, 200, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 200, 236, 0.3)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24
  },
  disclaimerContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  disclaimerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e0f7fa'
  },
  disclaimerText: {
    fontSize: 14,
    color: '#e0f7fa',
    lineHeight: 20
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#13c8ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  continueButtonDisabled: {
    opacity: 0.5
  },
  continueButtonText: {
    color: '#101f22',
    fontSize: 18,
    fontWeight: '700'
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  signInText: {
    fontSize: 14,
    color: '#9db4b9'
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#13c8ec'
  },
  bottomSpacing: {
    height: 32
  }
});
