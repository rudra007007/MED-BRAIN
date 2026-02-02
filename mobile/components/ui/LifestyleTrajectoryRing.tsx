import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH * 0.75;
const RING_STROKE_WIDTH = 8;
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

  // Professional gradient colors - subtle and formal
  const PRIMARY = colorScheme === 'dark' ? '#14f1d9' : '#4A90E2';
  const SECONDARY = colorScheme === 'dark' ? '#4A90E2' : '#5BA3D0';
  const TERTIARY = colorScheme === 'dark' ? '#6B7FDE' : '#7B68EE';
  const ACCENT_LIGHT = colorScheme === 'dark' ? 'rgba(20, 241, 217, 0.6)' : 'rgba(74, 144, 226, 0.5)';
  const ACCENT_MID = colorScheme === 'dark' ? 'rgba(74, 144, 226, 0.6)' : 'rgba(91, 163, 208, 0.5)';
  const ACCENT_DARK = colorScheme === 'dark' ? 'rgba(107, 127, 222, 0.6)' : 'rgba(123, 104, 238, 0.5)';

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
              <Stop offset="0%" stopColor={PRIMARY} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={ACCENT_LIGHT} stopOpacity="0.7" />
            </LinearGradient>
            <LinearGradient id="middleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={SECONDARY} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={ACCENT_MID} stopOpacity="0.65" />
            </LinearGradient>
            <LinearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={TERTIARY} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={ACCENT_DARK} stopOpacity="0.6" />
            </LinearGradient>
          </Defs>

          {/* Background rings */}
          <Path 
            d={outerBgArc} 
            stroke={colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} 
            strokeWidth={RING_STROKE_WIDTH} 
            fill="none" 
            strokeLinecap="round"
          />
          <Path 
            d={middleBgArc} 
            stroke={colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} 
            strokeWidth={RING_STROKE_WIDTH} 
            fill="none" 
            strokeLinecap="round"
          />
          <Path 
            d={innerBgArc} 
            stroke={colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'} 
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
              fill={PRIMARY}
              fontSize="52"
              fontWeight="600"
              letterSpacing="-1"
            >
              {Math.round(primaryValue)}
            </SvgText>
            {secondaryValue !== undefined && (
              <SvgText
                x={CENTER}
                y={CENTER + 20}
                textAnchor="middle"
                fill={SECONDARY}
                fontSize="26"
                fontWeight="500"
                opacity="0.85"
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
          <Text style={[styles.statValue, { color: PRIMARY }]}>
            {routineConsistency}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Consistency</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: SECONDARY }]}>
            {lifestyleDrift}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Lifestyle</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 56,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
});
