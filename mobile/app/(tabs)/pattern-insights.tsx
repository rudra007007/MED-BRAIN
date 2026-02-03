import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Activity,
  Heart,
  Users,
  X,
  Zap,
  Check,
  ChevronDown
} from 'lucide-react-native';
import ChartScrubber from '../../components/ui/ChartScrubber';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { FadeInDown, LayoutAnimationConfig } from 'react-native-reanimated';

type CalendarDay = {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

function getCalendarDays(): CalendarDay[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: CalendarDay[] = [];
  const paddingBefore = firstDay.getDay();

  // Previous month padding
  for (let i = paddingBefore - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ day: d.getDate(), isCurrentMonth: false, isToday: false, date: d });
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    const isToday = i === now.getDate();
    days.push({ day: i, isCurrentMonth: true, isToday, date: d });
  }

  return days;
}

function CalendarDropdown({
  isVisible,
  onClose,
  textColor,
  subTextColor,
  accentColor,
  cardColor,
  borderColor
}: {
  isVisible: boolean;
  onClose: () => void;
  textColor: string;
  subTextColor: string;
  accentColor: string;
  cardColor: string;
  borderColor: string;
}) {
  const days = getCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      style={[styles.calendarContainer, { backgroundColor: cardColor, borderColor }]}
    >
      <View style={styles.calendarHeader}>
        <Text style={[styles.calendarMonthTitle, { color: textColor }]}>{monthName}</Text>
      </View>

      <View style={styles.calendarGrid}>
        <View style={styles.calendarWeekRow}>
          {weekDays.map((d, i) => (
            <Text key={i} style={[styles.calendarWeekLabel, { color: subTextColor }]}>{d}</Text>
          ))}
        </View>
        <View style={styles.calendarDaysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity key={index} style={styles.calendarDayCell} activeOpacity={0.7}>
              <View style={[
                styles.calendarDayCircle,
                day.isToday && { backgroundColor: accentColor }
              ]}>
                <Text style={[
                  styles.calendarDayText,
                  {
                    color: day.isToday ? '#000' : (day.isCurrentMonth ? textColor : subTextColor),
                    opacity: day.isCurrentMonth ? 1 : 0.3,
                    fontWeight: day.isToday ? '700' : '400'
                  }
                ]}>
                  {day.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

function WeeklyStreakStrip({
  textColor,
  subTextColor,
  accentColor,
  cardColor,
  onToggleCalendar,
  isCalendarOpen
}: {
  textColor: string;
  subTextColor: string;
  accentColor: string;
  cardColor: string;
  onToggleCalendar: () => void;
  isCalendarOpen: boolean;
}) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIndex = 2; // Tuesday based on image

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.streakContainer}>
      <View style={styles.streakHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleCalendar}
          style={styles.streakTitleRow}
        >
          <Text style={[styles.streakTitle, { color: textColor }]}>Today</Text>
          <Animated.View style={{ transform: [{ rotate: isCalendarOpen ? '180deg' : '0deg' }] }}>
            <ChevronDown size={24} color={textColor} />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.streakCountBadge}>
          <Text style={[styles.streakCount, { color: textColor }]}>3</Text>
          <Zap size={14} color={textColor} fill={textColor} />
        </View>
      </View>

      <View style={styles.weekRow}>
        {days.map((day, index) => {
          const isPast = index <= todayIndex;
          const isToday = index === todayIndex;

          return (
            <View key={index} style={styles.dayColumn}>
              <Text style={[styles.dayLabel, { color: subTextColor, opacity: isToday ? 1 : 0.6 }]}>{day}</Text>
              <View style={[
                styles.dayCircle,
                {
                  backgroundColor: isPast ? (isToday ? textColor : 'transparent') : 'transparent',
                  borderColor: isPast ? textColor : subTextColor,
                  borderWidth: isPast ? 0 : 1.5,
                  opacity: isPast ? 1 : 0.3
                }
              ]}>
                {isPast && (
                  <Check
                    size={12}
                    color={isToday ? cardColor : textColor}
                    strokeWidth={4}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

type ChartSection = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  data: number[];
  gradientColor: string;
  icon: React.ReactNode;
  insight?: {
    title: string;
    description: string;
  };
};

export default function PatternInsightsScreen() {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Theme Hooks
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'backgroundCard');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'tint');
  const statusBadgeBg = useThemeColor({}, 'backgroundAccent');
  const accentColor = useThemeColor({}, 'accent');

  const chartSections: ChartSection[] = [
    {
      id: 'sleep',
      title: 'Sleep Consistency',
      subtitle: 'Circadian Signal',
      status: 'Drifting Later',
      statusColor: '#14f1d9',
      data: [80, 75, 85, 60, 45, 40, 35],
      gradientColor: '#14f1d9',
      icon: <Heart size={20} color="#14f1d9" />,
      insight: {
        title: 'Change Point Identified',
        description: 'Sleep onset has drifted 45 minutes later over the last 4 days.'
      }
    },
    {
      id: 'physical',
      title: 'Physical Load',
      subtitle: 'Volume Index',
      status: 'Stable',
      statusColor: '#ffffff', // Might want to make this dynamic too, but status colors often stay semantic
      data: [60, 65, 62, 64, 58, 61, 65],
      gradientColor: '#2d9aff',
      icon: <Activity size={20} color="#2d9aff" />
    },
    {
      id: 'circadian',
      title: 'Circadian Consistency',
      subtitle: 'Routine Stability',
      status: 'High Variance',
      statusColor: '#2d9aff',
      data: [60, 20, 100, 30, 90, 40, 75],
      gradientColor: '#2d9aff',
      icon: <Zap size={20} color="#2d9aff" />,
      insight: {
        title: 'Routine Disruption',
        description: 'Variance in meal times and light exposure has increased by 18% compared to last month.'
      }
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <WeeklyStreakStrip
          textColor={textColor}
          subTextColor={subTextColor}
          accentColor={accentColor}
          cardColor={cardColor}
          isCalendarOpen={isCalendarOpen}
          onToggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)}
        />

        <CalendarDropdown
          isVisible={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          textColor={textColor}
          subTextColor={subTextColor}
          accentColor={accentColor}
          cardColor={cardColor}
          borderColor={borderColor}
        />

        <View style={{ height: 24 }} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Trend Analysis
          </Text>
          <Text style={[styles.sectionDescription, { color: subTextColor }]}>
            Comparison of biological signals against baseline. Scrub the charts to see precise daily variance.
          </Text>
        </View>

        {chartSections.map((section) => (
          <View key={section.id} style={[styles.chartCard, { backgroundColor: cardColor, borderColor }]}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: textColor }]}>{section.title}</Text>
                <Text style={[styles.chartSubtitle, { color: subTextColor }]}>{section.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { borderColor: section.statusColor, backgroundColor: statusBadgeBg }
                ]}
              >
                <Text style={[styles.statusText, { color: section.statusColor }]}>
                  {section.status}
                </Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <ChartScrubber
                data={section.data}
                height={120}
                gradientFrom={section.gradientColor}
                gradientTo={section.gradientColor}
              />
            </View>

            {section.insight && (
              <View style={[styles.insightCard, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor }]}>
                <View style={styles.insightHeader}>
                  <View
                    style={[
                      styles.insightIcon,
                      { backgroundColor: section.statusColor + '20' }
                    ]}
                  >
                    {section.icon}
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightTitle, { color: textColor }]}>{section.insight.title}</Text>
                    <Text style={[styles.insightDescription, { color: subTextColor }]}>{section.insight.description}</Text>
                  </View>
                </View>
              </View>
            )}

            {section.id === 'physical' && (
              <Text style={[styles.chartNote, { color: subTextColor }]}>
                Movement volume remains within 5% of your 90-day baseline.
              </Text>
            )}
          </View>
        ))}

        <View style={styles.communitySection}>
          <View style={styles.communityHeader}>
            <Users size={18} color={subTextColor} />
            <Text style={[styles.communityLabel, { color: subTextColor }]}>Community Pulse</Text>
          </View>
          <Text style={[styles.communityText, { color: subTextColor }]}>
            {`You are currently experiencing a similar "late-shift" drift as `}
            <Text style={styles.communityHighlight}>14% of people</Text>
            {` in your city this week.`}
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        textColor={textColor}
        subTextColor={subTextColor}
        backgroundColor={cardColor}
        borderColor={borderColor}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center'
  },
  infoButton: {
    padding: 8
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100
  },
  streakContainer: {
    marginBottom: 8,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  streakCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 12,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    marginTop: 8,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden'
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16
  },
  calendarMonthTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  calendarGrid: {
    gap: 12
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  calendarWeekLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7
  },
  calendarDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12
  },
  calendarDayCell: {
    width: '14.28%', // 100/7
    alignItems: 'center'
  },
  calendarDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendarDayText: {
    fontSize: 13
  },
  sectionHeader: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 20
  },
  chartCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4
  },
  chartSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  chartContainer: {
    height: 120,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  insightCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12
  },
  insightHeader: {
    flexDirection: 'row',
    gap: 12
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  insightContent: {
    flex: 1
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4
  },
  insightDescription: {
    fontSize: 12,
    lineHeight: 16
  },
  chartNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12
  },
  communitySection: {
    marginTop: 24,
    marginBottom: 24
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  communityLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  communityText: {
    fontSize: 14,
    lineHeight: 20
  },
  communityHighlight: {
    color: '#14f1d9',
    fontWeight: '600'
  },
  bottomSpacing: {
    height: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get('window').height * 0.85,
    minHeight: Dimensions.get('window').height * 0.5
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 4
  },
  modalScroll: {
    flex: 1
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24
  },
  infoSection: {
    marginBottom: 20
  },
  infoSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6
  },
  infoSectionDescription: {
    fontSize: 13,
    lineHeight: 18
  },
  modalFooter: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  modalFooterText: {
    fontSize: 11,
    textAlign: 'center'
  }
});

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  textColor: string;
  subTextColor: string;
  backgroundColor: string;
  borderColor: string;
};

function InfoModal({ visible, onClose, textColor, subTextColor, backgroundColor, borderColor }: InfoModalProps) {
  const infoSections = [
    {
      title: 'Sleep Consistency',
      description: 'Measures the regularity of your sleep schedule based on bedtime and wake time patterns. Consistent sleep helps regulate your circadian rhythm.'
    },
    {
      title: 'Physical Load',
      description: "Tracks your daily activity volume and intensity. Helps identify if you are overtraining or maintaining balanced activity levels."
    },
    {
      title: 'Circadian Consistency',
      description: 'Evaluates how steady your daily routines are, including meal times, light exposure, and activity patterns that influence your body clock.'
    },
    {
      title: 'Drift Analysis',
      description: 'Detects gradual shifts in your biological timing. Drifts can indicate stress, lifestyle changes, or emerging health patterns.'
    },
    {
      title: 'Community Pulse',
      description: 'Anonymous comparison of your trends against similar users in your area. Shows how your patterns align with peer groups.'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>About Insights</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <X size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalDescription, { color: subTextColor }]}>
                Interactive Lifestyle Trends analyzes your health data to provide personalized insights about your daily patterns and biological rhythms.
              </Text>

              {infoSections.map((section, index) => (
                <View key={index} style={styles.infoSection}>
                  <Text style={[styles.infoSectionTitle, { color: textColor }]}>{section.title}</Text>
                  <Text style={[styles.infoSectionDescription, { color: subTextColor }]}>{section.description}</Text>
                </View>
              ))}

              <View style={[styles.modalFooter, { borderTopColor: borderColor }]}>
                <Text style={[styles.modalFooterText, { color: subTextColor }]}>
                  Data is analyzed locally and never shared without your consent.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}