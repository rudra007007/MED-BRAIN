import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH * 0.75;
const RING_STROKE_WIDTH = 12;
const CENTER = CHART_SIZE / 2;

interface LifestyleTrajectoryRingProps {
  lifestyleDrift?: number; // 0-100%
  riskTrajectory?: {
    previous: number;
    current: number;
    trend: 'increasing' | 'stable' | 'improving';
  };
  routineConsistency?: number; // 0-100%
  primaryValue?: number; // Primary metric to display (0-100)
  primaryLabel?: string; // Label for primary metric
  secondaryValue?: number; // Secondary metric
  secondaryLabel?: string; // Secondary label
  onPress?: () => void;
}

export default function LifestyleTrajectoryRing({
  lifestyleDrift = 35,
  riskTrajectory = { previous: 45, current: 42, trend: 'improving' },
  routineConsistency = 72,
  primaryValue = 0,
  primaryLabel = 'Health Score',
  secondaryValue = 24,
  secondaryLabel = '',
  onPress,
}: LifestyleTrajectoryRingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Neon gradient colors
  const CYAN = '#00FFFF';
  const BLUE = '#00E0FF';
  const TEAL = '#00FFA3';
  const DARK_TEAL = '#00FFD4';
  const PURPLE = '#BF00FF';
  const MAGENTA = '#FF00FF';

  // Calculate arc paths for circular progress
  const calculateArc = (percentage: number, radius: number, startAngle = -90) => {
    const endAngle = startAngle + (percentage / 100) * 360;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = CENTER + radius * Math.cos(startRad);
    const y1 = CENTER + radius * Math.sin(startRad);
    const x2 = CENTER + radius * Math.cos(endRad);
    const y2 = CENTER + radius * Math.sin(endRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Ring radii - 3 layers with equal spacing
  const outerRingRadius = CENTER - 20;
  const middleRingRadius = CENTER - 38;
  const innerRingRadius = CENTER - 56;

  // Calculate risk trajectory percentage
  const riskPercentage = riskTrajectory.trend === 'improving' ? 75 : 
                         riskTrajectory.trend === 'stable' ? 50 : 25;

  // Create arcs - 3 concentric rings
  const outerArc = calculateArc(lifestyleDrift, outerRingRadius);
  const middleArc = calculateArc(riskPercentage, middleRingRadius);
  const innerArc = calculateArc(routineConsistency, innerRingRadius);
  
  // Background arcs
  const outerBgArc = calculateArc(100, outerRingRadius);
  const middleBgArc = calculateArc(100, middleRingRadius);
  const innerBgArc = calculateArc(100, innerRingRadius);

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();
  }, [progressAnimation]);

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.backgroundCard }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.chartWrapper}>
        <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
          <Defs>
            <LinearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={CYAN} stopOpacity="1" />
              <Stop offset="100%" stopColor={TEAL} stopOpacity="0.8" />
            </LinearGradient>
            <LinearGradient id="middleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={PURPLE} stopOpacity="1" />
              <Stop offset="100%" stopColor={MAGENTA} stopOpacity="0.8" />
            </LinearGradient>
            <LinearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={BLUE} stopOpacity="1" />
              <Stop offset="100%" stopColor={DARK_TEAL} stopOpacity="0.8" />
            </LinearGradient>
          </Defs>

          {/* Background rings */}
          <Path 
            d={outerBgArc} 
            stroke="rgba(255,255,255,0.08)" 
            strokeWidth={RING_STROKE_WIDTH} 
            fill="none" 
            strokeLinecap="round"
          />
          <Path 
            d={middleBgArc} 
            stroke="rgba(255,255,255,0.07)" 
            strokeWidth={RING_STROKE_WIDTH} 
            fill="none" 
            strokeLinecap="round"
          />
          <Path 
            d={innerBgArc} 
            stroke="rgba(255,255,255,0.06)" 
            strokeWidth={RING_STROKE_WIDTH} 
            fill="none" 
            strokeLinecap="round"
          />

          {/* Outer ring - Cyan/Teal gradient */}
          <Path
            d={outerArc}
            stroke="url(#outerGradient)"
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Middle ring - Purple/Magenta gradient */}
          <Path
            d={middleArc}
            stroke="url(#middleGradient)"
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner ring - Blue gradient */}
          <Path
            d={innerArc}
            stroke="url(#innerGradient)"
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center text */}
          <G>
            <SvgText
              x={CENTER}
              y={CENTER - 18}
              textAnchor="middle"
              fill={CYAN}
              fontSize="56"
              fontWeight="700"
              letterSpacing="-1"
            >
              {Math.round(primaryValue)}
            </SvgText>
            {secondaryValue !== undefined && (
              <SvgText
                x={CENTER}
                y={CENTER + 20}
                textAnchor="middle"
                fill={BLUE}
                fontSize="28"
                fontWeight="600"
              >
                {Math.round(secondaryValue)}
              </SvgText>
            )}
          </G>
        </Svg>
      </View>

      {/* Stats below ring */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: CYAN }]}>
            ❤️ {routineConsistency}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Heart Pts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: BLUE }]}>
            👟 {lifestyleDrift}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Steps</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
