import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
    const router = useRouter();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const textFadeAnim = useRef(new Animated.Value(0)).current;
    const textTranslateAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Cinematic Animation Sequence
        Animated.sequence([
            // 1. Fade in Logo and Scale up
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // 2. Wait slightly
            Animated.delay(300),
            // 3. Fade in Text and Move up
            Animated.parallel([
                Animated.timing(textFadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // 4. Hold
            Animated.delay(1500),
            // 5. Fade out everything
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Navigate to Auth after animation
            router.replace('/onboarding/auth');
        });
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.logoCircle}>
                    <Text style={styles.logoIcon}>🛡️</Text>
                </View>
            </Animated.View>

            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: textFadeAnim,
                        transform: [{ translateY: textTranslateAnim }]
                    }
                ]}
            >
                <Text style={styles.title}>MED BRAIN</Text>
                <Text style={styles.subtitle}>Intelligence for Life</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F171A', // Deep cinematic dark
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(19, 200, 236, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(19, 200, 236, 0.3)',
        shadowColor: '#13c8ec',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    logoIcon: {
        fontSize: 64,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 4, // Cinematic spacing
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#9db4b9',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: '500',
    },
});
