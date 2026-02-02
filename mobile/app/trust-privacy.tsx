import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Switch,
    ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Shield, Lock, VenetianMask as Mask, Check } from 'lucide-react-native';

export default function TrustPrivacyScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [communityContribution, setCommunityContribution] = useState(true);
    const [personalMsg, setPersonalMsg] = useState(true);

    const handleGetStarted = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/(tabs)');
            // In a real app we might reset navigation stack here to prevent going back to setup
            // router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#2dd4bf" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trust & Privacy</Text>
                <View style={styles.headerSpace} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                </View>

                <View style={styles.headingSection}>
                    <View style={styles.iconBadge}>
                        <Shield size={40} color="#2dd4bf" />
                    </View>
                    <Text style={styles.heading}>Your Data, Your Control</Text>
                    <Text style={styles.subheading}>Finalizing your privacy settings for a secure health intelligence experience.</Text>
                </View>

                {/* Privacy Shield Card */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <Shield size={20} color="#2dd4bf" />
                        <Text style={styles.cardTitle}>Privacy Shield</Text>
                    </View>

                    <Text style={styles.cardDescription}>
                        We use advanced <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>differential privacy</Text> to anonymize your data. Your identity is stripped before contributing to community health trends, ensuring your personal signals remain encrypted and private.
                    </Text>

                    <View style={styles.securityFeatures}>
                        <View style={styles.featureItem}>
                            <Lock size={14} color="#2dd4bf" />
                            <Text style={styles.featureText}>Military-grade AES-256 encryption at rest</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Mask size={14} color="#2dd4bf" />
                            <Text style={styles.featureText}>Automatic PII (Personally Identifiable Info) removal</Text>
                        </View>
                    </View>
                </View>

                {/* Toggles Group */}
                <View style={styles.togglesContainer}>
                    {/* Toggle 1 */}
                    <View style={styles.toggleCard}>
                        <View style={styles.toggleTextContainer}>
                            <Text style={styles.toggleTitle}>Anonymized Community Contribution</Text>
                            <Text style={styles.toggleSubtitle}>Help build community health trends without exposing your identity.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#2dd4bf" }}
                            thumbColor={communityContribution ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setCommunityContribution(prev => !prev)}
                            value={communityContribution}
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} // Adjust size if needed
                        />
                    </View>

                    {/* Toggle 2 */}
                    <View style={styles.toggleCard}>
                        <View style={styles.toggleTextContainer}>
                            <Text style={styles.toggleTitle}>Personal AI Signal Processing</Text>
                            <Text style={styles.toggleSubtitle}>Enable AI to analyze your symptoms and lifestyle drift patterns.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#2dd4bf" }}
                            thumbColor={personalMsg ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setPersonalMsg(prev => !prev)}
                            value={personalMsg}
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                        />
                    </View>
                </View>

                <View style={styles.spacer} />

                {/* Bottom Actions */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.continueButton, loading && styles.continueButtonDisabled]}
                        onPress={handleGetStarted}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0a141d" size="small" />
                        ) : (
                            <Text style={styles.continueButtonText}>Get Started</Text>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.disclaimer}>
                        By clicking 'Get Started', you confirm your consent to our Privacy Policy and Terms of Service.
                    </Text>
                </View>

                <View style={styles.bottomPadding} />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a141d', // navy-dark
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#0a141d',
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSpace: {
        width: 48,
    },
    scrollContent: {
        paddingHorizontal: 24,
        flexGrow: 1,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 24,
    },
    progressDot: {
        flex: 1,
        height: 6,
        borderRadius: 9999,
        backgroundColor: '#2dd4bf', // Teal accent
    },
    progressDotActive: {
        backgroundColor: '#2dd4bf',
    },
    headingSection: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 24,
    },
    iconBadge: {
        width: 64, // slightly larger visual
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(45, 212, 191, 0.1)', // teal/10
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 32,
        letterSpacing: -0.5,
    },
    subheading: {
        fontSize: 16,
        fontWeight: '400',
        color: '#9db4b9',
        textAlign: 'center',
        lineHeight: 24,
    },
    cardContainer: {
        backgroundColor: '#14222b', // navy-surface
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    cardDescription: {
        color: '#9db4b9',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
    },
    securityFeatures: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(10, 20, 29, 0.4)', // navy-dark/40
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderRadius: 12,
    },
    featureText: {
        fontSize: 12,
        color: '#9db4b9',
        flex: 1,
    },
    togglesContainer: {
        gap: 16,
        marginBottom: 32,
    },
    toggleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#14222b', // navy-surface
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
    },
    toggleTextContainer: {
        flex: 1,
        paddingRight: 16,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: '#9db4b9',
        lineHeight: 16,
    },
    spacer: {
        flex: 1,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 16,
    },
    continueButton: {
        width: '100%',
        backgroundColor: '#2dd4bf', // Teal accent
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2dd4bf',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    continueButtonDisabled: {
        opacity: 0.7,
    },
    continueButtonText: {
        color: '#0a141d', // navy-dark
        fontSize: 18,
        fontWeight: '700',
    },
    disclaimer: {
        textAlign: 'center',
        color: '#5e7e85',
        fontSize: 10,
        lineHeight: 14,
        paddingHorizontal: 16,
    },
    bottomPadding: {
        height: 32,
    }
});
